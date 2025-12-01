## Grocery App Monorepo

This repository is a **monorepo** containing:

- `apps/api` – .NET 8 Web API (`GroceryApp.API`)
- `apps/web` – React + Vite SPA
- `packages/contracts` – OpenAPI spec and generated TypeScript contracts/client

### Prerequisites

- .NET 8 SDK
- Node.js 20+ and npm

---

## Development

### API (`apps/api`)

```bash
cd apps/api
dotnet watch
```

The API will start on the ports configured in `Properties/launchSettings.json`
(`http://localhost:5273` by default for HTTP).

Swagger UI:

- `http://localhost:5273/swagger`

### Web (`apps/web`)

```bash
cd apps/web
npm install
npm run dev
```

By default the Vite dev server:

- Runs on `http://localhost:54522`
- Proxies `/api` requests to `http://localhost:5273` (or `VITE_API_URL` if set)

You can also set an explicit API URL:

```bash
VITE_API_URL=http://localhost:5273 npm run dev
```

---

## Scripts

From the repository root, you can use the following npm scripts:

- `dev:api` – `cd apps/api && dotnet watch`
- `dev:web` – `cd apps/web && npm run dev`
- `build:api` – `cd apps/api && dotnet build`
- `build:web` – `cd apps/web && npm install && npm run build`

---

## Build

### API

```bash
cd apps/api
dotnet build
```

### Web

```bash
cd apps/web
npm install
npm run build
```

### Contracts (optional)

If you decide to use the `packages/contracts` folder for shared API types in the future,
you can keep OpenAPI or any other contract tooling there. For now it is optional and
not required to run the API or web app.

