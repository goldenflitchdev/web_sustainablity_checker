# Web Sustainability Checker

A comprehensive web application that analyzes websites for sustainability metrics using **Google PageSpeed Insights API** and **CO2.js** to provide accurate carbon footprint calculations and actionable recommendations for making websites more environmentally friendly and energy-efficient.

## 🌱 Features

### Advanced Sustainability Analysis
- **Overall Sustainability Score**: Comprehensive rating based on multiple factors
- **Energy Efficiency**: Evaluates page load times and resource optimization
- **Carbon Footprint**: Accurate CO2 emissions calculated using CO2.js with Sustainable Web Design model
- **Resource Optimization**: Analyzes script, CSS, and media file usage with unused code detection
- **Accessibility**: Checks for inclusive design practices

### CO2.js Integration
- **Accurate CO2 Calculations**: Uses the latest Sustainable Web Design v4 model
- **Detailed Breakdown**: Data center, network, and device emissions
- **Green Hosting Impact**: Calculate savings from renewable energy hosting  
- **Optimization Potential**: Quantify CO2 savings from removing unused resources
- **A+ to F Rating**: Industry-standard carbon footprint ratings

### PageSpeed Insights Integration
- **Core Web Vitals**: LCP, FID, CLS, and other performance metrics
- **Resource Analysis**: Detailed breakdown of images, scripts, stylesheets, and fonts
- **Performance Scores**: Official Google performance, accessibility, best practices, and SEO scores
- **Optimization Opportunities**: Unused CSS/JS detection and image optimization suggestions

### Smart Recommendations
- Personalized suggestions based on analysis results
- Actionable steps to improve sustainability
- Best practices for web development
- Performance optimization tips

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web_sustainablity_checker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory (optional, for enhanced analysis):
```env
# Google PageSpeed Insights API Key (optional but recommended)
# Get your API key from: https://developers.google.com/speed/docs/insights/v5/get-started
# Without this, the app will use fallback simulated data
GOOGLE_PAGESPEED_API_KEY=your_pagespeed_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 How It Works

### 1. Website Analysis
The application analyzes websites using multiple methods:

**Primary Method: PageSpeed Insights + CO2.js**
- **Google PageSpeed Insights API**: Official performance metrics and Core Web Vitals
- **CO2.js**: Accurate carbon footprint calculations using Sustainable Web Design model
- **Resource Analysis**: Detailed breakdown of all website resources
- **Optimization Detection**: Unused CSS/JS and unoptimized images

**Fallback Method: Basic Analysis**
- **JSDOM**: HTML parsing and analysis
- **Performance Metrics**: Load times and resource sizes  
- **Resource Counting**: Scripts, images, CSS, and media files
- **Header Analysis**: Compression, CDN, and hosting detection

### 2. Advanced Sustainability Scoring
Scores are calculated using sophisticated algorithms based on:

**Energy Efficiency (25%)**
- Core Web Vitals (LCP, FID, CLS, TBT)
- Total resource size and transfer efficiency
- Performance score from PageSpeed Insights

**Carbon Footprint (35%)** - *Higher weight due to environmental importance*
- CO2.js calculations using Sustainable Web Design v4 model
- Data center, network, and device emissions breakdown
- Green hosting impact assessment
- A+ to F carbon rating

**Resource Optimization (25%)**
- Unused CSS and JavaScript detection
- Image optimization opportunities
- Render-blocking resources analysis
- DOM size and complexity

**Performance & Accessibility (15%)**
- Google PageSpeed performance score
- Accessibility score from automated testing

### 3. Smart Recommendations
The system generates personalized recommendations based on:
- Performance bottlenecks
- Resource optimization opportunities
- Accessibility improvements
- Sustainability best practices

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Carbon Calculations**: CO2.js (Sustainable Web Design v4)
- **Performance Analysis**: Google PageSpeed Insights API
- **HTML Analysis**: JSDOM (fallback method)
- **Deployment**: Vercel-ready

## 📈 Usage Examples

### Basic Analysis
1. Enter a website URL (e.g., `https://example.com`)
2. Click "Check Sustainability"
3. Review the comprehensive report

### Understanding Scores
- **80-100**: Excellent sustainability
- **60-79**: Good with room for improvement
- **0-59**: Needs significant optimization

### Key Metrics to Monitor
- **Load Time**: Aim for under 2 seconds
- **Page Size**: Keep under 1MB when possible
- **Image Count**: Optimize and lazy-load images
- **Script Count**: Consolidate and minimize JavaScript

## 🔧 Customization

### Adding New Metrics
1. Extend the `WebsiteAnalysis` interface in `lib/website-analyzer.ts`
2. Implement analysis logic in the `WebsiteAnalyzer` class
3. Update scoring algorithms in `api/ws-report.ts`
4. Modify the frontend to display new metrics

### Custom Scoring
Adjust the scoring weights in `generateSustainabilityReport()`:
```typescript
const overallScore = Math.round(
  (energyEfficiency * 0.25) + 
  (carbonFootprint * 0.25) + 
  (resourceOptimization * 0.25) + 
  (accessibility * 0.25)
);
```

## 🌍 Sustainability Impact

### Why Web Sustainability Matters
- **Energy Consumption**: Data centers consume 1% of global electricity
- **Carbon Emissions**: Internet contributes to climate change
- **Resource Efficiency**: Optimized websites use less bandwidth
- **User Experience**: Faster, more accessible websites benefit everyone

### Best Practices
- Use green hosting providers
- Implement compression and CDNs
- Optimize images and media files
- Minimize HTTP requests
- Use semantic HTML and accessibility features

## 📚 API Reference

### Endpoint: `/api/ws-report`
- **Method**: POST
- **Body**: `{ "payload": { "url": "https://example.com" } }`
- **Response**: Sustainability analysis report

### Response Format
```json
{
  "choices": [{
    "message": {
      "content": "{\"overallScore\": 85, \"energyEfficiency\": 90, ...}"
    }
  }]
}
```

## 🚀 Deployment

### Quick Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/goldenflitchdev/web_sustainablity_checker)

**Or manually:**
1. Fork/clone this repository
2. Push to your GitHub
3. Connect to Vercel
4. Add environment variable: `GOOGLE_PAGESPEED_API_KEY`
5. Deploy automatically

**📋 See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions**

### Other Platforms
- **Netlify**: Compatible with Next.js (add environment variables)
- **Railway**: Easy deployment with environment variables  
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- Inspired by sustainable web development practices
- Community contributions welcome

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Make the web more sustainable, one website at a time! 🌱**
