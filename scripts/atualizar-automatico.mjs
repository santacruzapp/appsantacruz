import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const raiz = path.resolve(__dirname, "..");
const pastaPlanilhas = path.join(raiz, "planilhas");
const arquivoDados = path.join(raiz, "src", "data", "dados.json");
const pastaBackups = path.join(raiz, "backups");
const arquivoEstado = path.join(pastaPlanilhas, ".ultima-atualizacao.json");

function falhar(mensagem) {
  console.error(`\nERRO: ${mensagem}`);
  process.exit(1);
}

function lerJson(arquivo) {
  try {
    return JSON.parse(fs.readFileSync(arquivo, "utf-8"));
  } catch (erro) {
    falhar(`Não foi possível ler o JSON \"${arquivo}\". ${erro.message}`);
  }
}

function normalizarValor(valor) {
  if (valor === null || valor === undefined) return "";
  return String(valor);
}

const configuracoes = {
  ensalamento: {
    chaveDestino: "ensalamentos",
    camposIdentificacao: ["Semestre", "Curso", "Período", "Disciplina"],
    mapa: {
      "Semestre": "semestre", "Curso": "curso", "Período": "periodo",
      "Disciplina": "disciplina", "Professor(a)": "professor",
      "Dia": "dia", "Horário": "horario", "Sala": "sala", "Turno": "turno"
    }
  },
  eventos: {
    chaveDestino: "eventos",
    camposIdentificacao: ["Evento", "Descrição Evento", "Local", "Data"],
    mapa: {
      "Evento": "titulo", "Descrição Evento": "descricao", "Local": "local",
      "Data": "data", "Horario": "horario"
    }
  },
  faq: {
    chaveDestino: "faq",
    camposIdentificacao: ["FAQ", "Descrição da FAQ"],
    mapa: { "FAQ": "pergunta", "Descrição da FAQ": "resposta" }
  }
};

function identificarTipo(lista) {
  if (!Array.isArray(lista) || lista.length === 0 || typeof lista[0] !== "object") return null;
  const chaves = new Set(Object.keys(lista[0]));
  for (const [tipo, config] of Object.entries(configuracoes)) {
    if (config.camposIdentificacao.every((campo) => chaves.has(campo))) return tipo;
  }
  return null;
}

function converter(lista, tipo) {
  const config = configuracoes[tipo];
  return lista.map((linha) => {
    const item = {};
    for (const [original, destino] of Object.entries(config.mapa)) {
      item[destino] = normalizarValor(linha[original]);
    }
    if (tipo === "faq") item.categoria = "Geral";
    return item;
  });
}

if (!fs.existsSync(pastaPlanilhas)) falhar(`A pasta não existe: ${pastaPlanilhas}`);
if (!fs.existsSync(arquivoDados)) falhar(`O arquivo principal não existe: ${arquivoDados}`);

const estado = fs.existsSync(arquivoEstado) ? lerJson(arquivoEstado) : {};
const candidatos = [];

for (const nome of fs.readdirSync(pastaPlanilhas)) {
  if (!nome.toLowerCase().endsWith(".json") || nome.startsWith(".")) continue;
  const arquivo = path.join(pastaPlanilhas, nome);
  const stat = fs.statSync(arquivo);
  const conteudo = lerJson(arquivo);
  const tipo = identificarTipo(conteudo);
  if (!tipo) {
    console.log(`IGNORADO: ${nome} (estrutura não reconhecida)`);
    continue;
  }
  candidatos.push({ tipo, nome, conteudo, mtimeMs: stat.mtimeMs });
}

if (candidatos.length === 0) falhar("Nenhum JSON reconhecido foi encontrado na pasta planilhas.");

const maisRecentes = {};
for (const candidato of candidatos) {
  if (!maisRecentes[candidato.tipo] || candidato.mtimeMs > maisRecentes[candidato.tipo].mtimeMs) {
    maisRecentes[candidato.tipo] = candidato;
  }
}

const paraAtualizar = Object.values(maisRecentes).filter((item) => {
  const anterior = estado[item.tipo];
  return !anterior || anterior.arquivo !== item.nome || anterior.mtimeMs !== item.mtimeMs;
});

if (paraAtualizar.length === 0) {
  console.log("\nNenhuma planilha nova foi detectada. O dados.json não foi alterado.");
  process.exit(0);
}

fs.mkdirSync(pastaBackups, { recursive: true });
const agora = new Date();
const carimbo = agora.toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
const backup = path.join(pastaBackups, `dados-${carimbo}.json`);
fs.copyFileSync(arquivoDados, backup);
console.log(`\nBackup criado: ${path.relative(raiz, backup)}`);

const dados = lerJson(arquivoDados);
for (const item of paraAtualizar) {
  const config = configuracoes[item.tipo];
  const convertidos = converter(item.conteudo, item.tipo);
  dados[config.chaveDestino] = convertidos;
  estado[item.tipo] = { arquivo: item.nome, mtimeMs: item.mtimeMs, atualizadoEm: agora.toISOString() };
  console.log(`ATUALIZADO: ${item.tipo} <- ${item.nome} (${convertidos.length} registros)`);
}

fs.writeFileSync(arquivoDados, JSON.stringify(dados, null, 2), "utf-8");
fs.writeFileSync(arquivoEstado, JSON.stringify(estado, null, 2), "utf-8");
console.log("\nSUCESSO: src/data/dados.json foi atualizado.");
