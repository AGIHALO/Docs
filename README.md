# HALO Docs

Dedicated Next.js documentation site for `docs.agihalo.com`.

## Commands

```bash
npm install
npm run lint
npm run build
```

`npm run build` emits the static site to `out/`. Production serves `out/`
directly with Nginx; there is no Next.js runtime process or public application
port.

## Content contract

- Document production behavior from the deployed backend and SDK commits.
- Mark non-production capabilities as `Preview`.
- Never put private API keys, provider secrets, Resend keys, or refresh tokens
  in examples.
- Project Authentication and HALO account authentication are separate systems.
