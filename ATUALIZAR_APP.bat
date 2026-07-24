@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Atualizador Santa Cruz
cls

echo ======================================================
echo          ATUALIZADOR DO APP SANTA CRUZ
echo ======================================================
echo.
echo Procurando os JSONs mais recentes na pasta planilhas...
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERRO: Node.js nao foi encontrado neste computador.
  echo Instale o Node.js e execute o atualizador novamente.
  echo.
  pause
  exit /b 1
)

node scripts\atualizar-automatico.mjs
if errorlevel 1 (
  echo.
  echo A atualizacao falhou. Verifique a mensagem acima.
  pause
  exit /b 1
)

echo.
echo Validando o projeto com npm run build...
call npm.cmd run build
if errorlevel 1 (
  echo.
  echo ERRO NO BUILD. O backup esta na pasta backups.
  pause
  exit /b 1
)

echo.
echo Verificando o Git...
where git >nul 2>nul
if errorlevel 1 (
  echo.
  echo ERRO: Git nao foi encontrado neste computador.
  echo A atualizacao local e o build foram concluidos,
  echo mas nao foi possivel enviar ao GitHub.
  pause
  exit /b 1
)

git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo.
  echo ERRO: Esta pasta nao foi reconhecida como repositorio Git.
  echo A atualizacao local e o build foram concluidos,
  echo mas nao foi possivel enviar ao GitHub.
  pause
  exit /b 1
)

echo.
echo Preparando as alteracoes para o GitHub...
git add .
if errorlevel 1 (
  echo.
  echo ERRO ao executar git add.
  pause
  exit /b 1
)

git diff --cached --quiet
if not errorlevel 1 (
  echo.
  echo Nenhuma alteracao nova foi encontrada para enviar.
  echo O aplicativo local ja esta atualizado.
  echo.
  pause
  exit /b 0
)

echo.
echo Criando commit automatico...
git commit -m "Atualizacao automatica dos dados do aplicativo"
if errorlevel 1 (
  echo.
  echo ERRO ao criar o commit.
  echo Verifique se o nome e o e-mail do Git estao configurados.
  pause
  exit /b 1
)

echo.
echo Enviando as alteracoes para o GitHub...
git push
if errorlevel 1 (
  echo.
  echo ======================================================
  echo A ATUALIZACAO LOCAL E O COMMIT FORAM CONCLUIDOS,
  echo MAS O ENVIO AO GITHUB FALHOU.
  echo ======================================================
  echo Verifique sua internet, login do GitHub ou se existem
  echo alteracoes remotas que precisam ser baixadas primeiro.
  echo Depois, abra o terminal nesta pasta e execute: git push
  echo.
  pause
  exit /b 1
)

echo.
echo ======================================================
echo ATUALIZACAO, BUILD E ENVIO AO GITHUB CONCLUIDOS.
echo A Vercel deve iniciar a publicacao automaticamente.
echo ======================================================
echo.
pause
