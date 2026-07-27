# Ubuntu deployment

HALO Docs is a static export. Ubuntu serves `out/` directly with Nginx and
does not run a Next.js process or expose an application port.

## Release layout

```text
/var/www/halo/docs/
├── current -> releases/<git-sha>/out
└── releases/
    └── <git-sha>/
        └── out/
```

## First domain setup

1. Create an `A` record for `docs.agihalo.com` pointing to `34.64.86.0`.
2. Copy `deploy/nginx/docs.agihalo.com.conf` to
   `/etc/nginx/sites-available/docs.agihalo.com`.
3. Enable the site from `/etc/nginx/sites-enabled/`.
4. Run `sudo nginx -t`, then reload Nginx.
5. Issue the certificate with
   `sudo certbot --nginx -d docs.agihalo.com`.

The certificate command must run only after public DNS resolves to the HALO
server.
