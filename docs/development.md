# Guia de Desenvolvimento Local

Este documento complementa o [`CONTRIBUTING.md`](../CONTRIBUTING.md) com instruções detalhadas para rodar e testar o projeto em modo de desenvolvimento ativo.

## Índice

- [Docker Compose (recomendado para integração)](#docker-compose-recomendado-para-integração)
- [Modo separado (recomendado para codar)](#modo-separado-recomendado-para-codar)
- [Testes](#testes)
- [Lint e build](#lint-e-build)
- [Dicas e Troubleshooting](#dicas-e-troubleshooting)

---

## Docker Compose (recomendado para integração)

Suba tudo de uma vez para verificar o fluxo end-to-end:

```bash
cp .env.example .env   # opcional — valores default já funcionam
docker compose up --build
```

Acesse:
- **Web:** http://localhost
- **API:** http://localhost:8080
- **Health:** http://localhost:8080/actuator/health

Para parar:

```bash
docker compose down
```

Para resetar volumes (limpar cache Redis):

```bash
docker compose down -v
```

## Modo separado (recomendado para codar)

Ideal quando você está trabalhando ativamente no código e precisa de hot-reload rápido.

### Pré-requisitos

| Ferramenta | Versão mínima | Observação |
|------------|--------------|------------|
| Node.js    | 20           | `node --version` |
| npm        | 9            | vem com Node.js |
| JDK        | 25           | Gradle baixa automaticamente via toolchain se necessário |

### Passo a passo

**1. Instale dependências do frontend**

```bash
cd apps/web
npm install
```

**2. (Opcional) Configure variáveis de ambiente do frontend**

```bash
cp apps/web/.env.example apps/web/.env
# edite VITE_API_URL se necessário
```

**3. Terminal 1 — Backend**

```bash
cd apps/api
./gradlew bootRun
```

Aguarde a mensagem de startup do Spring Boot. A API estará em `http://localhost:8080`.

**4. Terminal 2 — Frontend**

```bash
cd apps/web
npm run dev
```

O Vite dev server iniciará em `http://localhost:5173`.

> ⚠️ **CORS:** por padrão, o backend **não** aceita requisições de `http://localhost:5173`. Para resolver, escolha **uma** das opções:
> 1. **Proxy no Vite:** configure `vite.config.js` para proxy de `/api` para `http://localhost:8080`.
> 2. **Origem extra no backend:** adicione `http://localhost:5173` em `apps/api/src/main/resources/application.properties` na propriedade `cors.allowed-origins`.

## Testes

### Frontend

```bash
cd apps/web
npm run test        # execução única (vitest run)
```

Para modo watch durante desenvolvimento:

```bash
npx vitest
```

### Backend

```bash
cd apps/api
./gradlew test
```

Relatórios HTML são gerados em `apps/api/build/reports/tests/test/index.html`.

### Toda a stack

```bash
# Terminal 1
cd apps/api && ./gradlew test

# Terminal 2
cd apps/web && npm run test
```

## Lint e build

### Frontend

```bash
cd apps/web
npm run lint        # eslint + stylelint
npm run build       # build de produção → dist/
```

### Backend

O backend não tem um linter configurado além da compilação do Java. O Gradle já valida tipos e sintaxe:

```bash
cd apps/api
./gradlew build
```

## Dicas e Troubleshooting

### Gradle demora na primeira execução

O Gradle wrapper pode baixar a distribuição e dependências na primeira vez. Isso é normal. Execuções subsequentes são muito mais rápidas.

### `java.net.UnknownHostException: redis` fora do Docker

Isso é esperado se você rodar `./gradlew bootRun` localmente sem ter um Redis. A aplicação já cai automaticamente para cache em memória (`simple`), então **não é um erro crítico** — apenas um aviso no log.

### Porta 8080 ou 5173 já está em uso

```bash
# Linux / macOS
lsof -i :8080
kill -9 <PID>

# Ou use portas alternativas
./gradlew bootRun --args='--server.port=8081'
npm run dev -- --port 5174
```

### Testes falham no CI mas passam localmente

- Verifique se o `npm run lint` está limpo.
- Verifique se você não tem alterações não commitadas que afetem o `package-lock.json`.
- O CI usa `npm ci`, que é estrito com o lockfile.

### Atualizar dependências

```bash
cd apps/web
npm update
npm audit fix
```

Para o backend, o Gradle não tem um equivalente direto ao `npm audit`, mas o Dependabot está configurado no repositório para abrir PRs de segurança automaticamente.
