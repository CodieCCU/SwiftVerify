# SwiftVerify - GitHub Pages Deployment Guide

## Overview
This guide explains how to build and deploy the SwiftVerify React/Vite application to GitHub Pages.

## Architecture

### Frontend Stack
- **React 18.2.0**: UI framework
- **React Router DOM 6.20.0**: Client-side routing with HashRouter for GitHub Pages compatibility
- **Vite 5.0.0**: Build tool and development server
- **Axios 1.6.0**: HTTP client (dependency available but not actively used)

### Mock Data
The application currently uses mock authentication and verification logic:
- **Authentication**: Simple username/password check (any non-empty values)
- **Verification Processing**: Simulated 3-second delay with 70% approval rate
- **No Backend APIs**: All data is mocked client-side for demonstration purposes

## Configuration for GitHub Pages

### 1. Vite Configuration (`frontend/vite.config.js`)
The Vite configuration has been set up for GitHub Pages deployment:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/SwiftVerify/',           // GitHub repo name as base path
  build: {
    outDir: '../docs',               // Output to docs/ for GitHub Pages
    emptyOutDir: true,               // Clean the output directory
  },
  server: {
    port: 3000,
    open: true
  }
})
```

**Key Settings:**
- `base: '/SwiftVerify/'` - Sets the base path to match the GitHub repository name
- `outDir: '../docs'` - Builds directly to the `docs/` directory at repository root
- `emptyOutDir: true` - Ensures clean builds

### 2. Router Configuration (`frontend/src/App.jsx`)
The application uses `HashRouter` instead of `BrowserRouter` for GitHub Pages compatibility:

```javascript
import { HashRouter as Router } from 'react-router-dom';
```

**Why HashRouter?**
- GitHub Pages serves static files without server-side routing
- HashRouter uses URL fragments (e.g., `/#/login`) which work without server configuration
- All routing is handled client-side in JavaScript

## Building for Production

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### Build Steps

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies (first time only):**
   ```bash
   npm install
   ```

3. **Build the application:**
   ```bash
   npm run build
   ```

4. **Verify the build:**
   The build process will:
   - Create/update the `docs/` directory at repository root
   - Generate optimized JavaScript and HTML files
   - Output build statistics to the console

5. **Check build output:**
   ```bash
   ls ../docs/
   # Should show: assets/ index.html
   ```

## Deployment to GitHub Pages

### Initial Setup (One-time)

1. **Push the built files to GitHub:**
   ```bash
   git add docs/
   git commit -m "Build frontend for GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Under "Source", select "Deploy from a branch"
   - Select branch: `main`
   - Select folder: `/docs`
   - Click "Save"

3. **Wait for deployment:**
   - GitHub Actions will automatically deploy your site
   - Check the Actions tab for deployment status
   - Site will be available at: `https://codieccu.github.io/SwiftVerify/`

### Updating the Deployment

Whenever you make changes to the frontend:

1. **Make your code changes** in `frontend/src/`

2. **Rebuild the application:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Commit and push:**
   ```bash
   git add docs/
   git commit -m "Update frontend build"
   git push origin main
   ```

4. **GitHub Pages will automatically redeploy** (usually takes 1-2 minutes)

## Testing Locally

### Development Server
```bash
cd frontend
npm run dev
# Opens at http://localhost:3000
```

### Preview Production Build
```bash
cd frontend
npm run build
npm run preview
# Preview at http://localhost:4173
```

### Testing the GitHub Pages Build Locally
To test the exact build that will be deployed:

1. **Build the application:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve the docs directory:**
   ```bash
   # Using Python 3
   cd ../docs
   python3 -m http.server 8000
   
   # OR using Node.js with npx
   npx serve -s ../docs -p 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000/SwiftVerify/
   ```
   Note: The `/SwiftVerify/` path is important to match production

## Application Features & Flow

### 1. Login Page (`/login` or `/#/login`)
- Simple mock authentication
- Accepts any non-empty username and password
- No backend validation

### 2. Home/Dashboard (`/#/home`)
- Protected route (requires authentication)
- Welcome message with logged-in username
- "Start Verification" button to begin identity verification flow

### 3. Driver's License Verification (`/#/drivers-license`)
- Email input with validation
- Driver's license number input
- Mock "Scan License" option (shows notification)
- Privacy notice

### 4. Verification Processing (`/#/verification-processing`)
- Loading animation
- 3-second simulated processing delay
- Shows submitted information (partially masked)

### 5. Verification Result (`/#/verification-result`)
- 70% approval rate (random for demo purposes)
- Displays verification status
- Shows verification details
- Options to try again or return home

## Mock Data Details

### Authentication Mock
Location: `frontend/src/auth.jsx`
```javascript
const login = (username, password) => {
  if (username && password) {
    setIsAuthenticated(true);
    setUser({ username });
    return true;
  }
  return false;
};
```

### Verification Mock
Location: `frontend/src/pages/VerificationProcessing.jsx`
```javascript
// Simulates 70% approval rate
const isApproved = Math.random() > 0.3;
```

## Troubleshooting

### Build Errors
- **Module not found**: Run `npm install` in the frontend directory
- **Permission errors**: Check file permissions in the docs/ directory
- **Old build artifacts**: The build process cleans the docs/ directory automatically

### Routing Issues on GitHub Pages
- Ensure you're using `HashRouter` not `BrowserRouter`
- Check that the `base` path in `vite.config.js` matches your repo name
- URLs should have `#` (e.g., `https://codieccu.github.io/SwiftVerify/#/login`)

### Assets Not Loading
- Verify `base: '/SwiftVerify/'` in `vite.config.js`
- Check browser console for 404 errors
- Ensure the repository name matches the base path

### Page Not Found (404)
- Verify GitHub Pages is enabled and pointing to `/docs` folder
- Check that the docs/ directory is committed to the repository
- Wait a few minutes for GitHub Pages to deploy changes

## File Structure

```
SwiftVerify/
├── frontend/               # React/Vite application source
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app with HashRouter
│   │   ├── auth.jsx       # Mock authentication
│   │   └── main.jsx       # Entry point
│   ├── index.html         # HTML template
│   ├── package.json       # Dependencies and scripts
│   └── vite.config.js     # Vite configuration
├── docs/                  # Built files for GitHub Pages (generated)
│   ├── assets/           # JavaScript and CSS bundles
│   └── index.html        # Entry HTML file
├── .gitignore            # Root gitignore
└── DEPLOYMENT.md         # This file
```

## Security Notes

- This is a demonstration application with mock data
- No real authentication or verification is performed
- No sensitive data is transmitted or stored
- Suitable for UI/UX demonstration and testing purposes only

## Future Enhancements

To integrate with real backend APIs:

1. **Create API service layer:**
   ```javascript
   // src/services/api.js
   import axios from 'axios';
   
   const API_BASE_URL = import.meta.env.VITE_API_URL;
   
   export const verifyIdentity = async (data) => {
     const response = await axios.post(`${API_BASE_URL}/verify`, data);
     return response.data;
   };
   ```

2. **Add environment variables:**
   ```bash
   # .env.production
   VITE_API_URL=https://api.swiftverify.com
   ```

3. **Replace mock logic** in components with real API calls

4. **Add error handling** for network failures

5. **Implement proper authentication** with JWT tokens or session management

## Support

For questions or issues with deployment:
- Check GitHub Actions logs for deployment errors
- Review browser console for runtime errors
- Verify all configuration files match this documentation

---

Last Updated: February 2, 2026
