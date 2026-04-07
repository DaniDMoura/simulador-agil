# SimuladorAgil Server

This folder contains the backend server for **SimuladorAgil**. It provides an API for generating personalized ENEM practice exams ("simulados") in real time.

## Features

- RESTful API built with [FastAPI](https://fastapi.tiangolo.com/)
- Simulado generation using adaptive logic
- Data storage and access with SQLAlchemy
- Database migrations via Alembic

## Requirements

- Python >= 3.13
- Poetry (for dependency management)

## Installation

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install dependencies using Poetry:

   ```bash
   poetry install
   ```

3. (Optional) Set up and apply database migrations:

   ```bash
   poetry run alembic upgrade head
   ```

## Running the Server

Start the FastAPI development server:

```bash
poetry run uvicorn simulado_gen.main:app --reload
```

By default, the API will be available at [http://localhost:8000](http://localhost:8000).

## Project Structure

- `pyproject.toml`, `poetry.lock` — Python dependencies and project metadata
- `dados.json` — ENEM question data (or other relevant data)
- `simulado_gen/` — Main package containing:
  - `main.py` — FastAPI app entrypoint
  - `data.py` — Data handling and simulado logic
  - `__init__.py` — Package marker

## License

Distributed under the GNU GPL v3.0. See the root [LICENSE](../LICENSE) file for details.

---

Feel free to contribute or open issues!