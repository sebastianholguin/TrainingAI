# Stack Notes — Gotchas and Setup Decisions

Things that broke the build (or the tests) while setting this project up, and why the current configuration is the way it is. Read this before changing build config or upgrading packages — most of these look like arbitrary pins until you hit the failure they prevent.

## Backend — .NET 10

### `Microsoft.OpenApi` is pinned to 2.12.2 on purpose

The `webapi` template pulls in `Microsoft.OpenApi` 2.0.0 transitively, which carries a known vulnerability advisory (NU1903). The obvious fix — `dotnet add package Microsoft.OpenApi` — installs 3.x and **breaks the build**:

```
error CS0200: Property or indexer 'IOpenApiMediaType.Example' cannot be assigned to -- it is read only
```

That error comes from `Microsoft.AspNetCore.OpenApi`'s XML-comment source generator, which is compiled against the 2.x API surface. The fix is a patched 2.x rather than a major upgrade:

```bash
dotnet add EmployeeApi package Microsoft.OpenApi --version 2.12.2
```

Revisit only when `Microsoft.AspNetCore.OpenApi` itself ships 3.x-compatible generators.

### Test isolation: one database per test class, not per test

`EmployeeApiFactory` gives each **class** its own in-memory database via a GUID-suffixed name. Because `IClassFixture` shares that factory across every test in the class and xUnit runs them in an unspecified order, tests that create records are visible to tests that list them.

The practical consequence: **never assert an exact row count**. `Assert.Equal(3, employees.Count)` passes alone and fails in a full run once a sibling test adds a record. Assert on presence instead (`Assert.Contains`) or give the test its own factory instance.

### `launchSettings.json` ports are pinned

The template generates a random port. It's pinned to `5080` (http) / `7080` (https) so the frontend's default `VITE_API_URL` and the API's CORS policy can both hardcode it without drifting. Change one, change all three.

## Frontend — Vite 8 / React / TypeScript

### `erasableSyntaxOnly` forbids constructor parameter properties

The `react-ts` template enables `erasableSyntaxOnly`, so this — normal, idiomatic TypeScript — is a compile error:

```ts
constructor(message: string, readonly status: number) {}   // error TS1294
```

Declare the fields explicitly and assign them in the body instead (see `src/lib/types.ts`). The setting exists so TypeScript can be stripped rather than compiled; parameter properties emit runtime code, so they're out.

### `baseUrl` is deprecated — use `paths` alone

Setting `baseUrl` for the `@/*` alias produces:

```
error TS5101: Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0
```

Modern TypeScript resolves `paths` relative to the tsconfig that declares them, so `baseUrl` is redundant. Both `tsconfig.json` and `tsconfig.app.json` declare `paths` and neither declares `baseUrl` — the alias must be in **both**, since `tsconfig.app.json` is what actually type-checks `src/`.

### Use `import.meta.url`, not `__dirname`, in `vite.config.ts`

Vite's forthcoming native config loader doesn't provide `__dirname` and warns about it. The alias uses `new URL('./src', import.meta.url).pathname`.

### `shadcn init` has no `--base-color` flag

It's `npx shadcn@latest init --defaults --yes`; passing `--base-color` fails outright. Theme colors are set afterwards by overriding the CSS variables in `src/index.css` — which is the better place anyway, since every shadcn component reads from them.

## Theming

The indigo palette from the mockups is applied by overriding shadcn's CSS variables in `src/index.css` (`--primary`, `--accent`, `--background`, `--destructive`, `--ring`, `--radius`) rather than by putting literal colors on components. Values are in `oklch` because that's the format shadcn generates; converting is easier than fighting the format. See [guidelines/employees/ui-guidelines.md](guidelines/employees/ui-guidelines.md) for the hex sources.

## Git

`git mv` fails on directories that git isn't tracking yet:

```
fatal: source directory is empty, source=specs, destination=docs/specs
```

Before the first commit, plain `mv` is the right tool. `git mv` only works once the files are tracked.
