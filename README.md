<div align="center">
  <img width="192" src="apps/web/public/icons/icon-192.png" alt="Logo SimuladorÁgil">
  <h1>Simulador<b>Ágil</b></h1>
  <p>Simulador inteligente que gera simulados personalizados do ENEM</p>

  [![API CI](https://github.com/DaniDMoura/SimuladorAgil/actions/workflows/api.yml/badge.svg)](https://github.com/DaniDMoura/SimuladorAgil/actions/workflows/api.yml)
  [![Web CI](https://github.com/DaniDMoura/SimuladorAgil/actions/workflows/web.yml/badge.svg)](https://github.com/DaniDMoura/SimuladorAgil/actions/workflows/web.yml)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

---

## 🚀 Quick Start

A maneira mais rápida de rodar o projeto localmente é com **Docker Compose**:

```bash
git clone https://github.com/DaniDMoura/SimuladorAgil.git
cd SimuladorAgil

# Copie as variáveis de ambiente (opcional — valores default já funcionam)
cp .env.example .env

# Suba tudo (backend, frontend, Redis)
docker compose up --build
```

- **Frontend:** http://localhost
- **Backend:** http://localhost:8080
- **Health:** http://localhost:8080/actuator/health

> Para desenvolvimento ativo (hot-reload), veja [docs/development.md](docs/development.md).

---

## 📋 Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 · Vite 6 · Vitest · Tailwind CSS v4 · PWA |
| **Backend** | Java 25 · Spring Boot 4.0 · Gradle · OpenFeign · Spring Retry |
| **Cache** | Redis (com fallback para cache em memória) |
| **Infra** | Docker · Nginx · GitHub Actions |

---

## 📚 Documentação

- **[Arquitetura](docs/architecture.md)** — como frontend, backend e Redis interagem.
- **[Decisões Arquiteturais](docs/decisions.md)** — por que Redis, por que Spring Retry, trade-offs.
- **[Desenvolvimento Local](docs/development.md)** — rodando backend e frontend separados, testes, lint.
- **[Como Contribuir](CONTRIBUTING.md)** — setup, commits, testes e processo de PR.

---

## 🛡️ Segurança & Qualidade

- Rate limiting (30 req/min) na API e no Nginx.
- CI roda em todo PR para `main`: testes, lint e build.
- Dependabot e CodeQL monitoram vulnerabilidades.
- Erros estruturados seguindo **RFC 7807** (Problem Details).

---

## 🌐 Demonstração

Acesse a versão online: **[https://simulado.site](https://simulado.site)**

---

## 📄 Licença

Distribuído sob a [Licença MIT](LICENSE).

---

> Projeto em constante evolução. Contribuições são bem-vindas!
