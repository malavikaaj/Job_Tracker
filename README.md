# 📊 JobTracker

A modern, responsive dashboard to track your job applications, interviews, and offers.

## 🚀 Deployment

**Vercel is recommended** for this project because it provides a seamless experience for React/Vite applications, handles routing automatically, and has an excellent free tier.

### Option 1: Vercel (Recommended)
1. **Push to GitHub**: Create a repository on GitHub and push your code.
2. **Import to Vercel**: Go to [vercel.com](https://vercel.com), click **Add New > Project**, and select your GitHub repository.
3. **Deploy**: Vercel will automatically detect Vite and deploy your site.

### Option 2: GitHub Pages
1. Install the `gh-pages` package: `npm install gh-pages --save-dev`
2. Update `vite.config.ts` to include `base: '/your-repo-name/'`.
3. Add `"deploy": "gh-pages -d dist"` to your `package.json` scripts.
4. Run `npm run build && npm run deploy`.

---

## ✨ Features
- **Dashboard Stats**: Real-time overview of your application pipeline.
- **Export to CSV**: Download your data for use in Excel or Numbers.
- **Persistent Storage**: Data is saved to your browser's local storage.
- **Modern UI**: Clean design with Tailwind CSS and Lucide icons.

## 🛠️ Local Development
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```
