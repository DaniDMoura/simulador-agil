# Contribuindo com o SimuladorÁgil

Obrigado pelo interesse em contribuir! 🎉

## Ambiente de Desenvolvimento

### Opção rápida — Docker (recomendada para testar)

```bash
docker compose up --build
```

Acesse:
- Frontend: http://localhost
- Backend: http://localhost:8080

### Opção completa — Backend + Frontend separados (recomendada para desenvolver)

**Pré-requisitos**
- Node.js >= 20
- npm >= 9
- JDK >= 25 (o Gradle provisiona automaticamente via toolchain se necessário)

**Passos**

```bash
# 1. Clone o repositório
git clone https://github.com/DaniDMoura/SimuladorAgil.git
cd SimuladorAgil

# 2. Instale as dependências do frontend
cd apps/web
npm install

# 3. (opcional) Copie o .env.example do frontend
# cp .env.example .env

# 4. Terminal 1 — Backend
cd apps/api
./gradlew bootRun

# 5. Terminal 2 — Frontend
cd apps/web
npm run dev
```

> ⚠️ **CORS no dev server:** o backend permite `http://localhost` (Docker) mas **não** `http://localhost:5173`. Para desenvolver com o Vite dev server diretamente, configure um proxy no `vite.config.js` ou adicione a origem em `application.properties` (`cors.allowed-origins`).

## Testes

Execute os testes antes de abrir um PR:

```bash
# Frontend
cd apps/web
npm run lint
npm run test

# Backend
cd apps/api
./gradlew test
```

## Estilo de Código

- **Commits:** siga [Conventional Commits](https://www.conventionalcommits.org/).
  - Exemplos: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- **Frontend:** ESLint + Stylelint estão configurados. `npm run lint` deve passar.
- **Backend:** padrões do Spring Boot / Java. Não altere imports intencionais (ex: `tools.jackson.databind.ObjectMapper` em `QuestionControllerTest`).

## Fluxo de Pull Request

1. **Fork** o repositório.
2. Crie uma branch descritiva: `git checkout -b feat/minha-feature`.
3. Faça commits claros e atômicos.
4. Certifique-se de que **todos os testes passam** e o **lint está limpo**.
5. Abra um PR para a branch `main` com uma descrição clara do que mudou e por quê.
6. Aguarde a revisão. O CI deve ficar verde antes do merge.

## Documentação

- Para detalhes de arquitetura, consulte [`docs/architecture.md`](docs/architecture.md).
- Para setup detalhado de desenvolvimento, consulte [`docs/development.md`](docs/development.md).
- Para decisões arquiteturais, consulte [`docs/decisions.md`](docs/decisions.md).

## Dúvidas?

Abra uma [issue](https://github.com/DaniDMoura/SimuladorAgil/issues) ou entre em contato via Instagram [@danilosmoura_](https://www.instagram.com/danilosmoura_/).
