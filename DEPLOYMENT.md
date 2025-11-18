# GitHub Pages Deployment Guide

This guide explains how to deploy the AWS SA Pro Kit exam website to GitHub Pages.

## Automatic Deployment

The repository is configured with a GitHub Actions workflow that automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

## One-Time Setup

Before the automatic deployment will work, you need to enable GitHub Pages in your repository settings:

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/bkondakor/aws-sa-pro-kit`
2. Click on **Settings** (top menu)
3. Click on **Pages** (left sidebar)
4. Under **Source**, select:
   - Source: **GitHub Actions**
   - (NOT "Deploy from a branch")
5. Click **Save** if prompted

### Step 2: Merge Your Branch to Main

The workflow is configured to trigger on pushes to the `main` branch. To deploy:

1. Create a Pull Request from your feature branch to `main`
2. Review and merge the PR
3. The GitHub Actions workflow will automatically run
4. After 1-2 minutes, your site will be live at: `https://bkondakor.github.io/aws-sa-pro-kit/`

### Step 3: Monitor Deployment

1. Go to the **Actions** tab in your repository
2. You should see the "Deploy to GitHub Pages" workflow running
3. Click on the workflow to see detailed logs
4. Once completed (green checkmark), your site is live

## Workflow Details

The workflow (`.github/workflows/deploy-pages.yml`) will:

1. Trigger on:
   - Push to `main` branch
   - Manual workflow dispatch (can be triggered from Actions tab)

2. Deploy:
   - The entire repository to GitHub Pages
   - Accessible at `https://bkondakor.github.io/aws-sa-pro-kit/`
   - Root redirects to `/exam/` automatically

3. Features:
   - No Jekyll processing (`.nojekyll` file present)
   - Proper permissions for Pages deployment
   - Concurrency control to prevent conflicts

## Manual Deployment

You can manually trigger a deployment:

1. Go to **Actions** tab
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow** button
4. Select the `main` branch
5. Click **Run workflow**

## Accessing Your Site

Once deployed, your exam website will be available at:

- **Main URL**: `https://bkondakor.github.io/aws-sa-pro-kit/`
- **Direct to Exam**: `https://bkondakor.github.io/aws-sa-pro-kit/exam/`

The root URL automatically redirects to the exam application.

## Troubleshooting

### Workflow Not Running

- Ensure GitHub Pages is set to "GitHub Actions" source (not "Deploy from a branch")
- Check that the workflow file exists at `.github/workflows/deploy-pages.yml`
- Verify you pushed to the `main` branch

### 404 Error

- Wait 1-2 minutes after deployment completes
- Clear your browser cache
- Check that the deployment workflow completed successfully in Actions tab

### Permissions Error

The workflow includes these permissions:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

If you see permission errors:
1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

### Custom Domain (Optional)

To use a custom domain:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `exam.yourdomain.com`)
3. Add a CNAME file to the repository root with your domain
4. Configure your DNS provider to point to GitHub Pages

## Local Testing

Before deploying, always test locally:

```bash
cd exam
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Files Involved

- `.github/workflows/deploy-pages.yml` - Deployment workflow
- `index.html` - Root landing page with redirect
- `.nojekyll` - Disables Jekyll processing
- `exam/` - The exam application directory

## Security Notes

- The site is public (anyone can access)
- No server-side processing (static files only)
- All exam logic runs in the browser
- Safe to use on public GitHub Pages

## Updating Content

To update the exam questions or content:

1. Edit `exam/questions.json` or other exam files
2. Commit and push to your branch
3. Merge to `main`
4. Workflow automatically redeploys
5. Changes live in 1-2 minutes

## Cost

GitHub Pages is **free** for public repositories:
- Unlimited bandwidth (soft limit: 100GB/month)
- Unlimited build minutes for public repos
- Fast CDN delivery
- HTTPS included

---

**Next Steps After Setup:**

1. ✅ Enable GitHub Pages (Source: GitHub Actions)
2. ✅ Merge to main branch
3. ✅ Wait for workflow to complete
4. ✅ Visit `https://bkondakor.github.io/aws-sa-pro-kit/`
5. ✅ Share the link with others!
