# AGENTS.md — SimuladorÁgil

## Stack reality check

- **Backend is Java / Spring Boot 4.0 (JDK 25), NOT Python/FastAPI.** `apps/web/README.md` and `scripts/setup.sh` are stale and reference Python/Poetry. Trust `apps/api/build.gradle` and `apps/api/Dockerfile`.
- **Frontend:** React 19 + Vite 6 + Vitest + Tailwind CSS v4 (`@tailwindcss/vite`).
- **No monorepo tool.** `apps/api` and `apps/web` are independent packages. Run commands from each app directory.

## Running locally

### Backend

```bash
cd apps/api
./gradlew bootRun
```

- Requires JDK 25. Gradle will auto-provision it via the Java toolchain if your default JDK is older.
- Default port: `8080`.
- Health endpoint: `http://localhost:8080/actuator/health`.

### Frontend

```bash
cd apps/web
npm install   # if node_modules is missing
npm run dev
```

- Dev server runs on `http://localhost:5173`.

### Full stack (recommended for local integration)

```bash
docker compose up --build
```

- Web: `http://localhost`
- API: `http://localhost:8080`
- Redis is started automatically for caching.

## Testing

```bash
# Frontend
cd apps/web
npm run test        # vitest run

# Backend
cd apps/api
./gradlew test
```

- Frontend tests use `jsdom` and `@testing-library/react`. Globals are enabled in `vite.config.js`.
- Backend tests use JUnit 5 + MockMvc. The `test` profile disables Redis and uses an in-memory cache (`application-test.properties`).

## Lint / build

```bash
cd apps/web
npm run lint        # eslint + stylelint
npm run build       # production build → dist/
```

- `npm run lint` currently passes (optional catch binding is valid since ES2019 / ecmaVersion 2020).
- `npm run build` succeeds.

## Local dev CORS gotcha

The API CORS bean (`SecurityConfig.corsConfigurationSource`) allows:

- `http://localhost`
- `https://www.simulado.site`
- `http://web`

It does **not** allow `http://localhost:5173`. If you run the Vite dev server directly, browser requests to `/api/questions` will be blocked by CORS unless you proxy them or update the allowed origins.

In Docker, nginx proxies `/api/*` to the API, so CORS is not an issue.

## Architecture notes

- **API entrypoint:** `apps/api/src/main/java/com/danidmoura/simulador_agil/api/ApiApplication.java`
- **Main API route:** `POST /api/questions` → `QuestionController`
- **External dependency:** API fetches questions from `https://api.enem.dev/v1/exams/{year}/questions` via OpenFeign, with Spring Retry on 429 responses.
- **Rate limiting:** `RateLimitFilter` enforces 30 requests/minute per IP on the API.
- **Cache:** Redis-backed caching in production (`CacheConfig` is disabled in the `test` profile).
- **Frontend entrypoint:** `apps/web/src/main.jsx`; root component `App.jsx`.
- **Frontend API calls:** `services/questionService.js` posts to `/api/questions` (relative path, relies on nginx proxy in production/Docker).
- **PWA:** `vite-plugin-pwa` generates a service worker and manifest; icons live in `apps/web/public/icons/`.

## CI / workflow

Two path-based workflows run on GitHub Actions:

- `.github/workflows/web.yml` — triggers on `apps/web/**` changes. Runs lint, tests, build, and deploys to Vercel.
- `.github/workflows/api.yml` — triggers on `apps/api/**` changes. Runs Gradle tests, then triggers the Render deploy hook to deploy the API.

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel personal access token |
| `VERCEL_ORG_ID` | Vercel team / user ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `RENDER_DEPLOY_HOOK` | Render deploy hook URL for the API service |

### How to obtain Vercel secrets

```bash
npx vercel login
npx vercel teams list        # copy id → VERCEL_ORG_ID
npx vercel projects          # copy id → VERCEL_PROJECT_ID
npx vercel tokens create     # create token → VERCEL_TOKEN
```

### How to obtain RENDER_DEPLOY_HOOK

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your API service
3. Go to **Settings** → **Deploy Hook**
4. Copy the hook URL (e.g., `https://api.render.com/deploy/srv-xxx?key=yyy`)
5. Add to this repository's secrets as `RENDER_DEPLOY_HOOK`

## Codebase notes

- The test `QuestionControllerTest` intentionally imports `tools.jackson.databind.ObjectMapper` (not the Spring Boot 2 `com.fasterxml.jackson` package). Do not change this import.
- `npm run lint` currently passes (optional catch binding is valid since ES2019 / ecmaVersion 2020).

## Conventions

- Project README requests **Conventional Commits**.
- MIT license (`LICENSE`).
