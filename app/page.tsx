'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SustainabilityReport {
  overallScore: number;
  energyEfficiency: number;
  carbonFootprint: number;
  resourceOptimization: number;
  accessibility: number;
  recommendations: string[];
  timestamp: string;
  analysisMethod?: 'pagespeed' | 'basic' | 'simulated';
  co2Data?: {
    totalCO2: number;
    co2PerVisit: number;
    co2Rating: string;
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
  };
  analysisData: {
    url: string;
    loadTime: number;
    pageSize: number;
    imageCount: number;
    scriptCount: number;
    cssCount: number;
    fontCount: number;
    videoCount: number;
    seoScore: number;
    performanceScore: number;
    actualCarbonFootprint: number;
    greenHosting: boolean;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    
    // Enhanced PageSpeed metrics
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    firstInputDelay?: number;
    cumulativeLayoutShift?: number;
    speedIndex?: number;
    totalBlockingTime?: number;
    
    // Resource breakdown
    totalResourceSize?: number;
    imageResourceSize?: number;
    scriptResourceSize?: number;
    stylesheetResourceSize?: number;
    fontResourceSize?: number;
    
    // Optimization opportunities
    unusedCssBytes?: number;
    unusedJsBytes?: number;
    unoptimizedImageBytes?: number;
    
    // Additional metrics
    bestPracticesScore?: number;
    serverResponseTime?: number;
    renderBlockingResources?: number;
    domSize?: number;
  };
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<SustainabilityReport | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Auto-format URL if protocol is missing
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // Basic URL validation
    try {
      new URL(formattedUrl);
    } catch {
      setError('Please enter a valid website URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setReport(null);

    try {
      const response = await fetch('/api/ws-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: { url: formattedUrl } }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze website');
      }

      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        const reportData = JSON.parse(data.choices[0].message.content);
        setReport({
          ...reportData,
          timestamp: new Date().toLocaleString(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-amber-700';
    return 'text-red-700';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-amber-50';
    return 'bg-red-50';
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? (
      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="sr-only">Enabled</span>
      </div>
    ) : (
      <div className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-black/60" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <span className="sr-only">Disabled</span>
      </div>
    );
  };

  const getScoreCircleColor = (score: number) => {
    if (score >= 75) return 'bg-green-600';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* Header */}
        <header className="text-left mb-20">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-semibold text-black mb-6 tracking-tight leading-none">
              Web Sustainability
              <br />
              <span className="text-black/60">Checker</span>
            </h1>
          </div>
          <p className="text-lg text-black/60 max-w-3xl leading-relaxed font-medium">
            Analyze your website's environmental impact with precision using Google PageSpeed Insights 
            and CO2.js to get actionable sustainability recommendations.
          </p>
        </header>

        {/* URL Input Form */}
        <div className="mb-20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL"
                className="w-full px-8 py-6 text-xl font-medium text-black bg-white border-2 border-black/10 rounded-3xl focus:border-black focus:outline-none transition-all duration-300 placeholder:text-black/30"
                required
              />
              {url && (
                <div className="mt-4 p-4 bg-black/5 rounded-2xl">
                  <p className="text-sm text-black/60 font-medium">
                    <span className="text-black">Will analyze:</span> {
                      url.startsWith('http://') || url.startsWith('https://') 
                        ? url 
                        : `https://${url}`
                    }
                  </p>
                </div>
              )}
            </div>
            
            <div className="text-left">
              <button
                type="submit"
                disabled={isLoading}
                className="golden-button disabled:opacity-50 disabled:cursor-not-allowed text-lg px-12 py-4"
                aria-describedby={isLoading ? "loading-status" : undefined}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Sustainability'}
              </button>
              <p className="text-sm text-black/40 mt-4 font-medium">
                Powered by Google PageSpeed Insights & CO2.js
              </p>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-12 p-6 bg-red-50 rounded-3xl" role="alert" aria-live="assertive">
            <p className="text-red-800 font-semibold text-left">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-left mb-20" role="status" aria-live="polite">
            <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mb-8" aria-hidden="true"></div>
            <p id="loading-status" className="text-xl font-medium text-black/60">Analyzing website sustainability...</p>
          </div>
        )}

        {/* Sustainability Report */}
        {report && (
          <main className="space-y-16" role="main" aria-labelledby="report-title">
            {/* Overall Score Card */}
            <section className="golden-card p-12" aria-labelledby="overall-score-title">
              <div className="text-left mb-12">
                <h2 id="report-title" className="text-4xl font-semibold text-black mb-4 tracking-tight">
                  Sustainability Report
                </h2>
                <p className="text-black/60 text-lg font-medium">
                  Analyzed on {report.timestamp}
                </p>
                {report.analysisMethod && (
                  <div className={`mt-6 inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold ${
                    report.analysisMethod === 'pagespeed' 
                      ? 'bg-black text-white' 
                      : report.analysisMethod === 'basic'
                      ? 'bg-black/10 text-black'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      report.analysisMethod === 'pagespeed' 
                        ? 'bg-white' 
                        : report.analysisMethod === 'basic'
                        ? 'bg-black'
                        : 'bg-amber-500'
                    }`}></div>
                    {report.analysisMethod === 'pagespeed' 
                      ? 'PageSpeed Insights + CO2.js' 
                      : report.analysisMethod === 'basic'
                      ? 'Basic Analysis'
                      : 'Simulated Analysis'}
                  </div>
                )}
              </div>

              <div className="text-left mb-12">
                <div className="flex items-center justify-start mb-6">
                  <div className={`flex items-center justify-center w-40 h-40 rounded-full ${getScoreCircleColor(report.overallScore)}`}>
                    <span className="text-6xl font-semibold text-white">
                      {report.overallScore}
                    </span>
                  </div>
                </div>
                <h3 id="overall-score-title" className="text-3xl font-semibold text-black mb-3 tracking-tight">Overall Sustainability Score</h3>
                <p className="text-xl text-black/60 font-medium">
                  {report.overallScore >= 80 ? 'Excellent Performance' : 
                   report.overallScore >= 60 ? 'Good Performance' : 'Needs Improvement'}
                </p>
              </div>

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-black/5 rounded-3xl p-8 text-center golden-transition hover:bg-black/10">
                  <h4 className="font-semibold text-black mb-4 text-lg">Energy Efficiency</h4>
                  <div className="text-4xl font-semibold text-black mb-4">{report.energyEfficiency}%</div>
                  <div className="w-full bg-black/10 rounded-full h-3">
                    <div 
                      className="bg-black h-3 rounded-full golden-transition"
                      style={{ width: `${report.energyEfficiency}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-black/5 rounded-3xl p-8 text-center golden-transition hover:bg-black/10">
                  <h4 className="font-semibold text-black mb-4 text-lg">Carbon Footprint</h4>
                  <div className="text-4xl font-semibold text-black mb-4">{report.carbonFootprint}%</div>
                  <div className="w-full bg-black/10 rounded-full h-3">
                    <div 
                      className="bg-black h-3 rounded-full golden-transition"
                      style={{ width: `${report.carbonFootprint}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-black/5 rounded-3xl p-8 text-center golden-transition hover:bg-black/10">
                  <h4 className="font-semibold text-black mb-4 text-lg">Resource Optimization</h4>
                  <div className="text-4xl font-semibold text-black mb-4">{report.resourceOptimization}%</div>
                  <div className="w-full bg-black/10 rounded-full h-3">
                    <div 
                      className="bg-black h-3 rounded-full golden-transition"
                      style={{ width: `${report.resourceOptimization}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-black/5 rounded-3xl p-8 text-center golden-transition hover:bg-black/10">
                  <h4 className="font-semibold text-black mb-4 text-lg">Accessibility</h4>
                  <div className="text-4xl font-semibold text-black mb-4">{report.accessibility}%</div>
                  <div className="w-full bg-black/10 rounded-full h-3">
                    <div 
                      className="bg-black h-3 rounded-full golden-transition"
                      style={{ width: `${report.accessibility}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Analysis */}
            <section className="golden-card p-12" aria-labelledby="technical-analysis-title">
              <h3 id="technical-analysis-title" className="text-3xl font-semibold text-black mb-12 tracking-tight">Technical Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <h4 className="font-semibold text-black text-xl mb-6">Performance</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-black/10">
                      <span className="text-black/60 font-medium">Load Time</span>
                      <span className="font-semibold text-black">{report.analysisData.loadTime}ms</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/10">
                      <span className="text-black/60 font-medium">Page Size</span>
                      <span className="font-semibold text-black">{report.analysisData.pageSize} KB</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-black/60 font-medium">Performance Score</span>
                      <span className="font-semibold text-black">{report.analysisData.performanceScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-semibold text-black text-xl mb-6">Resources</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-black/10">
                      <span className="text-black/60 font-medium">Images</span>
                      <span className="font-semibold text-black">{report.analysisData.imageCount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/10">
                      <span className="text-black/60 font-medium">Scripts</span>
                      <span className="font-semibold text-black">{report.analysisData.scriptCount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/10">
                      <span className="text-black/60 font-medium">CSS Files</span>
                      <span className="font-semibold text-black">{report.analysisData.cssCount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/10">
                      <span className="text-black/60 font-medium">Fonts</span>
                      <span className="font-semibold text-black">{report.analysisData.fontCount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-black/60 font-medium">Videos</span>
                      <span className="font-semibold text-black">{report.analysisData.videoCount}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-semibold text-black text-xl mb-6">Quality Scores</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-black/10">
                      <span className="text-black/60 font-medium">SEO Score</span>
                      <span className="font-semibold text-black">{report.analysisData.seoScore}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-black/60 font-medium">Carbon Impact</span>
                      <span className="font-semibold text-black">{report.analysisData.actualCarbonFootprint}g CO2</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CO2 Emissions Analysis */}
            {report.co2Data && (
              <section className="golden-card p-12" aria-labelledby="co2-analysis-title">
                <h3 id="co2-analysis-title" className="text-3xl font-semibold text-black mb-12 tracking-tight">Carbon Footprint Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  <div className="bg-black/5 rounded-3xl p-8 text-left golden-transition hover:bg-black/10">
                    <h4 className="font-semibold text-black mb-4 text-lg">CO2 per Visit</h4>
                    <div className="text-4xl font-semibold text-black mb-4">
                      {report.co2Data.co2PerVisit.toFixed(3)}g
                    </div>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      report.co2Data.co2Rating === 'A+' || report.co2Data.co2Rating === 'A' 
                        ? 'bg-black text-white'
                        : report.co2Data.co2Rating === 'B' || report.co2Data.co2Rating === 'C'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Rating: {report.co2Data.co2Rating}
                    </div>
                  </div>

                  <div className="bg-black/5 rounded-3xl p-8 text-left golden-transition hover:bg-black/10">
                    <h4 className="font-semibold text-black mb-4 text-lg">Data Center</h4>
                    <div className="text-3xl font-semibold text-black mb-4">
                      {(report.co2Data.breakdown.dataCenterCO2 * 1000).toFixed(1)}mg
                    </div>
                    <div className="text-sm text-black/60 font-medium">
                      {((report.co2Data.breakdown.dataCenterCO2 / report.co2Data.co2PerVisit) * 100).toFixed(1)}% of total
                    </div>
                  </div>

                  <div className="bg-black/5 rounded-3xl p-8 text-left golden-transition hover:bg-black/10">
                    <h4 className="font-semibold text-black mb-4 text-lg">Network</h4>
                    <div className="text-3xl font-semibold text-black mb-4">
                      {(report.co2Data.breakdown.networkCO2 * 1000).toFixed(1)}mg
                    </div>
                    <div className="text-sm text-black/60 font-medium">
                      {((report.co2Data.breakdown.networkCO2 / report.co2Data.co2PerVisit) * 100).toFixed(1)}% of total
                    </div>
                  </div>

                  <div className="bg-black/5 rounded-3xl p-8 text-left golden-transition hover:bg-black/10">
                    <h4 className="font-semibold text-black mb-4 text-lg">Device</h4>
                    <div className="text-3xl font-semibold text-black mb-4">
                      {(report.co2Data.breakdown.deviceCO2 * 1000).toFixed(1)}mg
                    </div>
                    <div className="text-sm text-black/60 font-medium">
                      {((report.co2Data.breakdown.deviceCO2 / report.co2Data.co2PerVisit) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>

                {/* Green Hosting Impact */}
                {report.co2Data.greenHostingImpact.savingsPercentage > 0 && (
                  <div className="bg-black rounded-3xl p-8 mb-8">
                    <h4 className="font-semibold text-white mb-6 text-xl">🌱 Green Hosting Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-left">
                        <span className="text-white/60 font-medium block mb-2">Potential Savings</span>
                        <div className="font-semibold text-white text-2xl">
                          {report.co2Data.greenHostingImpact.potentialSavings.toFixed(3)}g CO2
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-white/60 font-medium block mb-2">Reduction</span>
                        <div className="font-semibold text-white text-2xl">
                          {report.co2Data.greenHostingImpact.savingsPercentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-white/60 font-medium block mb-2">With Green Hosting</span>
                        <div className="font-semibold text-white text-2xl">
                          {report.co2Data.greenHostingImpact.withGreenHosting.toFixed(3)}g CO2
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Optimization Potential */}
                {report.co2Data.optimizationPotential.totalPotentialSavings > 0.001 && (
                  <div className="bg-black/5 rounded-3xl p-8">
                    <h4 className="font-semibold text-black mb-6 text-xl">⚡ Optimization Potential</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-left">
                        <span className="text-black/60 font-medium block mb-2">Unused CSS</span>
                        <div className="font-semibold text-black text-xl">
                          {report.co2Data.optimizationPotential.unusedCssSavings.toFixed(3)}g
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-black/60 font-medium block mb-2">Unused JS</span>
                        <div className="font-semibold text-black text-xl">
                          {report.co2Data.optimizationPotential.unusedJsSavings.toFixed(3)}g
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-black/60 font-medium block mb-2">Image Optimization</span>
                        <div className="font-semibold text-black text-xl">
                          {report.co2Data.optimizationPotential.imageOptimizationSavings.toFixed(3)}g
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-black/60 font-medium block mb-2">Total Potential</span>
                        <div className="font-semibold text-black text-xl">
                          {report.co2Data.optimizationPotential.totalPotentialSavings.toFixed(3)}g
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}



            {/* Optimization Features */}
            <section className="golden-card p-12" aria-labelledby="optimization-features-title">
              <h3 id="optimization-features-title" className="text-3xl font-semibold text-black mb-12 tracking-tight">Optimization Features</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center justify-between p-8 bg-black/5 rounded-3xl golden-transition hover:bg-black/10">
                  <div>
                    <h4 className="font-semibold text-black text-lg">Green Hosting</h4>
                    <p className="text-black/60 font-medium">Renewable energy powered</p>
                  </div>
                  {getStatusIcon(report.analysisData.greenHosting)}
                </div>

                <div className="flex items-center justify-between p-8 bg-black/5 rounded-3xl golden-transition hover:bg-black/10">
                  <div>
                    <h4 className="font-semibold text-black text-lg">Compression</h4>
                    <p className="text-black/60 font-medium">Gzip/Brotli enabled</p>
                  </div>
                  {getStatusIcon(report.analysisData.compressionEnabled)}
                </div>

                <div className="flex items-center justify-between p-8 bg-black/5 rounded-3xl golden-transition hover:bg-black/10">
                  <div>
                    <h4 className="font-semibold text-black text-lg">CDN</h4>
                    <p className="text-black/60 font-medium">Content delivery network</p>
                  </div>
                  {getStatusIcon(report.analysisData.cdnEnabled)}
                </div>
              </div>
            </section>

            {/* Recommendations */}
            <section className="golden-card p-12" aria-labelledby="recommendations-title">
              <h3 id="recommendations-title" className="text-3xl font-semibold text-black mb-12 tracking-tight">Recommendations</h3>
              
              {report.analysisMethod === 'simulated' && (
                <div className="mb-8 p-6 bg-amber-50 rounded-3xl">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-amber-800">Simulated Analysis</h4>
                      <p className="text-amber-700 mt-1 font-medium">
                        This analysis uses simulated data because the website couldn't be accessed directly. 
                        For accurate results, ensure the website allows external analysis or try a different URL.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {report.analysisMethod === 'pagespeed' && (
                <div className="mb-8 p-6 bg-black rounded-3xl">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <svg className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">Enhanced Analysis</h4>
                      <p className="text-white/80 mt-1 font-medium">
                        This analysis uses Google PageSpeed Insights API combined with CO2.js for accurate carbon footprint calculations and comprehensive sustainability metrics.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {report.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-6 p-6 bg-black/5 rounded-3xl golden-transition hover:bg-black/10">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-black leading-relaxed font-medium text-lg">{rec}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        )}

        {/* Footer */}
        <footer className="text-left mt-24 pt-16 border-t border-black/10">
          <p className="text-black/40 font-medium text-lg tracking-tight">
            Built with Next.js • Promoting sustainable web development
          </p>
          <p className="text-black/30 font-medium mt-2">
            Powered by Google PageSpeed Insights & CO2.js
          </p>
        </footer>
      </div>
    </div>
  );
}
