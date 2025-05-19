# Street Support Network - Website Rebuild

This is the future-proofed rebuild of the Street Support Network website.  
It provides a modular, maintainable platform to help people experiencing or at risk of homelessness find the support they need.

## 🗂️ Branch Strategy

- **main**  
  Production-ready, deployable code only.

- **staging**  
  Active development branch. All new features and fixes should branch from here and be merged back into staging first.

## 🚀 Getting Started Locally

### 1. Fork This Repository
Start by forking this repository to your own GitHub account using the **Fork** button on GitHub.

### 2. Clone Your Fork
Clone **your fork**, not the original:

```bash
git clone https://github.com/<your-username>/streetsupport-platform-web.git
cd streetsupport-platform-web
```

### 3. Set Up Upstream Remote
To keep your fork up to date with the main repository:

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

Open your browser to:
```
http://localhost:3000
```

## 🔄 Keeping Your Fork Up to Date

Fetch the latest changes from the original repository:

```bash
git fetch upstream
git checkout staging
git merge upstream/staging
```

Push the updates to your fork:

```bash
git push origin staging
```

## ✅ Deployment

Automatic deployments will be configured for:
- **staging branch** → Staging environment
- **main branch** → Production environment

## ⚙️ Contribution Workflow

1. **Create a Feature Branch**  
   From your fork's `staging` branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Commit Changes**  
   Follow clear, descriptive commit messages:
   ```
   feat: add search filter component
   fix: correct map loading issue
   docs: update README with contribution guidelines
   ```

3. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request**
   - Target **streetsupport/streetsupport-platform-web - staging branch**
   - Provide a clear description of what your change does

5. **Code Review & Merge**
   - Changes will be reviewed before merging into `staging`

## 🛠️ Tech Stack

- Next.js with TypeScript
- React
- Node.js
- Azure Static Web Apps (planned)

## 🧑‍💻 Maintainers

- [James Cross](https://github.com/James-Cross)

## 📄 License

MIT
