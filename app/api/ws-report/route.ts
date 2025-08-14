import { NextRequest, NextResponse } from "next/server";
import { WebsiteAnalyzer, WebsiteAnalysis } from "../../../lib/website-analyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payload } = body || {};
    
    if (!payload?.url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    const url = payload.url;
    
    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }
    
    // Try to analyze the website, but provide fallback if it fails
    let websiteData: WebsiteAnalysis;
    let analysisMethod: 'real' | 'simulated' = 'real';
    
    try {
      console.log('Attempting real website analysis for:', url);
      const analyzer = new WebsiteAnalyzer();
      websiteData = await analyzer.analyzeWebsite(url);
      console.log('Real analysis successful');
    } catch (analysisError) {
      console.warn('Real analysis failed, using simulated data:', analysisError);
      
      // Provide simulated analysis as fallback
      try {
        websiteData = await generateSimulatedAnalysis(url);
        analysisMethod = 'simulated';
        console.log('Simulated analysis generated successfully');
      } catch (simulationError) {
        console.error('Both real and simulated analysis failed:', simulationError);
        return NextResponse.json({ 
          error: "Unable to analyze website. Please try a different URL or check if the website is accessible." 
        }, { status: 500 });
      }
    }
    
    // Generate sustainability report
    try {
      const report = await generateSustainabilityReport(websiteData, analysisMethod);
      console.log('Sustainability report generated successfully');

      return NextResponse.json({
        choices: [{
          message: {
            content: JSON.stringify(report)
          }
        }]
      });
    } catch (reportError) {
      console.error('Failed to generate sustainability report:', reportError);
      return NextResponse.json({ 
        error: "Analysis completed but failed to generate report. Please try again." 
      }, { status: 500 });
    }

  } catch (e: any) {
    console.error('API Error:', e);
    return NextResponse.json({ 
      error: "An unexpected error occurred. Please try again later." 
    }, { status: 500 });
  }
}

async function generateSimulatedAnalysis(url: string): Promise<WebsiteAnalysis> {
  // Generate realistic simulated data based on common website patterns
  const loadTime = Math.random() * 2000 + 500; // 500ms - 2.5s
  const pageSize = Math.random() * 1500 + 300; // 300KB - 1.8MB
  const imageCount = Math.floor(Math.random() * 15) + 3; // 3-17 images
  const scriptCount = Math.floor(Math.random() * 12) + 2; // 2-13 scripts
  const cssCount = Math.floor(Math.random() * 6) + 1; // 1-6 CSS files
  const fontCount = Math.floor(Math.random() * 4) + 1; // 1-4 fonts
  const videoCount = Math.floor(Math.random() * 2); // 0-1 videos
  
  // Generate realistic scores
  const accessibilityScore = Math.max(60, Math.min(95, 80 + (Math.random() - 0.5) * 30));
  const seoScore = Math.max(65, Math.min(95, 75 + (Math.random() - 0.5) * 20));
  const performanceScore = Math.max(60, Math.min(95, 75 + (Math.random() - 0.5) * 30));
  
  // Calculate carbon footprint
  const carbonFootprint = Math.round((pageSize / 1000) * 0.5 * 100) / 100;
  
  // Check for optimization features (simulated)
  const greenHosting = Math.random() > 0.7; // 30% chance
  const compressionEnabled = Math.random() > 0.4; // 60% chance
  const cdnEnabled = Math.random() > 0.5; // 50% chance

  return {
    url,
    loadTime: Math.round(loadTime),
    pageSize: Math.round(pageSize * 100) / 100,
    imageCount,
    scriptCount,
    cssCount,
    fontCount,
    videoCount,
    accessibilityScore: Math.round(accessibilityScore),
    seoScore: Math.round(seoScore),
    performanceScore: Math.round(performanceScore),
    carbonFootprint,
    greenHosting,
    compressionEnabled,
    cdnEnabled,
  };
}

async function generateSustainabilityReport(websiteData: WebsiteAnalysis, analysisMethod: 'real' | 'simulated' = 'real') {
  // Calculate sustainability scores based on the analyzed data
  const energyEfficiency = calculateEnergyEfficiency(websiteData);
  const carbonFootprint = calculateCarbonFootprintScore(websiteData);
  const resourceOptimization = calculateResourceOptimization(websiteData);
  const accessibility = websiteData.accessibilityScore;
  
  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (energyEfficiency * 0.25) + 
    (carbonFootprint * 0.25) + 
    (resourceOptimization * 0.25) + 
    (accessibility * 0.25)
  );

  // Generate recommendations based on scores
  const recommendations = generateRecommendations(websiteData, {
    energyEfficiency,
    carbonFootprint,
    resourceOptimization,
    accessibility
  });

  // Add note about analysis method
  if (analysisMethod === 'simulated') {
    recommendations.unshift("Note: This analysis uses simulated data due to website access restrictions. For accurate results, ensure the website allows external analysis.");
  }

  return {
    overallScore,
    energyEfficiency,
    carbonFootprint: carbonFootprint,
    resourceOptimization,
    accessibility,
    recommendations,
    analysisMethod,
    analysisData: {
      url: websiteData.url,
      loadTime: websiteData.loadTime,
      pageSize: websiteData.pageSize,
      imageCount: websiteData.imageCount,
      scriptCount: websiteData.scriptCount,
      cssCount: websiteData.cssCount,
      fontCount: websiteData.fontCount,
      videoCount: websiteData.videoCount,
      seoScore: websiteData.seoScore,
      performanceScore: websiteData.performanceScore,
      actualCarbonFootprint: websiteData.carbonFootprint,
      greenHosting: websiteData.greenHosting,
      compressionEnabled: websiteData.compressionEnabled,
      cdnEnabled: websiteData.cdnEnabled,
    }
  };
}

