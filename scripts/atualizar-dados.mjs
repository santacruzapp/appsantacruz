import fs from "fs";
import path from "path";

const tipo = process.argv[2];
const entrada = process.argv[3];

if (!tipo || !entrada) {
  console.error("Uso: node scripts/atualizar-dados.mjs <ensalamento|eventos|faq> <arquivo.json>");
  process.exit(1);
}

const arquivoEntrada = path.resolve(entrada);
const arquivoDados = path.resolve("src/data/dados.json");

if (!fs.existsSync(arquivoEntrada)) {
  console.error("Arquivo de entrada não encontrado:", arquivoEntrada);
  process.exit(1);
}

if (!fs.existsSync(arquivoDados)) {
  console.error("dados.json não encontrado em:", arquivoDados);
  process.exit(1);
}

const entradaRaw = JSON.parse(fs.readFileSync(arquivoEntrada, "utf-8"));
const dados = JSON.parse(fs.readFileSync(arquivoDados, "utf-8"));

function normalizarValor(valor) {
  if (valor === null || valor === undefined) return "";
  if (typeof valor === "number") return String(valor);
  return String(valor);
}

const mapas = {
  ensalamento: {
    "Semestre": "semestre",
    "Curso": "curso",
    "Período": "periodo",
    "Disciplina": "disciplina",
    "Professor(a)": "professor",
    "Dia": "dia",
    "Horário": "horario",
    "Sala": "sala",
    "Turno": "turno"
  },
  eventos: {
    "Evento": "titulo",
    "Descrição Evento": "descricao",
    "Local": "local",
    "Data": "data",
    "Horario": "horario"
  },
  faq: {
    "FAQ": "pergunta",
    "Descrição da FAQ": "resposta"
  }
};

function converter(lista, mapa) {
  return lista.map((linha) => {
    const item = {};
    for (const [campoOriginal, campoNovo] of Object.entries(mapa)) {
      item[campoNovo] = normalizarValor(linha[campoOriginal]);
    }
    return item;
  });
}

if (!Array.isArray(entradaRaw)) {
  console.error("O arquivo de entrada precisa ser uma lista JSON.");
  process.exit(1);
}

if (tipo === "ensalamento") {
  dados.ensalamentos = converter(entradaRaw, mapas.ensalamento);
} else if (tipo === "eventos") {
  dados.eventos = converter(entradaRaw, mapas.eventos);
} else if (tipo === "faq") {
  dados.faq = converter(entradaRaw, mapas.faq).map((item) => ({
    ...item,
    categoria: "Geral"
  }));
} else {
  console.error('Tipo inválido. Use "ensalamento", "eventos" ou "faq".');
  process.exit(1);
}

fs.writeFileSync(arquivoDados, JSON.stringify(dados, null, 2), "utf-8");

const chave =
  tipo === "ensalamento" ? "ensalamentos" :
  tipo === "eventos" ? "eventos" : "faq";

console.log(`✅ ${tipo} atualizado com sucesso em src/data/dados.json`);
console.log(`📦 Total de registros em ${chave}: ${dados[chave].length}`);
