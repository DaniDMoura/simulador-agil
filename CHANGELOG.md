# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Open-source readiness: Docker Compose quick start, `CONTRIBUTING.md`, `docs/`, and improved CI (Dependabot, release automation).
- Root-level `.env.example` with sensible defaults for backend, frontend, and Redis.

## [1.0.0] - 2026-06-15

### Added
- Initial release of SimuladorÁgil.
- Fullstack ENEM simulator with Spring Boot 4.0 backend and React 19 + Vite frontend.
- Redis-backed caching with in-memory fallback for tests.
- Rate limiting (30 req/min) and RFC 7807 Problem Details error handling.
- PDF report generation via `@react-pdf/renderer`.
- PWA support via `vite-plugin-pwa`.
- GitHub Actions CI/CD for web (Vercel) and API (Render).

[unreleased]: https://github.com/DaniDMoura/SimuladorAgil/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/DaniDMoura/SimuladorAgil/releases/tag/v1.0.0
