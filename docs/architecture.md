# Visão Geral da Arquitetura

O SimuladorÁgil é uma aplicação fullstack composta por três camadas principais: **Frontend**, **Backend** e **Cache**.

## Diagrama Simplificado

```
┌─────────────────────────────────────────┐
│              Navegador                  │
│  (React 19 + Vite + PWA)               │
└──────────────┬──────────────────────────┘
               │ HTTPS / HTTP
┌──────────────▼──────────────────────────┐
│              Nginx (web)              │
│  - Serve SPA estática                  │
│  - Proxy /api/* → backend              │
│  - Rate limit básico (30 r/s)          │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
┌───────▼─────┐ ┌─────▼──────┐
│   Backend   │ │   Redis    │
│ (Spring Boot│ │  (cache)   │
│   4.0)      │ │            │
└───────┬─────┘ └────────────┘
        │
        │ HTTPS
┌───────▼────────────────────────┐
│  api.enem.dev                  │
│  (fonte externa de questões) │
└────────────────────────────────┘
```

## Componentes

### 1. Frontend (`apps/web`)
- **Tecnologia:** React 19, Vite 6, Vitest, Tailwind CSS v4.
- **Empacotamento:** Container Docker com Nginx. O build produz assets estáticos (`dist/`), eliminando a necessidade de runtime Node.js.
- **Comunicação com API:** utiliza caminhos relativos (`/api/questions`). Em produção/Docker, o Nginx reescreve `/api/*` para o backend. Em desenvolvimento local puro, isso exige um proxy ou CORS explícito.
- **PWA:** `vite-plugin-pwa` gera service worker e manifesto para funcionamento offline.

### 2. Backend (`apps/api`)
- **Tecnologia:** Java 25, Spring Boot 4.0, Gradle.
- **Responsabilidades:**
  - Receber requisições de geração de simulados via `POST /api/questions`.
  - Buscar questões do ENEM em `api.enem.dev` usando OpenFeign.
  - Aplicar resiliência (Spring Retry) para lidar com `429 Too Many Requests`.
  - Aplicar rate limiting (30 req/min por IP) via `RateLimitFilter`.
  - Retornar erros estruturados seguindo **RFC 7807** (Problem Details).
  - Cachear dados no Redis; fallback para cache em memória quando Redis não está disponível.

### 3. Cache (Redis)
- **Papel:** Cache distribuído para respostas da API externa e dados computacionalmente custosos.
- **Ausência:** Se o Redis não estiver acessível, a aplicação **não quebra** — usa cache em memória (`simple`) automaticamente.
- **Testes:** o perfil `test` desativa Redis e usa cache local.

## Fluxo de Dados Típico

1. O usuário preenche filtros (ano, área de conhecimento) no frontend.
2. O frontend envia `POST /api/questions` para o Nginx (ou proxy local).
3. O Nginx repassa para o backend Spring Boot.
4. O backend verifica o cache Redis:
   - **Hit:** retorna imediatamente.
   - **Miss:** chama `api.enem.dev`, armazena no Redis e retorna.
5. O backend aplica rate limiting e, em caso de erro da fonte externa, tenta novamente com backoff exponencial.
6. O frontend recebe o JSON e renderiza as questões com Markdown (`marked`).
7. O usuário pode exportar um PDF profissional via `@react-pdf/renderer`.

## Portas e Endpoints

| Serviço | Porta exposta | Endpoint principal | Healthcheck |
|---------|--------------|--------------------|-------------|
| Web     | 80           | `/`                | `http://web:80` |
| API     | 8080         | `POST /api/questions` | `http://api:8080/actuator/health` |
| Redis   | 6379 (interno) | — | `redis-cli ping` |

## Segurança

- **Rate limiting:** `RateLimitFilter` filtra por IP (`X-Forwarded-For` ou IP direto).
- **CORS:** configurado via `SecurityConfig.corsConfigurationSource`. Origens permitidas são definidas em `application.properties` (env `CORS_ALLOWED_ORIGINS`).
- **Nginx rate limit:** proteção adicional na camada de proxy (`limit_req zone=api_limit burst=10 nodelay`).

## Confiabilidade

- **Healthchecks:** Docker Compose aguarda `api` estar saudável antes de iniciar `web`.
- **Retry:** chamadas a `api.enem.dev` usam Spring Retry para transient failures.
- **Fallback de cache:** Redis é opcional; a aplicação roda sem ele.
