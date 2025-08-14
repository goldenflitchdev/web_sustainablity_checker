# Web Sustainability Checker

A comprehensive web application that analyzes websites for sustainability metrics and provides actionable recommendations to make them more environmentally friendly and energy-efficient.

## 🌱 Features

### Sustainability Analysis
- **Overall Sustainability Score**: Comprehensive rating based on multiple factors
- **Energy Efficiency**: Evaluates page load times and resource optimization
- **Carbon Footprint**: Calculates environmental impact in CO2 emissions
- **Resource Optimization**: Analyzes script, CSS, and media file usage
- **Accessibility**: Checks for inclusive design practices

### Technical Metrics
- **Performance Analysis**: Load times, page sizes, and optimization features
- **Resource Counting**: Images, scripts, CSS files, fonts, and videos
- **Quality Scores**: SEO and performance ratings
- **Optimization Features**: Green hosting, compression, and CDN detection

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

3. Create a `.env.local` file in the root directory (optional, for advanced features):
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 How It Works

### 1. Website Analysis
The application fetches and analyzes websites using:
- **JSDOM**: HTML parsing and analysis
- **Performance Metrics**: Load times and resource sizes
- **Resource Counting**: Scripts, images, CSS, and media files
- **Header Analysis**: Compression, CDN, and hosting detection

### 2. Sustainability Scoring
Scores are calculated based on:
- **Energy Efficiency (25%)**: Load times, page sizes, media optimization
- **Carbon Footprint (25%)**: Environmental impact, green hosting
- **Resource Optimization (25%)**: File consolidation, HTTP requests
- **Accessibility (25%)**: Semantic HTML, alt text, ARIA labels

### 3. Smart Recommendations
The system generates personalized recommendations based on:
- Performance bottlenecks
- Resource optimization opportunities
- Accessibility improvements
- Sustainability best practices

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **HTML Analysis**: JSDOM
- **Performance**: Built-in performance monitoring
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

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Compatible with Next.js
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
