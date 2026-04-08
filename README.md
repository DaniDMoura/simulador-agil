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

O **SimuladorÁgil** é um simulador inteligente que gera simulados personalizados do ENEM em tempo real. O objetivo é proporcionar uma experiência de preparação otimizada, oferecendo questões adaptadas ao desempenho e às preferências do usuário, além de relatórios detalhados para acompanhamento do progresso.

---

## Estrutura do Projeto

```
simulador-agil/
├── apps/
│   ├── api/          # Backend (Java/Spring Boot)
│   └── web/          # Frontend (React + Vite)
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

- **Linguagem:** Java
- **Framework:** Spring Boot 4.0
- **Build Tool:** Gradle
- **Cache:** Redis
- **Segurança:** Spring Security com Rate Limiting

### Frontend

- **Linguagem:** JavaScript
- **Framework:** React
- **Build Tool:** Vite
- **Estilização:** CSS3
- **Principais Bibliotecas:**
  - **axios:** requisições HTTP à API
  - **react-query:** gerenciamento de dados assíncronos
  - **@react-pdf/renderer:** geração dinâmica de relatórios PDF

---

##  Funcionalidades

- **Simulados Personalizados:** Geração dinâmica com base no desempenho e preferências do usuário
- **Banco de Questões do ENEM:** Utiliza questões reais e/ou simuladas no formato oficial
- **Relatórios em PDF:** Exportação de desempenho detalhado
- **Feedback em Tempo Real:** Correção imediata com análise de acertos, erros e sugestões de melhoria
- **Interface Responsiva:** Design intuitivo adaptado para dispositivos móveis e desktop

---

## Como Usar

### 1. Versão Online

Acesse diretamente pelo navegador: [https://simulado.site](https://simulado.site)

### 2. Executar Localmente

#### Pré-requisitos

- [Node.js](https://nodejs.org/) (>= v16)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Java](https://www.oracle.com/java/technologies/downloads/) (>= 25)
- [Gradle](https://gradle.org/) (ou usar gradlew incluso)

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

Abra [http://localhost:5173](http://localhost:5173) no navegador para visualizar o projeto.

#### Configuração da API

O backend precisa do Redis para funcionar. Você pode usar Docker:

```bash
docker run -d -p 6379:6379 redis:alpine
```

---

## Como rodar com Docker

### 1. Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

### 2. Rodando com Docker Compose

```bash
# Clone o repositório
git clone https://github.com/DaniDMoura/SimuladorAgil.git
cd SimuladorAgil

# Execute o docker compose
docker compose up --build
```

#### O que acontece?

- O Docker irá construir imagens para o frontend e backend automaticamente.
- Os containers serão iniciados:
  - O frontend estará disponível em: [http://localhost](http://localhost)
  - O backend estará disponível em: [http://localhost:8080](http://localhost:8080)

#### Parando os containers

```bash
docker compose down
```

---

## Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature/correção (`git checkout -b feature/minha-feature`)
3. Faça commit das suas alterações (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

Consulte as [issues](https://github.com/DaniDMoura/SimuladorAgil/issues) para ver sugestões, bugs reportados ou novas funcionalidades.

---

## Licença

Distribuído sob a Licença GNU General Public License v3.0. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Contato

- **Desenvolvedor:** [@DaniDMoura](https://github.com/DaniDMoura)
- **Suporte:** Dúvidas, sugestões ou feedback? Abra uma [issue](https://github.com/DaniDMoura/SimuladorAgil/issues).

---

> Projeto em constante evolução. Contribuições são bem-vindas!
