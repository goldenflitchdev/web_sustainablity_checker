import { JSDOM } from 'jsdom';

// Ensure fetch is available in Node.js environment
const fetch = globalThis.fetch || require('node-fetch');

export interface WebsiteAnalysis {
  url: string;
  loadTime: number;
  pageSize: number;
  imageCount: number;
  scriptCount: number;
  cssCount: number;
  fontCount: number;
  videoCount: number;
  accessibilityScore: number;
  seoScore: number;
  performanceScore: number;
  carbonFootprint: number;
  greenHosting: boolean;
  compressionEnabled: boolean;
  cdnEnabled: boolean;
}

export class WebsiteAnalyzer {
  private dom: JSDOM | null = null;

  async analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
    try {
      const startTime = Date.now();
      
      console.log('Starting website analysis for:', url);
      
      // Fetch the website with timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; WebSustainabilityChecker/1.0)',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const loadTime = Date.now() - startTime;
      const pageSize = new Blob([html]).size / 1024; // Size in KB

      console.log(`Website fetched successfully: ${pageSize.toFixed(2)}KB, ${loadTime}ms`);

      // Parse HTML
      this.dom = new JSDOM(html);
      const document = this.dom.window.document;

      // Analyze various components
      const imageCount = this.countImages(document);
      const scriptCount = this.countScripts(document);
      const cssCount = this.countCSSFiles(document);
      const fontCount = this.countFonts(document);
      const videoCount = this.countVideos(document);
      
      // Calculate scores
      const accessibilityScore = this.calculateAccessibilityScore(document);
      const seoScore = this.calculateSEOScore(document);
      const performanceScore = this.calculatePerformanceScore(loadTime, pageSize);
      const carbonFootprint = this.calculateCarbonFootprint(pageSize, imageCount, videoCount);
      
      // Check for optimization features
      const greenHosting = this.checkGreenHosting(url);
      const compressionEnabled = this.checkCompression(response);
      const cdnEnabled = this.checkCDN(url, response);

      console.log('Analysis completed successfully');

      return {
        url,
        loadTime,
        pageSize: Math.round(pageSize * 100) / 100, // Round to 2 decimal places
        imageCount,
        scriptCount,
        cssCount,
        fontCount,
        videoCount,
        accessibilityScore,
        seoScore,
        performanceScore,
        carbonFootprint,
        greenHosting,
        compressionEnabled,
        cdnEnabled,
      };
    } catch (error) {
      console.error('Website analysis error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Website analysis timed out. The website took too long to respond.');
        } else if (error.message.includes('fetch')) {
          throw new Error('Unable to fetch website. The website may be blocking external requests or unavailable.');
        } else if (error.message.includes('HTTP')) {
          throw new Error(`Website returned an error: ${error.message}`);
        }
      }
      
      throw new Error(`Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private countImages(document: Document): number {
    const images = document.querySelectorAll('img');
    return images.length;
  }

  private countScripts(document: Document): number {
    const scripts = document.querySelectorAll('script[src]');
    return scripts.length;
  }

  private countCSSFiles(document: Document): number {
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    return cssLinks.length;
  }

  private countFonts(document: Document): number {
    const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"], link[rel="stylesheet"][href*="font"]');
    return fontLinks.length;
  }

  private countVideos(document: Document): number {
    const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
    return videos.length;
  }

  private calculateAccessibilityScore(document: Document): number {
    let score = 100;
    
    // Check for alt text on images
    const images = document.querySelectorAll('img');
    const imagesWithAlt = document.querySelectorAll('img[alt]');
    if (images.length > 0) {
      const altTextRatio = imagesWithAlt.length / images.length;
      score -= (1 - altTextRatio) * 20;
    }

    // Check for semantic HTML
    const semanticElements = document.querySelectorAll('header, nav, main, section, article, aside, footer');
    if (semanticElements.length < 3) {
      score -= 15;
    }

    // Check for proper heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      score -= 20;
    }

    // Check for form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    const labels = document.querySelectorAll('label');
    if (inputs.length > 0 && labels.length < inputs.length) {
      score -= 15;
    }

    return Math.max(0, Math.round(score));
  }

  private calculateSEOScore(document: Document): number {
    let score = 100;
    
    // Check for title tag
    const title = document.querySelector('title');
    if (!title || !title.textContent?.trim()) {
      score -= 20;
    }

    // Check for meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      score -= 15;
    }

    // Check for proper heading structure
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) {
      score -= 15;
    } else if (h1s.length > 1) {
      score -= 10;
    }

    // Check for canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      score -= 10;
    }

    return Math.max(0, Math.round(score));
  }

  private calculatePerformanceScore(loadTime: number, pageSize: number): number {
    let score = 100;
    
    // Load time scoring
    if (loadTime > 3000) score -= 30;
    else if (loadTime > 2000) score -= 20;
    else if (loadTime > 1000) score -= 10;
    
    // Page size scoring
    if (pageSize > 2000) score -= 25;
    else if (pageSize > 1000) score -= 15;
    else if (pageSize > 500) score -= 5;
    
    return Math.max(0, Math.round(score));
  }

  private calculateCarbonFootprint(pageSize: number, imageCount: number, videoCount: number): number {
    // Rough estimation: 1MB = ~0.5g CO2 per page view
    let carbonImpact = (pageSize / 1000) * 0.5;
    
    // Additional impact from media
    carbonImpact += imageCount * 0.02; // Each image adds ~0.02g
    carbonImpact += videoCount * 0.5;  // Each video adds ~0.5g
    
    return Math.round(carbonImpact * 100) / 100;
  }

  private checkGreenHosting(url: string): boolean {
    // This is a simplified check - in a real implementation, you'd query a database
    // of known green hosting providers
    const greenHosts = [
      'greengeeks.com',
      'hostgator.com',
      'dreamhost.com',
      'a2hosting.com',
      'siteground.com'
    ];
    
    try {
      const hostname = new URL(url).hostname;
      return greenHosts.some(host => hostname.includes(host));
    } catch {
      return false;
    }
  }

  private checkCompression(response: Response): boolean {
    const contentEncoding = response.headers.get('content-encoding');
    return contentEncoding === 'gzip' || contentEncoding === 'br' || contentEncoding === 'deflate';
  }

  private checkCDN(url: string, response: Response): boolean {
    const cdnHeaders = [
      'cf-cache-status', // Cloudflare
      'x-cache',         // Various CDNs
      'x-amz-cf-id',     // Amazon CloudFront
      'x-fastly',        // Fastly
      'x-vercel-cache'   // Vercel
    ];
    
    return cdnHeaders.some(header => response.headers.has(header));
  }
}
