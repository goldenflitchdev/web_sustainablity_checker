import { co2 } from '@tgwf/co2';
import type { PageSpeedData } from './pagespeed-api';

export interface CO2CalculationResult {
  totalCO2: number; // Total CO2 in grams
  co2PerVisit: number; // CO2 per visit in grams
  co2Rating: string; // A+ to F rating
  breakdown: {
    dataCenterCO2: number;
    networkCO2: number;
    deviceCO2: number;
    operationalCO2: number;
    embodiedCO2: number;
  };
  greenHostingImpact: {
    currentCO2: number;
    withGreenHosting: number;
    potentialSavings: number;
    savingsPercentage: number;
  };
  optimizationPotential: {
    unusedCssSavings: number;
    unusedJsSavings: number;
    imageOptimizationSavings: number;
    totalPotentialSavings: number;
  };
}

export interface SustainabilityMetrics {
  energyEfficiency: number; // 0-100 score
  carbonFootprint: number; // 0-100 score (higher is better)
  resourceOptimization: number; // 0-100 score
  overallSustainability: number; // 0-100 score
  co2Data: CO2CalculationResult;
}

export class CO2Calculator {
  private co2Instance: any;

  constructor() {
    // Initialize CO2.js with Sustainable Web Design v4 model
    this.co2Instance = new co2({
      model: 'swd',
      version: 4,
      results: 'segment', // Get detailed breakdown
      rating: true // Include A+ to F rating
    });
  }

  /**
   * Calculate CO2 emissions from PageSpeed Insights data
   */
  calculateCO2FromPageSpeed(data: PageSpeedData, isGreenHosting: boolean = false): CO2CalculationResult {
    console.log('Calculating CO2 emissions from PageSpeed data...');
    
    // Use total resource size as the primary metric (bytes transferred)
    const bytesTransferred = data.totalResourceSize;
    
    console.log(`Total bytes transferred: ${bytesTransferred} bytes (${(bytesTransferred / 1024 / 1024).toFixed(2)} MB)`);

    // Calculate CO2 per byte
    const co2PerByte = this.co2Instance.perByte(bytesTransferred, isGreenHosting);
    
    // Calculate CO2 per visit (considering return visitors)
    const visitOptions = {
      firstVisitPercentage: 0.75, // 75% first-time visitors
      returnVisitPercentage: 0.25, // 25% return visitors  
      dataReloadRatio: 0.02, // 2% of data reloaded on return visits
    };
    
    const co2PerVisit = this.co2Instance.perVisit(bytesTransferred, isGreenHosting, visitOptions);

    // Get detailed breakdown if available
    let breakdown = {
      dataCenterCO2: 0,
      networkCO2: 0,
      deviceCO2: 0,
      operationalCO2: 0,
      embodiedCO2: 0,
    };

    if (typeof co2PerByte === 'object' && co2PerByte.total !== undefined) {
      breakdown = {
        dataCenterCO2: co2PerByte.dataCenterCO2 || 0,
        networkCO2: co2PerByte.networkCO2 || 0,
        deviceCO2: co2PerByte.consumerDeviceCO2 || 0,
        operationalCO2: co2PerByte.totalOperationalCO2e || 0,
        embodiedCO2: co2PerByte.totalEmbodiedCO2e || 0,
      };
    }

    const totalCO2 = typeof co2PerByte === 'number' ? co2PerByte : co2PerByte.total;
    const visitCO2 = typeof co2PerVisit === 'number' ? co2PerVisit : co2PerVisit.total;
    const rating = typeof co2PerByte === 'object' && co2PerByte.rating ? co2PerByte.rating : this.calculateRating(totalCO2);

    // Calculate green hosting impact
    const greenHostingImpact = this.calculateGreenHostingImpact(bytesTransferred, isGreenHosting);

    // Calculate optimization potential
    const optimizationPotential = this.calculateOptimizationPotential(data);

    console.log(`CO2 calculation complete: ${totalCO2.toFixed(4)}g per byte transfer, ${visitCO2.toFixed(4)}g per visit, Rating: ${rating}`);

    return {
      totalCO2,
      co2PerVisit: visitCO2,
      co2Rating: rating,
      breakdown,
      greenHostingImpact,
      optimizationPotential,
    };
  }

