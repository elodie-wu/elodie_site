# elodiewu.com deployment setup

The application is configured to publish at the domain root, and `public/CNAME` contains `elodiewu.com`.

## GitHub Pages

1. Deploy the current build with `pnpm deploy` so the `gh-pages` branch is updated.
2. Open the repository **Settings → Pages**.
3. Confirm the publishing source is the `gh-pages` branch at `/ (root)`.
4. Set **Custom domain** to `elodiewu.com` and save it before changing DNS.

## DNS records

Create these apex-domain records with the DNS provider for `elodiewu.com`:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `elodie-wu.github.io` |

Do not add a wildcard DNS record. After GitHub's DNS check succeeds, enable **Enforce HTTPS** in the Pages settings. DNS propagation can take up to 24 hours.

Official reference: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
