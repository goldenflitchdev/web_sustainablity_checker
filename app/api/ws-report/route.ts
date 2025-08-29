import { NextRequest, NextResponse } from "next/server";
import { WebsiteAnalyzer, WebsiteAnalysis } from "../../../lib/website-analyzer";
import { PageSpeedAPI, PageSpeedData } from "../../../lib/pagespeed-api";
import { CO2Calculator, SustainabilityMetrics } from "../../../lib/co2-calculator";

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
    
    // Create a timeout wrapper for the entire analysis
    const analysisTimeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analysis timed out')), 55000); // 55 seconds max
    });
    
    const analysisPromise = async () => {
      // Try PageSpeed Insights API first, then fallback to basic analysis
      let pageSpeedData: PageSpeedData | null = null;
      let websiteData: WebsiteAnalysis | null = null;
      let analysisMethod: 'pagespeed' | 'basic' | 'simulated' = 'pagespeed';
      
      // Initialize PageSpeed API
      const pageSpeedAPI = new PageSpeedAPI();
      const co2Calculator = new CO2Calculator();
    
    try {
      console.log('Attempting PageSpeed Insights analysis for:', url);
      pageSpeedData = await pageSpeedAPI.analyzeUrl(url);
      console.log('PageSpeed Insights analysis successful');
    } catch (pageSpeedError) {
      console.warn('PageSpeed Insights failed, trying fallback PageSpeed analysis:', pageSpeedError);
      
      try {
        pageSpeedData = await pageSpeedAPI.analyzeUrlFallback(url);
        analysisMethod = 'simulated';
        console.log('Fallback PageSpeed analysis successful');
      } catch (fallbackError) {
        console.warn('PageSpeed fallback failed, trying basic website analysis:', fallbackError);
        
        // Try basic website analysis as last resort
        try {
          const analyzer = new WebsiteAnalyzer();
          websiteData = await analyzer.analyzeWebsite(url);
          analysisMethod = 'basic';
          console.log('Basic website analysis successful');
        } catch (basicError) {
          console.warn('Basic analysis failed, using simulated data:', basicError);
          
          // Final fallback - simulated data
          try {
            websiteData = await generateSimulatedAnalysis(url);
            analysisMethod = 'simulated';
            console.log('Simulated analysis generated successfully');
          } catch (simulationError) {
            console.error('All analysis methods failed:', simulationError);
            return NextResponse.json({ 
              error: "Unable to analyze website. Please try a different URL or check if the website is accessible." 
            }, { status: 500 });
          }
        }
      }
    }
    
    // Generate sustainability report
    try {
      let report;
      
      if (pageSpeedData) {
        // Use PageSpeed data with CO2.js for accurate sustainability analysis
        console.log('Generating report from PageSpeed data');
        report = await generateAdvancedSustainabilityReport(pageSpeedData, co2Calculator, analysisMethod);
      } else if (websiteData) {
        // Use basic website analysis data
        console.log('Generating report from basic website data');
        report = await generateSustainabilityReport(websiteData, analysisMethod);
      } else {
        throw new Error('No analysis data available');
      }
      
      console.log('Sustainability report generated successfully');

      return {
        choices: [{
          message: {
            content: JSON.stringify(report)
          }
        }]
      };
    } catch (reportError) {
      console.error('Failed to generate sustainability report:', reportError);
      throw new Error("Analysis completed but failed to generate report. Please try again.");
    }
    };

    // Race between analysis and timeout
    const result = await Promise.race([analysisPromise(), analysisTimeout]);
    return NextResponse.json(result);

  } catch (e: any) {
    console.error('API Error:', e);
    
    // Handle timeout specifically
    if (e.message === 'Analysis timed out') {
      return NextResponse.json({ 
        error: "Analysis is taking too long. Please try again with a simpler website or try again later." 
      }, { status: 408 }); // Request Timeout
    }
    
    return NextResponse.json({ 
      error: "An unexpected error occurred. Please try again later." 
    }, { status: 500 });
  }
}

