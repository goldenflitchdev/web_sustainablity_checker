# 🚀 Deployment Guide - Vercel

This guide will help you deploy your Web Sustainability Checker to Vercel with full Google PageSpeed Insights integration.

## 📋 Prerequisites

- GitHub repository (✅ Already done!)
- Vercel account (free tier works perfectly)
- Google PageSpeed Insights API key (optional but recommended)

## 🔧 Step-by-Step Deployment

### 1. Deploy to Vercel

**Option A: One-Click Deploy**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/goldenflitchdev/web_sustainablity_checker)

**Option B: Manual Deployment**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository: `goldenflitchdev/web_sustainablity_checker`
5. Click "Deploy"

### 2. Configure Environment Variables

After deployment, add your API key:

1. Go to your project dashboard on Vercel
2. Click "Settings" tab
3. Click "Environment Variables" 
4. Add new variable:
   - **Name**: `GOOGLE_PAGESPEED_API_KEY`
   - **Value**: `AIzaSyBBJSujaoO87fATbj4rlJaOLdSzc9JOxA8`
   - **Environments**: Production, Preview, Development

5. Click "Save"
6. Redeploy by going to "Deployments" tab and clicking "Redeploy"

### 3. Verify Deployment

Your app will be available at: `https://your-project-name.vercel.app`

Test it by:
1. Entering a website URL (e.g., `google.com`)
2. Checking that you see "PageSpeed Insights + CO2.js" in the analysis method
3. Verifying you get real Core Web Vitals data

## 🌟 Features Available After Deployment

✅ **Real Google PageSpeed Insights Data**
- Official performance, accessibility, best practices, and SEO scores
- Actual Core Web Vitals measurements
- Precise resource analysis with unused code detection

✅ **Accurate CO2 Calculations**
- CO2.js Sustainable Web Design v4 model
- Detailed emissions breakdown (data center, network, device)
- A+ to F carbon footprint ratings
- Green hosting impact calculations

✅ **Smart Fallbacks**
- Automatic fallback to simulated data if API fails
- Always functional, even without API key
- Graceful error handling

## 🔒 Security & Performance

- API key is securely stored in Vercel environment variables
- 30-second timeout for API calls (configured in `vercel.json`)
- Automatic HTTPS and global CDN
- Optimized Next.js build for fast loading

## 🛠️ Troubleshooting

**If analysis shows "Simulated Analysis":**
1. Check that your API key is correctly set in Vercel environment variables
2. Ensure you've redeployed after adding the environment variable
3. Verify the API key is valid in Google Cloud Console

**If deployment fails:**
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are properly installed
3. Verify TypeScript compiles without errors

## 📊 Monitoring

Monitor your app's performance:
- Vercel Analytics (automatic)
- API usage in Google Cloud Console
- Core Web Vitals in Vercel Speed Insights

## 🌍 Custom Domain (Optional)

To use a custom domain:
1. Go to project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

---

**Your Web Sustainability Checker is now live and helping make the web more sustainable! 🌱**
