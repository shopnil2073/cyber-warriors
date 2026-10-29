# Vercel import-alias fix

Current `tsconfig.json` has:

```json
"paths": { "@/*": ["./app/*"] }
```

Therefore imports should be written like `@/lib/supabase` when the file is `app/lib/supabase.ts`. If a new file is `app/lib/db.ts`, its import is `@/lib/db` — not `@/app/lib/db`, which expands to `app/app/lib/db`.

In VS Code, `Ctrl+Shift+F` search for `@/app/`. Inspect each match and correct the path according to the real file location. Do not change valid relative imports automatically.

Then run `npm run build` locally, resolve any remaining missing-module errors, and only then push to GitHub/Vercel.
