<div align="center">
  <img width="192" src="apps/web/public/icons/icon-192.png" alt="Logo SimuladorÁgil">
  <h1>Simulador<b>Ágil</b></h1>
  <p>Simulador inteligente que gera simulados personalizados do ENEM</p>
  <a href="https://www.instagram.com/danilosmoura_/" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-Follow_@danilosmoura_-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram">
  </a>
  <a href="https://simulado.site">
    <img src="https://img.shields.io/website?url=https%3A%2F%2Fsimulado.site&style=for-the-badge" alt="Online">
  </a>
</div>

---

## Sobre o Projeto

O **SimuladorÁgil** é um simulador inteligente que gera simulados personalizados do ENEM em tempo real. O objetivo é proporcionar uma experiência de preparação otimizada, oferecendo questões adaptadas ao desempenho e às preferências do usuário, com foco em uma experiência visual moderna e profissional.

---

## Estrutura do Projeto

```
simulador-agil/
├── apps/
│   ├── api/          # Backend (Java/Spring Boot 4.0)
│   └── web/          # Frontend (React + Vite + Vitest)
├── scripts/
│   └── setup.sh      # Script de configuração automática
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

## Índice

- [Demonstração](#demonstração)
- [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
- [Funcionalidades](#funcionalidades)
- [Como Usar](#como-usar)
- [Como rodar com Docker](#como-rodar-com-docker)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)
- [Contato](#contato)

---

## Demonstração

- Acesse a versão online: [https://simulado.site](https://simulado.site)

---

## Arquitetura e Tecnologias

### Backend (API)

- **Linguagem:** Java (JDK 25)
- **Framework:** Spring Boot 4.0
- **Resiliência:** Spring Retry para chamadas de integração
- **Cache:** Redis
- **Segurança:** Spring Security com Rate Limiting e RFC 7807 (Problem Details)

### Frontend

- **Linguagem:** JavaScript
- **Framework:** React 19
- **Build Tool:** Vite
- **Testes:** Vitest + React Testing Library
- **Principais Bibliotecas:**
  - **axios:** requisições HTTP
  - **tanstack/react-query:** gerenciamento de estado assíncrono
  - **@react-pdf/renderer:** geração dinâmica de PDF
  - **marked:** renderização robusta de Markdown para questões

---

##  Funcionalidades

- **Simulados Personalizados:** Geração dinâmica com base em filtros de ano e área de conhecimento.
- **Banco de Questões do ENEM:** Utiliza questões reais do ENEM com renderização nativa de Markdown e imagens.
- **Relatórios em PDF Profissionais:** Exportação com layout otimizado em 2 colunas para impressão.
- **Feedback de Erro Detalhado:** Sistema de tratamento de erros baseado no padrão RFC 7807 para mensagens claras de validação.
- **Interface Moderna:** Design UX focado em produtividade com sistema de tipografia dual-font (Serif/Sans-serif).

---

## Como Usar

### 1. Versão Online

Acesse diretamente pelo navegador: [https://simulado.site](https://simulado.site)

### 2. Executar Localmente

#### Pré-requisitos

- [Node.js](https://nodejs.org/) (>= v20)
- [npm](https://www.npmjs.com/)
- [Java](https://www.oracle.com/java/technologies/downloads/) (>= 25)

#### Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/DaniDMoura/SimuladorAgil.git
cd SimuladorAgil

# Execute o script de setup
bash scripts/setup.sh
```

#### Executando o projeto

```bash
# Terminal 1 - API (Java/Spring Boot)
cd apps/api
./gradlew bootRun

# Terminal 2 - Web
cd apps/web
npm run dev
```

#### Executando Testes

```bash
# No diretório apps/web
npm run test
```

---

## Como rodar com Docker

### 1. Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

### 2. Rodando com Docker Compose

```bash
docker compose up --build
```

- **Frontend:** [http://localhost](http://localhost)
- **Backend:** [http://localhost:8080](http://localhost:8080)

---

## Como Contribuir

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Siga o padrão **Conventional Commits**.
4. Abra um Pull Request.

---

## Licença

Distribuído sob a Licença MIT.

---

## Contato

- **Desenvolvedor:** [@DaniDMoura](https://github.com/DaniDMoura)
- **Suporte:** Abra uma [issue](https://github.com/DaniDMoura/SimuladorAgil/issues).

---

> Projeto em constante evolução. Contribuições são bem-vindas!