  /**
   * Calculate comprehensive sustainability metrics
   */
  calculateSustainabilityMetrics(data: PageSpeedData, isGreenHosting: boolean = false): SustainabilityMetrics {
    console.log('Calculating comprehensive sustainability metrics...');

    // Calculate CO2 data
    const co2Data = this.calculateCO2FromPageSpeed(data, isGreenHosting);

    // Calculate energy efficiency score (0-100, higher is better)
    const energyEfficiency = this.calculateEnergyEfficiencyScore(data);

    // Calculate carbon footprint score (0-100, higher is better - lower emissions)
    const carbonFootprint = this.calculateCarbonFootprintScore(co2Data, data);

    // Calculate resource optimization score (0-100, higher is better)
    const resourceOptimization = this.calculateResourceOptimizationScore(data);

    // Calculate overall sustainability score (weighted average)
    const overallSustainability = Math.round(
      (energyEfficiency * 0.25) +
      (carbonFootprint * 0.35) + // Carbon footprint has higher weight
      (resourceOptimization * 0.25) +
      (data.performanceScore * 0.15) // Include performance as a factor
    );

    console.log(`Sustainability metrics calculated: Energy: ${energyEfficiency}, Carbon: ${carbonFootprint}, Resources: ${resourceOptimization}, Overall: ${overallSustainability}`);

    return {
      energyEfficiency,
      carbonFootprint,
      resourceOptimization,
      overallSustainability,
      co2Data,
    };
  }

