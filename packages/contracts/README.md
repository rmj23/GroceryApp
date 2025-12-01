## Grocery App Contracts

This package contains the **OpenAPI specification** and **generated TypeScript types/client** for the Grocery App API.

### Layout

- `openapi.json` – exported OpenAPI spec from `apps/api`
- `src/types.ts` – generated TypeScript types from the spec
- `src/client` – generated TypeScript API client

### Commands

- `npm run generate` – regenerate types and client from `openapi.json`
- `npm run generate:types` – only generate types
- `npm run generate:client` – only generate client

### Usage in apps/web

Install dependencies in the monorepo root or within `apps/web`, then import:

```ts
// Example usage once generation is wired and openapi.json exists
// import { paths } from '@grocery-app/contracts/src/types';
// import { Client } from '@grocery-app/contracts/src/client';
```

You will need to **export `openapi.json` from the API** (see root README for instructions)
before running `npm run generate` in this package.


