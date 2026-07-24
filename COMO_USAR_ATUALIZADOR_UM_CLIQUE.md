# Atualizador do App Santa Cruz — um clique

1. Baixe a planilha e converta para JSON.
2. Coloque o JSON na pasta `planilhas`.
3. Dê dois cliques em `ATUALIZAR_APP.bat`.
4. O atualizador identifica automaticamente ensalamento, eventos e FAQ pelo conteúdo.
5. Ele usa o arquivo mais recente de cada tipo, cria backup em `backups/`, atualiza `src/data/dados.json` e executa `npm run build`.
6. Quando aparecer sucesso, rode:

```bash
git add .
git commit -m "Atualiza dados do app"
git push
```

Não é obrigatório apagar os JSONs antigos. O programa escolhe o mais recente. Caso prefira, pode manter apenas um JSON de cada tipo na pasta.

O arquivo `.bat` já é executado por duplo clique no Windows. Ele substitui a necessidade de abrir o terminal e escrever os comandos manualmente.
