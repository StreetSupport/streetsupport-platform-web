
# Street Support Network – Website Rebuild
![Build Status](https://github.com/streetsupport/streetsupport-platform-web/actions/workflows/main.yml/badge.svg)

This is the future-proof rebuild of the Street Support Network website.

It provides a modular, maintainable platform to help people experiencing or at risk of homelessness find the support they need. The platform is being rebuilt from the ground up using modern technologies, with a focus on accessibility, sustainability, and long-term maintainability.

---

## 🔧 Core Principles

This project is built with the following principles in mind:

- ✅ **Test-Driven Development (TDD)**  
  Write unit, integration, and end-to-end tests from the beginning. CI pipelines enforce test passing before deployment.

- ✅ **Mobile-First and Fully Responsive**  
  Tailwind CSS is used with a mobile-first approach. Layouts scale cleanly with `sm:`, `md:`, `lg:` breakpoints.

- ✅ **Built for the Future**  
  Uses modern frameworks and tools, avoids deprecated libraries, and prioritises code readability and modularity.

- ✅ **Accessible and Inclusive**  
  Meets WCAG 2.1 AA. All pages use semantic HTML, keyboard navigation, appropriate contrast, and alt text.

- ✅ **Data-Driven and Impact-Measurable**  
  Designed to surface insights on usage, service access, and verification timelines through GA4 and event tagging.

---

## 🗂️ Branch Strategy

- `main` – Production-ready, deployable code only  
- `staging` – Active development branch. All new features and fixes should branch from here and merge back into staging.

---

## 🚀 Getting Started Locally

### 1. Fork This Repository
Use the **Fork** button on GitHub.

### 2. Clone Your Fork
```bash
git clone https://github.com/<your-username>/streetsupport-platform-web.git
cd streetsupport-platform-web
```

### 3. Set Up Upstream Remote
```bash
git remote add upstream https://github.com/streetsupport/streetsupport-platform-web.git
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Development Server
```bash
npm run dev
```

Visit:
```
http://localhost:3000
```

---

## 🔄 Keeping Your Fork Up to Date

```bash
git fetch upstream
git checkout staging
git merge upstream/staging
git push origin staging
```

---

## ✅ Deployment

Deployment is automated via CI/CD:

- `main` → Production
- `staging` → Staging environment
- Preview deployments are created for every PR

---

## ⚙️ Contribution Workflow

1. **Branch from `staging`**
```bash
git checkout -b feature/your-feature-name
```

2. **Commit Clearly**
```bash
git commit -m "feat: add filter panel"
```

3. **Push and Open PR**
Target: `streetsupport/streetsupport-platform-web → staging`

4. **Review and Merge**
Reviewed PRs are merged into staging before release to main.

---

## 🛠 Tech Stack

- [Next.js](https://nextjs.org/) (App Router, v15+)
- TypeScript
- Tailwind CSS
- Node.js
- Azure Static Web Apps (planned)
- Google Maps API
- GA4
- WatsonX Virtual Assistant
- JSON-based mock data (temporary until CMS integration)

---

## 📁 Project Structure

```
/src
  /app
    /api            ← Route handlers for mock data (get-services, get-categories)
    /[pages]        ← Next.js pages and layouts
  /components       ← UI and layout components (modular)
  /data             ← Mock data in JSON format
  /styles           ← Tailwind and legacy SCSS files (migrating gradually)

tailwind.config.js  ← Design tokens and theme overrides
postcss.config.js   ← Tailwind + PostCSS setup
```

---

## 📊 Data Model (Temporary)

Data is currently stored as JSON in `/src/data/`:

- `locations.json`
- `client-groups.json`
- `service-categories.json`
- `service-providers.json`

Each service provider includes:
- A nested list of services
- A linked category and subcategory
- Postcode, opening hours, and client group support
- Geolocation (latitude, longitude) for map use

Eventually, this will be replaced by dynamic data from the Street Support Network API or CMS.

---

## 👥 User Roles (Future CMS)

- **Super Administrator**: Full access
- **Location Administrator**: Manage content in assigned area(s)
- **Organisation Administrator**: Manage their organisation’s data
- **SWEP Administrator**: Control SWEP info and banner visibility
- **Volunteer Administrator**: Read-only access for data comparison

---

## 📄 License

MIT

---

## 🧑‍💻 Maintainers

- [James Cross](https://github.com/James-Cross)
