# 📌 Street Support Network — New API Project Plan

---

## ✅ 1️⃣ Why we are rebuilding the API

- **Legacy issues:** The current API is old, undocumented, and hosted in a way that only the original developers fully understand.
- **Future control:** We now have full read access to the source database, so we can build a modern API tailored to the new platform’s needs.
- **Better maintainability:** Splitting public and admin functionality keeps the system simple, secure and easier to monitor and evolve.
- **Quality and trust:** This ensures that thousands of vulnerable people get reliable, up-to-date information.

---

## ✅ 2️⃣ Why we are splitting it

| | **Public Read API** | **Admin Write API** |
|---|---|---|
| **Purpose** | For the public website and anyone searching for help. | For trusted admins and partners to add, update or correct information. |
| **Optimisation** | Speed, filtering, search and caching. | Fully secured, with robust authentication and role-based permissions. |
| **Risk level** | Low risk of misuse or accidental edits. | Carefully controlled to prevent data errors. |

This follows modern best practice: serverless reads for speed and cost-efficiency, and a robust dedicated backend for secure writes.

---

## ✅ 3️⃣ What is a serverless API?

- **Serverless** means we don’t run a permanent server for public reads.
- Each data request runs as a small cloud function **only when needed**.
- This scales instantly and globally, handles spikes in traffic, and is cost-efficient.
- Vercel Pro provides this out of the box, optimised for Next.js.

---

## ✅ 4️⃣ How we will build it — step by step

### 🚀 A) Public Read API (Serverless)

**Purpose:** Powers the public website search, location pages, organisation pages and advice sections.

**How it works:**
- Small API routes live inside the same Next.js project.
- Each route connects securely to our MongoDB Atlas database.
- Each request supports filters, pagination and safe query validation.
- Addresses are returned nested inside organisations or services — no public “addresses endpoint”.

**Steps:**
1. Confirm read-only MongoDB user and connection string.
2. Create one route per collection:
   - `/api/cities`
   - `/api/client-groups`
   - `/api/faqs`
   - `/api/service-providers`
   - `/api/service-providers/[slug]`
   - `/api/services`
   - `/api/categories`
3. Add robust query params: location, category, page, limit.
4. Test each route with real data.
5. Connect the new front end to these endpoints.
6. Optimise caching where appropriate.
7. Document how to use each route.

---

### 🛠️ B) Admin Write API (Dedicated backend)

**Purpose:** Powers the new CMS for trusted admins to safely manage and edit data.

**How it works:**
- Built using Express or Fastify as a separate Node project.
- Uses a privileged read-write MongoDB user.
- Implements secure logins, bearer tokens or JWT, and role checks (organisation admin, location admin, super admin, etc).
- Provides routes for:
  - Creating and updating organisations.
  - Managing services.
  - Adding or updating addresses for service providers.
  - Managing FAQs and advice content.
- Runs on Azure App Service using our nonprofit credits.

**Steps:**
1. Request a new MongoDB user with read-write permissions.
2. Set up the backend project (`streetsupport-platform-api`).
3. Build secure CRUD routes with proper validation.
4. Implement robust authentication and role checks.
5. Deploy to Azure App Service.
6. Connect the new CMS front end to these secure endpoints.

---

## ✅ 5️⃣ How addresses fit in

- **In the database:** `ServiceProviderAddresses` remains a separate collection.
- **In the CMS:** Admins pick from a dropdown of saved addresses when adding or editing a service.
- **In the public API:** Addresses are embedded inside each organisation and service response — the public never fetches them separately.

---

## ✅ 6️⃣ Where it all lives

| **Layer** | **Where it’s stored** | **Where it runs** |
|---|---|---|
| Frontend | Next.js project (`streetsupport-platform-web`) | Vercel Pro |
| Public Read API | Serverless API routes in the Next.js project | Vercel Pro |
| Admin Write API | Express/Fastify backend (`streetsupport-platform-api`) | Azure App Service |
| Database | MongoDB Atlas | Remote, secure |

---

## ✅ 7️⃣ Key principles

- **Mobile-first and fast:** Optimised for low data usage and quick load times.
- **Safe and robust:** Queries validated, errors handled gracefully.
- **Fully documented:** So trustees, future developers and partners understand how it works.
- **Flexible:** Easy to expand or swap out later if needs grow.

---

## ✅ 8️⃣ Next Actions

- ✅ Finalise the public API design.
- ✅ Build and test one route at a time, starting with locations.
- ✅ Keep committing progress and documenting endpoints.
- ✅ Prepare the separate Write API in parallel as the CMS work begins.

---

## ✅ Summary

By splitting our API properly and designing it with modern tools, we guarantee a fast, safe, transparent system — fit for public trust and easy to maintain long-term.
