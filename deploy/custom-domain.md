# Moving to our own domain (later)

Nothing in the site depends on the host, so this is config only:

1. Copy `CNAME.example` to `public/CNAME` and put the domain in it (e.g. `engineering.example.ac.th`).
   The build copies it into `out/`. Build without `BASE_PATH` (the site is at the domain root).
2. DNS: subdomain → `CNAME` record to `<user-or-org>.github.io`;
   apex domain → `A` records `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`.
3. Repo **Settings → Pages → Custom domain**, then tick **Enforce HTTPS** once the certificate is issued.
4. Update the `<link rel="canonical">`/sitemap URLs if they were added.

To host elsewhere (Netlify, S3, university server): upload the contents of `out/`.