async function generateSimulatedAnalysis(url: string): Promise<WebsiteAnalysis> {
  // Generate consistent simulated data based on URL hash for deterministic results
  const seed = generateSeedFromUrl(url);
  
  // Generate realistic simulated data based on common website patterns (deterministic)
  const loadTime = seededRandom(seed, 0) * 2000 + 500; // 500ms - 2.5s
  const pageSize = seededRandom(seed, 1) * 1500 + 300; // 300KB - 1.8MB
  const imageCount = Math.floor(seededRandom(seed, 2) * 15) + 3; // 3-17 images
  const scriptCount = Math.floor(seededRandom(seed, 3) * 12) + 2; // 2-13 scripts
  const cssCount = Math.floor(seededRandom(seed, 4) * 6) + 1; // 1-6 CSS files
  const fontCount = Math.floor(seededRandom(seed, 5) * 4) + 1; // 1-4 fonts
  const videoCount = Math.floor(seededRandom(seed, 6) * 2); // 0-1 videos
  
  // Generate realistic scores (deterministic)
  const accessibilityScore = Math.max(60, Math.min(95, 80 + (seededRandom(seed, 7) - 0.5) * 30));
  const seoScore = Math.max(65, Math.min(95, 75 + (seededRandom(seed, 8) - 0.5) * 20));
  const performanceScore = Math.max(60, Math.min(95, 75 + (seededRandom(seed, 9) - 0.5) * 30));
  
  // Calculate carbon footprint
  const carbonFootprint = Math.round((pageSize / 1000) * 0.5 * 100) / 100;
  
  // Check for optimization features (deterministic based on URL)
  const greenHosting = seededRandom(seed, 10) > 0.7; // 30% chance, but consistent
  const compressionEnabled = seededRandom(seed, 11) > 0.4; // 60% chance, but consistent
  const cdnEnabled = seededRandom(seed, 12) > 0.5; // 50% chance, but consistent

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

async function generateSustainabilityReport(websiteData: WebsiteAnalysis, analysisMethod: 'pagespeed' | 'basic' | 'simulated' = 'basic') {
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
  } else if (analysisMethod === 'basic') {
    recommendations.unshift("Note: This analysis uses basic website scraping. For more accurate results, consider providing a Google PageSpeed Insights API key.");
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

async function generateAdvancedSustainabilityReport(
  pageSpeedData: PageSpeedData, 
  co2Calculator: CO2Calculator, 
  analysisMethod: 'pagespeed' | 'basic' | 'simulated' = 'pagespeed'
) {
  console.log('Generating advanced sustainability report with CO2.js calculations...');
  
  // Check for green hosting (simplified check based on common green hosts)
  const isGreenHosting = checkGreenHosting(pageSpeedData.url);
  
  // Calculate comprehensive sustainability metrics using CO2.js
  const sustainabilityMetrics = co2Calculator.calculateSustainabilityMetrics(pageSpeedData, isGreenHosting);
  
  // Generate detailed recommendations
  const recommendations = co2Calculator.generateRecommendations(sustainabilityMetrics, pageSpeedData);
  
  // Add method-specific notes
  if (analysisMethod === 'simulated') {
    recommendations.unshift("Note: This analysis uses simulated PageSpeed data due to API limitations. For accurate results, provide a Google PageSpeed Insights API key.");
  } else if (analysisMethod === 'pagespeed') {
    recommendations.unshift("✓ Analysis powered by Google PageSpeed Insights and CO2.js for accurate carbon footprint calculations.");
  }

  return {
    overallScore: sustainabilityMetrics.overallSustainability,
    energyEfficiency: sustainabilityMetrics.energyEfficiency,
    carbonFootprint: sustainabilityMetrics.carbonFootprint,
    resourceOptimization: sustainabilityMetrics.resourceOptimization,
    accessibility: pageSpeedData.accessibilityScore,
    recommendations,
    analysisMethod,
    co2Data: {
      totalCO2: sustainabilityMetrics.co2Data.totalCO2,
      co2PerVisit: sustainabilityMetrics.co2Data.co2PerVisit,
      co2Rating: sustainabilityMetrics.co2Data.co2Rating,
      breakdown: sustainabilityMetrics.co2Data.breakdown,
      greenHostingImpact: sustainabilityMetrics.co2Data.greenHostingImpact,
      optimizationPotential: sustainabilityMetrics.co2Data.optimizationPotential,
    },
    analysisData: {
      url: pageSpeedData.url,
      loadTime: pageSpeedData.largestContentfulPaint, // Use LCP as load time
      pageSize: Math.round(pageSpeedData.totalResourceSize / 1024), // Convert to KB
      imageCount: pageSpeedData.resourceCounts.images,
      scriptCount: pageSpeedData.resourceCounts.scripts,
      cssCount: pageSpeedData.resourceCounts.stylesheets,
      fontCount: pageSpeedData.resourceCounts.fonts,
      videoCount: pageSpeedData.resourceCounts.videos,
      seoScore: pageSpeedData.seoScore,
      performanceScore: pageSpeedData.performanceScore,
      actualCarbonFootprint: sustainabilityMetrics.co2Data.co2PerVisit,
      greenHosting: isGreenHosting,
      compressionEnabled: true, // Assume compression for PageSpeed data
      cdnEnabled: true, // Assume CDN for PageSpeed data
      
      // Additional PageSpeed-specific metrics
      firstContentfulPaint: pageSpeedData.firstContentfulPaint,
      largestContentfulPaint: pageSpeedData.largestContentfulPaint,
      firstInputDelay: pageSpeedData.firstInputDelay,
      cumulativeLayoutShift: pageSpeedData.cumulativeLayoutShift,
      speedIndex: pageSpeedData.speedIndex,
      totalBlockingTime: pageSpeedData.totalBlockingTime,
      
      // Resource breakdown
      totalResourceSize: pageSpeedData.totalResourceSize,
      imageResourceSize: pageSpeedData.imageResourceSize,
      scriptResourceSize: pageSpeedData.scriptResourceSize,
      stylesheetResourceSize: pageSpeedData.stylesheetResourceSize,
      fontResourceSize: pageSpeedData.fontResourceSize,
      
      // Optimization opportunities
      unusedCssBytes: pageSpeedData.unusedCssBytes,
      unusedJsBytes: pageSpeedData.unusedJsBytes,
      unoptimizedImageBytes: pageSpeedData.unoptimizedImageBytes,
      
      // Additional metrics
      bestPracticesScore: pageSpeedData.bestPracticesScore,
      serverResponseTime: pageSpeedData.serverResponseTime,
      renderBlockingResources: pageSpeedData.renderBlockingResources,
      domSize: pageSpeedData.domSize,
    }
  };
}

function checkGreenHosting(url: string): boolean {
  // Simplified green hosting check - in production, you'd use a proper green hosting database
  const greenHosts = [
    'greengeeks.com',
    'hostgator.com', 
    'dreamhost.com',
    'a2hosting.com',
    'siteground.com',
    'netlify.com',
    'vercel.com',
    'github.io',
    'gitlab.io',
    'surge.sh'
  ];
  
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return greenHosts.some(host => hostname.includes(host));
  } catch {
    return false;
  }
}

/**
 * Generate a consistent seed from URL for deterministic "random" values
 */
function generateSeedFromUrl(url: string): number {
  let hash = 0;
  const normalizedUrl = url.toLowerCase().replace(/^https?:\/\/(www\.)?/, '');
  
  for (let i = 0; i < normalizedUrl.length; i++) {
    const char = normalizedUrl.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash);
}

/**
 * Generate seeded random number (0-1) based on URL and index
 */
function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed + index * 1000) * 10000;
  return x - Math.floor(x);
}