  /**
   * Calculate energy efficiency score based on performance metrics
   */
  private calculateEnergyEfficiencyScore(data: PageSpeedData): number {
    let score = 100;

    // Penalize slow loading times (more energy consumption)
    if (data.largestContentfulPaint > 4000) {
      score -= 25;
    } else if (data.largestContentfulPaint > 2500) {
      score -= 15;
    } else if (data.largestContentfulPaint > 1500) {
      score -= 5;
    }

    // Penalize high Total Blocking Time
    if (data.totalBlockingTime > 300) {
      score -= 20;
    } else if (data.totalBlockingTime > 150) {
      score -= 10;
    }

    // Penalize large resource sizes
    const totalSizeMB = data.totalResourceSize / (1024 * 1024);
    if (totalSizeMB > 3) {
      score -= 20;
    } else if (totalSizeMB > 2) {
      score -= 10;
    } else if (totalSizeMB > 1) {
      score -= 5;
    }

    // Bonus for good performance score
    if (data.performanceScore > 90) {
      score += 5;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate carbon footprint score (higher score = lower emissions)
   */
  private calculateCarbonFootprintScore(co2Data: CO2CalculationResult, data: PageSpeedData): number {
    let score = 100;

    // Base score on CO2 per visit
    const co2PerVisit = co2Data.co2PerVisit;
    
    // Penalize high CO2 emissions
    if (co2PerVisit > 1.0) {
      score -= Math.min(40, (co2PerVisit - 1.0) * 30);
    } else if (co2PerVisit > 0.5) {
      score -= Math.min(20, (co2PerVisit - 0.5) * 20);
    }

    // Consider green hosting
    if (co2Data.greenHostingImpact.savingsPercentage > 0) {
      score += 10;
    }

    // Consider optimization potential
    const optimizationSavingsPercent = (co2Data.optimizationPotential.totalPotentialSavings / co2Data.totalCO2) * 100;
    if (optimizationSavingsPercent > 30) {
      score -= 15; // Penalize sites with high optimization potential
    } else if (optimizationSavingsPercent > 15) {
      score -= 8;
    }

    // Rating-based adjustment
    const ratingBonus = this.getRatingBonus(co2Data.co2Rating);
    score += ratingBonus;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate resource optimization score
   */
  private calculateResourceOptimizationScore(data: PageSpeedData): number {
    let score = 100;

    // Penalize unused resources
    const totalSize = data.totalResourceSize;
    const unusedCssPercent = (data.unusedCssBytes / totalSize) * 100;
    const unusedJsPercent = (data.unusedJsBytes / totalSize) * 100;

    if (unusedCssPercent > 20) {
      score -= 15;
    } else if (unusedCssPercent > 10) {
      score -= 8;
    }

    if (unusedJsPercent > 25) {
      score -= 20;
    } else if (unusedJsPercent > 15) {
      score -= 10;
    }

    // Penalize unoptimized images
    const unoptimizedImagePercent = (data.unoptimizedImageBytes / data.imageResourceSize) * 100;
    if (unoptimizedImagePercent > 30) {
      score -= 15;
    } else if (unoptimizedImagePercent > 15) {
      score -= 8;
    }

    // Penalize excessive render-blocking resources
    if (data.renderBlockingResources > 10) {
      score -= 15;
    } else if (data.renderBlockingResources > 5) {
      score -= 8;
    }

    // Penalize large DOM size
    if (data.domSize > 1500) {
      score -= 10;
    } else if (data.domSize > 1000) {
      score -= 5;
    }

    // Bonus for good best practices score
    if (data.bestPracticesScore > 90) {
      score += 5;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate green hosting impact
   */
  private calculateGreenHostingImpact(bytesTransferred: number, isCurrentlyGreen: boolean) {
    const currentCO2 = this.co2Instance.perByte(bytesTransferred, isCurrentlyGreen);
    const withGreenHosting = this.co2Instance.perByte(bytesTransferred, true);
    
    const current = typeof currentCO2 === 'number' ? currentCO2 : currentCO2.total;
    const green = typeof withGreenHosting === 'number' ? withGreenHosting : withGreenHosting.total;
    
    const potentialSavings = current - green;
    const savingsPercentage = current > 0 ? (potentialSavings / current) * 100 : 0;

    return {
      currentCO2: current,
      withGreenHosting: green,
      potentialSavings,
      savingsPercentage,
    };
  }

  /**
   * Calculate optimization potential in CO2 savings
   */
  private calculateOptimizationPotential(data: PageSpeedData): {
    unusedCssSavings: number;
    unusedJsSavings: number;
    imageOptimizationSavings: number;
    totalPotentialSavings: number;
  } {
    // Calculate CO2 savings from removing unused resources
    const unusedCssSavings = this.co2Instance.perByte(data.unusedCssBytes, false);
    const unusedJsSavings = this.co2Instance.perByte(data.unusedJsBytes, false);
    const imageOptimizationSavings = this.co2Instance.perByte(data.unoptimizedImageBytes, false);

    const cssValue = typeof unusedCssSavings === 'number' ? unusedCssSavings : unusedCssSavings.total;
    const jsValue = typeof unusedJsSavings === 'number' ? unusedJsSavings : unusedJsSavings.total;
    const imageValue = typeof imageOptimizationSavings === 'number' ? imageOptimizationSavings : imageOptimizationSavings.total;

    return {
      unusedCssSavings: cssValue,
      unusedJsSavings: jsValue,
      imageOptimizationSavings: imageValue,
      totalPotentialSavings: cssValue + jsValue + imageValue,
    };
  }

  /**
   * Calculate rating manually if not provided by CO2.js
   */
  private calculateRating(co2Grams: number): string {
    // Based on Sustainable Web Design model v4 ratings
    if (co2Grams <= 0.095) return 'A+';
    if (co2Grams <= 0.186) return 'A';
    if (co2Grams <= 0.341) return 'B';
    if (co2Grams <= 0.493) return 'C';
    if (co2Grams <= 0.656) return 'D';
    if (co2Grams <= 0.846) return 'E';
    return 'F';
  }

  /**
   * Get bonus points based on CO2 rating
   */
  private getRatingBonus(rating: string): number {
    const bonuses = {
      'A+': 10,
      'A': 8,
      'B': 5,
      'C': 2,
      'D': 0,
      'E': -5,
      'F': -10,
    };
    return bonuses[rating as keyof typeof bonuses] || 0;
  }

  /**
   * Generate detailed recommendations based on analysis
   */
  generateRecommendations(metrics: SustainabilityMetrics, data: PageSpeedData): string[] {
    const recommendations: string[] = [];
    const { co2Data } = metrics;

    // Carbon footprint recommendations
    if (metrics.carbonFootprint < 70) {
      if (co2Data.greenHostingImpact.savingsPercentage > 20) {
        recommendations.push(`Switch to green hosting to reduce CO2 emissions by ${co2Data.greenHostingImpact.savingsPercentage.toFixed(1)}% (${co2Data.greenHostingImpact.potentialSavings.toFixed(3)}g CO2 per visit)`);
      }
      
      if (co2Data.co2PerVisit > 1.0) {
        recommendations.push(`High carbon footprint detected (${co2Data.co2PerVisit.toFixed(3)}g CO2 per visit). Consider reducing total page size and optimizing resources.`);
      }
    }

    // Energy efficiency recommendations
    if (metrics.energyEfficiency < 70) {
      if (data.largestContentfulPaint > 2500) {
        recommendations.push(`Improve Largest Contentful Paint (currently ${(data.largestContentfulPaint / 1000).toFixed(1)}s) by optimizing images and critical resources`);
      }
      
      if (data.totalBlockingTime > 200) {
        recommendations.push(`Reduce Total Blocking Time (currently ${data.totalBlockingTime}ms) by optimizing JavaScript execution`);
      }

      const totalSizeMB = data.totalResourceSize / (1024 * 1024);
      if (totalSizeMB > 2) {
        recommendations.push(`Large total resource size (${totalSizeMB.toFixed(1)}MB). Consider implementing lazy loading and resource optimization`);
      }
    }

    // Resource optimization recommendations
    if (metrics.resourceOptimization < 70) {
      if (data.unusedCssBytes > 50000) {
        recommendations.push(`Remove unused CSS (${(data.unusedCssBytes / 1024).toFixed(0)}KB) to save ${co2Data.optimizationPotential.unusedCssSavings.toFixed(3)}g CO2 per visit`);
      }
      
      if (data.unusedJsBytes > 100000) {
        recommendations.push(`Remove unused JavaScript (${(data.unusedJsBytes / 1024).toFixed(0)}KB) to save ${co2Data.optimizationPotential.unusedJsSavings.toFixed(3)}g CO2 per visit`);
      }
      
      if (data.unoptimizedImageBytes > 200000) {
        recommendations.push(`Optimize images (${(data.unoptimizedImageBytes / 1024).toFixed(0)}KB potential savings) to save ${co2Data.optimizationPotential.imageOptimizationSavings.toFixed(3)}g CO2 per visit`);
      }
      
      if (data.renderBlockingResources > 8) {
        recommendations.push(`Reduce render-blocking resources (${data.renderBlockingResources} detected) by inlining critical CSS and deferring non-critical JavaScript`);
      }
    }

    // Performance-based recommendations
    if (data.performanceScore < 70) {
      if (data.serverResponseTime > 600) {
        recommendations.push(`Improve server response time (currently ${data.serverResponseTime}ms) by optimizing backend performance and using a CDN`);
      }
      
      if (data.firstInputDelay > 100) {
        recommendations.push(`Reduce First Input Delay (${data.firstInputDelay}ms) by optimizing JavaScript execution and using web workers for heavy tasks`);
      }
    }

    // General sustainability recommendations
    if (co2Data.optimizationPotential.totalPotentialSavings > co2Data.totalCO2 * 0.2) {
      recommendations.push(`Significant optimization potential detected: ${co2Data.optimizationPotential.totalPotentialSavings.toFixed(3)}g CO2 savings possible per visit`);
    }

    recommendations.push('Implement efficient caching strategies to reduce repeat data transfer');
    recommendations.push('Use modern image formats (WebP, AVIF) and responsive images');
    recommendations.push('Consider implementing a service worker for offline functionality');
    
    // Add rating-specific advice
    if (co2Data.co2Rating === 'F' || co2Data.co2Rating === 'E') {
      recommendations.push('Critical: This website has a very high carbon footprint. Immediate optimization is recommended.');
    } else if (co2Data.co2Rating === 'A+' || co2Data.co2Rating === 'A') {
      recommendations.push('Excellent: This website has a low carbon footprint. Continue monitoring and optimizing.');
    }

    return recommendations.slice(0, 12); // Limit to top 12 recommendations
  }
}
