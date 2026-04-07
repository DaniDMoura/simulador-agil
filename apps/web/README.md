# SimuladorAgil Client

This folder contains the frontend for **SimuladorAgil**, a web application for generating and taking personalized ENEM practice exams ("simulados"). The client is built with modern JavaScript, using [Vite](https://vitejs.dev/) as the build tool.

## Features

- Fast, modern frontend with Vite
- React-based UI (assumed based on standard frontend structure)
- Responsive design for use on desktop and mobile
- Communicates with the FastAPI backend to fetch and submit simulado data

## Requirements

- Node.js >= 18 (recommended)
- npm >= 9 or [pnpm](https://pnpm.io/) (optional)

## Installation

1. Navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

## Running the Client (Development)

Start the development server:

```bash
npm run dev
# or
pnpm dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Building for Production

To build the app for production:

```bash
npm run build
# or
pnpm build
```

The output will be in the `dist/` folder.

## Project Structure

- `public/` — Static assets
- `src/` — Main source code (components, pages, styles, etc.)
- `index.html` — HTML entry point
- `package.json` — Project metadata and scripts
- `vite.config.js` — Vite configuration
- `.gitignore`, `eslint.config.js` — Development tooling

## License

Distributed under the GNU GPL v3.0. See the root [LICENSE](../LICENSE) file for details.

---

Feel free to contribute or open issues!