function calculateEnergyEfficiency(data: WebsiteAnalysis): number {
  let score = 100;
  
  // Penalize slow load times
  if (data.loadTime > 3000) {
    score -= Math.min(30, (data.loadTime - 3000) / 100);
  } else if (data.loadTime > 2000) {
    score -= Math.min(20, (data.loadTime - 2000) / 100);
  }
  
  // Penalize large page sizes
  if (data.pageSize > 2000) {
    score -= Math.min(25, (data.pageSize - 2000) / 100);
  } else if (data.pageSize > 1000) {
    score -= Math.min(15, (data.pageSize - 1000) / 100);
  }
  
  // Penalize excessive media content
  if (data.videoCount > 2) {
    score -= (data.videoCount - 2) * 5;
  }
  
  // Bonus for optimization features
  if (data.compressionEnabled) score += 5;
  if (data.cdnEnabled) score += 5;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateCarbonFootprintScore(data: WebsiteAnalysis): number {
  // Convert actual carbon footprint to a score (lower carbon = higher score)
  let score = 100;
  
  // Base scoring on carbon footprint
  if (data.carbonFootprint > 2) {
    score -= Math.min(40, (data.carbonFootprint - 2) * 20);
  } else if (data.carbonFootprint > 1) {
    score -= Math.min(20, (data.carbonFootprint - 1) * 20);
  }
  
  // Bonus for green hosting
  if (data.greenHosting) score += 10;
  
  // Bonus for optimization features
  if (data.compressionEnabled) score += 5;
  if (data.cdnEnabled) score += 5;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateResourceOptimization(data: WebsiteAnalysis): number {
  let score = 100;
  
  // Penalize excessive resources
  if (data.scriptCount > 10) {
    score -= (data.scriptCount - 10) * 3;
  }
  
  if (data.cssCount > 5) {
    score -= (data.cssCount - 5) * 4;
  }
  
  if (data.fontCount > 3) {
    score -= (data.fontCount - 3) * 5;
  }
  
  // Penalize large page sizes
  if (data.pageSize > 1500) {
    score -= Math.min(20, (data.pageSize - 1500) / 100);
  }
  
  // Bonus for optimization features
  if (data.compressionEnabled) score += 5;
  if (data.cdnEnabled) score += 5;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function generateRecommendations(data: WebsiteAnalysis, scores: any): string[] {
  const recommendations: string[] = [];
  
  // Energy efficiency recommendations
  if (scores.energyEfficiency < 80) {
    if (data.loadTime > 2000) {
      recommendations.push("Optimize page load time by reducing server response time and implementing lazy loading");
    }
    if (data.pageSize > 1000) {
      recommendations.push("Compress and optimize images, minify CSS/JS files to reduce page size");
    }
    if (data.videoCount > 1) {
      recommendations.push("Consider replacing videos with optimized images or implementing video lazy loading");
    }
    if (!data.compressionEnabled) {
      recommendations.push("Enable gzip or Brotli compression on your server to reduce file sizes");
    }
    if (!data.cdnEnabled) {
      recommendations.push("Implement a Content Delivery Network (CDN) to improve loading speeds globally");
    }
  }
  
  // Carbon footprint recommendations
  if (scores.carbonFootprint < 80) {
    if (!data.greenHosting) {
      recommendations.push("Switch to a green hosting provider that runs on renewable energy");
    }
    if (data.pageSize > 1000) {
      recommendations.push("Reduce page size by optimizing media files and removing unused code");
    }
    if (data.videoCount > 0) {
      recommendations.push("Optimize video content and consider using lower resolution versions for mobile");
    }
  }
  
  // Resource optimization recommendations
  if (scores.resourceOptimization < 80) {
    if (data.scriptCount > 10) {
      recommendations.push("Consolidate JavaScript files and remove unused scripts to reduce HTTP requests");
    }
    if (data.cssCount > 5) {
      recommendations.push("Combine CSS files and remove unused styles to improve performance");
    }
    if (data.fontCount > 3) {
      recommendations.push("Limit font families and use system fonts when possible to reduce loading time");
    }
    if (data.imageCount > 15) {
      recommendations.push("Implement lazy loading for images and use modern formats like WebP");
    }
  }
  
  // Accessibility recommendations
  if (scores.accessibility < 80) {
    recommendations.push("Improve accessibility by adding proper alt text, semantic HTML, and keyboard navigation");
    recommendations.push("Ensure sufficient color contrast and readable font sizes for better user experience");
    recommendations.push("Add ARIA labels and roles where appropriate for screen readers");
  }
  
  // General sustainability recommendations
  recommendations.push("Implement caching strategies to reduce server load and improve user experience");
  recommendations.push("Use modern image formats (WebP, AVIF) and responsive images for better performance");
  recommendations.push("Consider implementing a service worker for offline functionality and reduced server requests");
  recommendations.push("Regularly audit and remove unused code, images, and third-party scripts");
  
  // Remove duplicates and limit to top recommendations
  const uniqueRecommendations = [...new Set(recommendations)];
  return uniqueRecommendations.slice(0, 10);
}
