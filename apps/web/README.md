# SimuladorÁgil Web

Frontend do **SimuladorÁgil**, aplicação web para geração de simulados personalizados do ENEM. Construído com React 19 e Vite.

## Stack

- React 19 + Vite 6
- Tailwind CSS v4
- Vitest + Testing Library
- PWA (vite-plugin-pwa)
- Axios + TanStack Query
- @react-pdf/renderer (PDF) + marked (Markdown)

## Requisitos

- Node.js >= 20
- npm >= 9

## Desenvolvimento

```bash
cd apps/web
npm install
npm run dev
```

O servidor de desenvolvimento inicia em `http://localhost:5173`.

> ⚠️ Veja [`docs/development.md`](../../docs/development.md) sobre o gotcha de CORS com o dev server.

## Scripts úteis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção → `dist/` |
| `npm run test` | Testes com Vitest (run once) |
| `npm run lint` | ESLint + Stylelint |

## Licença

MIT. Veja o arquivo [LICENSE](../../LICENSE) na raiz do projeto.
