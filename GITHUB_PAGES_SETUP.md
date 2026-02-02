# GitHub Pages Setup Instructions

## Quick Setup (5 minutes)

After this PR is merged to the `main` branch:

### Step 1: Enable GitHub Pages
1. Go to the repository on GitHub
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `main`
   - **Folder**: Select `/docs`
5. Click **Save**

### Step 2: Wait for Deployment
- GitHub Actions will automatically deploy your site
- This usually takes 1-2 minutes
- Check the **Actions** tab to monitor progress

### Step 3: Access Your Site
Your live demo will be available at:
```
https://codieccu.github.io/SwiftVerify/
```

## Verifying the Deployment

### Test the Application
1. Open `https://codieccu.github.io/SwiftVerify/`
2. You should see the login page
3. Enter any username and password (mock authentication accepts anything)
4. Click "Start Verification" to test the workflow

### Expected Pages
- **Login** (`/#/login`) - Authentication page
- **Home** (`/#/home`) - Dashboard with "Start Verification" button
- **Driver's License** (`/#/drivers-license`) - Verification form
- **Processing** (`/#/verification-processing`) - Loading state
- **Result** (`/#/verification-result`) - Success/failure page

## Troubleshooting

### Page Shows 404
- **Wait 2-3 minutes** after enabling GitHub Pages
- Check that the `/docs` folder exists in the main branch
- Verify GitHub Pages is enabled in Settings → Pages

### Assets Not Loading (blank page)
- Open browser console (F12) and check for errors
- Verify the base URL in `vite.config.js` matches your repository name
- Clear browser cache and reload

### Routing Not Working
- The app uses HashRouter, so URLs should have `#` (e.g., `/#/login`)
- Direct navigation to paths without `#` will not work

## Updating the Site

To update the deployed site after making changes:

1. Make your changes in `frontend/src/`
2. Build the application:
   ```bash
   cd frontend
   npm run build
   ```
3. Commit and push:
   ```bash
   git add docs/
   git commit -m "Update frontend build"
   git push origin main
   ```
4. GitHub Pages will automatically redeploy (1-2 minutes)

## Local Testing

To test the exact build that will be deployed:

```bash
# Build the app
cd frontend
npm run build

# Preview the build
npm run preview
# Opens at http://localhost:4173/SwiftVerify/
```

## Need Help?

- **Full documentation**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Frontend development**: See [README.md](README.md#frontend-development)
- **GitHub Pages docs**: https://docs.github.com/en/pages

---

**Note**: This is a demonstration application with mock data. No real authentication or verification is performed.
