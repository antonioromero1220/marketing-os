# How to Deploy

Follow these steps to deploy Growthub locally and to a production environment. The commands assume you have `pnpm` and `supabase` CLI tools installed.

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourgrowthub/marketing-os.git
   cd marketing-os
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start Supabase**
   ```bash
   supabase start
   ```
   This will spin up Postgres, Auth, and Storage services using Docker.

4. **Run the dev server**
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` to view the app.

## Building OSS Packages

Before deploying you must build the open‑core libraries so that the app can consume them.

```bash
pnpm build:oss
```

This compiles `@growthub/schemas` and `@growthub/primitives` into the `dist/` directories and updates TypeScript references.

## Deploying to Vercel

1. **Create a new Vercel project** pointing at `apps/growthub-app`.
2. Set the environment variables for Supabase URL and anon key.
3. Enable the `pnpm` build step with the command `pnpm build`.
4. The Vercel project will automatically deploy on every push to the `main` branch.

If you want to run the infrastructure (Supabase migration scripts and agent tasks) separately, create a second Vercel project pointing at the `infra` directory. This keeps background tasks isolated from the front‑end runtime.

## Customization

- **Branding** – Update your brand kits in Supabase or through the brand management UI.
- **Agents** – Modify agent behaviors under `src/lib/inngest/functions` but remember to document changes in `infra/meta`.
- **API Endpoints** – Add new routes in `pages/api` or `src/app/api` depending on your framework version.

Forking companies can replace the Supabase project ID with their own and redeploy under a different domain. 