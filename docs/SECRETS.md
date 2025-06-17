# Repository Secrets

This project uses GitHub Actions secrets for secure, automated deploys and CI builds.  
Below are the required secrets for builds and deployments.

## ✅ Required Secrets

| Name             | Description                                          | Scope          |
| ---------------- | ---------------------------------------------------- | -------------- |
| `MONGODB_URI`    | Connection string to your MongoDB cluster (read-only recommended) | **Required** for trusted PRs and main/staging builds |
| `SLACK_WEBHOOK_URL` | Slack webhook URL for deployment notifications    | Optional but recommended |
| `TRELLO_API_KEY` | Trello API key for moving cards after deploy         | Optional |
| `TRELLO_API_TOKEN` | Trello API token for moving cards after deploy     | Optional |
| `TRELLO_BOARD_ID` | Trello board ID                                     | Optional |
| `TRELLO_DONE_LIST_ID` | Trello list ID where done cards go             | Optional |

---

## ✅ Where to add

- **For main repo**:  
  - Go to **Settings → Secrets and Variables → Actions → Repository secrets**.
  - Add each secret by name exactly as above.

- **For your fork**:  
  - You must add these manually to your fork’s secrets if you need CI to fetch live data or deploy.  
  - For fork PRs, secrets do not pass automatically — this is a GitHub security rule.

---

## ✅ Best practice

- Use read-only database credentials for `MONGODB_URI`.
- Keep `locations.json` checked into the repo so fork PRs always have fallback data.
- Never commit secrets directly to code or `.env` files.

---

## ✅ Why this matters

Fork PRs cannot read secrets by design — so our workflow:
- Runs `fetch-locations` only for trusted pushes or same-repo PRs.
- Uses static data otherwise.

This protects production secrets and keeps open source PRs safe.
