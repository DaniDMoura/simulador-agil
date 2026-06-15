# Decisões Arquiteturais

Este documento registra decisões importantes tomadas durante o desenvolvimento do SimuladorÁgil, com seus contextos, trade-offs e consequências.

## 1. Spring Boot 4.0 + JDK 25

**Contexto:** O backend precisava ser robusto, tipado e capaz de integrar-se facilmente com ecossistemas de cache, segurança e observabilidade.

**Decisão:** Adotar Java 25 com Spring Boot 4.0.

**Consequências:**
- ✅ Ecossistema maduro para cache, segurança, retry, healthchecks e testes.
- ✅ Gradle + Java toolchain provisionam JDK 25 automaticamente, reduzindo fricção de setup.
- ⚠️ Curva de aprendizado maior para contribuidores que não conhecem Java/Spring.

## 2. Redis com Fallback para Cache em Memória

**Contexto:** A fonte externa (`api.enem.dev`) tem rate limits. Cachear respostas reduz latência e custo de chamadas repetidas.

**Decisão:** Usar Redis em produção/Docker, mas permitir fallback transparente para cache em memória (`spring.cache.type=simple`) quando Redis está indisponível.

**Consequências:**
- ✅ A aplicação não quebra se o Redis cair.
- ✅ Em testes (perfil `test`), não é necessário subir Redis.
- ⚠️ Cache em memória não é compartilhado entre instâncias; escala horizontal exigiria Redis.

## 3. Nginx como Reverse Proxy no Docker

**Contexto:** O frontend precisa chamar `/api/questions` sem hardcodar domínios, e o backend precisa de CORS restrito.

**Decisão:** No Docker Compose, o container `web` (Nginx) serve a SPA e faz proxy de `/api/*` para o container `api`.

**Consequências:**
- ✅ Zero configuração de CORS dentro do Docker (tudo roda no mesmo domínio: `http://localhost`).
- ✅ Build do frontend é estático; não precisa de servidor Node.js em produção.
- ⚠️ Desenvolvimento local sem Docker (`npm run dev` na porta 5173) requer proxy ou origem CORS extra, porque o backend não aceita `localhost:5173` por padrão.

## 4. OpenFeign + Spring Retry para Integração Externa

**Contexto:** A API `api.enem.dev` é pública e pode retornar `429` (rate limit) ou falhas transitórias.

**Decisão:** Usar OpenFeign (declarativo) combinado com Spring Retry para backoff exponencial.

**Consequências:**
- ✅ Código de integração limpo e legível.
- ✅ Resiliência automática contra falhas transitórias.
- ⚠️ Retry pode mascarar problemas crônicos; logs de retry são configurados em `DEBUG`.

## 5. RFC 7807 (Problem Details) para Erros

**Contexto:** O frontend precisa mostrar mensagens de erro claras e estruturadas ao usuário.

**Decisão:** Padronizar respostas de erro no formato RFC 7807 (`application/problem+json`), com campos `type`, `title`, `status`, `detail` e `instance`.

**Consequências:**
- ✅ Frontend consome erros de forma previsível.
- ✅ Mensagens amigáveis e localizáveis.
- ⚠️ Requer disciplina para todos os handlers de erro retornarem o mesmo formato.

## 6. React 19 + Vite + PWA

**Contexto:** O frontend precisa ser rápido, moderno e oferecer experiência de app nativo em mobile.

**Decisão:** React 19 (com SWC via Vite), Tailwind CSS v4, e `vite-plugin-pwa` para service worker e manifesto.

**Consequências:**
- ✅ Build extremamente rápido com Vite + SWC.
- ✅ PWA permite acesso offline e ícones na home screen.
- ⚠️ PWA exige cuidado com cache de assets; updates podem precisar de refresh forçado.

## 7. Testes com Vitest (Frontend) e JUnit 5 + MockMvc (Backend)

**Contexto:** Necessidade de testes rápidos e confiáveis em ambos os lados.

**Decisão:**
- Frontend: Vitest + jsdom + Testing Library (globals habilitados no `vite.config.js`).
- Backend: JUnit 5 + MockMvc + perfil `test` com cache local.

**Consequências:**
- ✅ Frontend: testes unitários rápidos sem Jest.
- ✅ Backend: testes de integração nos controllers sem subir servidor real.
- ⚠️ Vitest + jsdom não cobre testes visuais de CSS (layout, fontes); isso é aceito como trade-off.
