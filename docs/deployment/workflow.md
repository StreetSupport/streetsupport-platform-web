# GitHub Actions Workflow: Test & Deploy

This repo uses a two-stage CI/CD workflow:

1️⃣ **Test job**  
2️⃣ **Deploy job** _(runs only on staging/main)_

---

## ✅ What the workflow does

| Job | What it does |
| --- | -------------- |
| `test` | - Checks out code<br>- Installs dependencies<br>- Runs unit tests, E2E tests, build check<br>- Fetches latest location data from DB (trusted runs only) |
| `deploy` | - Runs **after** tests pass<br>- Posts Slack notification (optional)<br>- Moves Trello card to Done list (optional) |

---

## ✅ Fork PRs vs trusted PRs

| Scenario | DB secrets available? | Locations fetch runs? |
| -------- | --------------------- | --------------------- |
| Push to staging/main | ✅ Yes | ✅ Yes |
| Same-repo PR | ✅ Yes | ✅ Yes |
| Fork PR | ❌ No | ✅ **Skipped automatically** |

👉 For fork PRs, a fallback `src/data/locations.json` must exist in the repo — the workflow skips live DB fetch for security.

---

## ✅ How to read conditions

| Key check | Meaning |
| --------- | ------- |
| `github.event_name == 'push'` | Always trusted |
| `github.event.pull_request.head.repo.full_name == github.repository` | PR from same repo (trusted) |
| Else | Fork PR (untrusted) |

---

## ✅ How to skip fetch in build

In `package.json`:
```json
"prebuild": "if [ \"$SKIP_FETCH\" != \"true\" ]; then npm run fetch:locations; else echo '⏭️  Skipping prebuild fetch'; fi"
```

The workflow sets `SKIP_FETCH=true` for fork PRs so `npm run build` won’t try to hit the DB when secrets are blocked.

---

## ✅ Best practice

- Use static JSON fallback for contributors.
- Keep secrets out of PR code.
- Document how secrets flow for maintainers.

---

✅ **For questions, see `SECRETS.md`.**
