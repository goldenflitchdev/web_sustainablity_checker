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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? (
      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    ) : (
      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/globe.svg"
              alt="Globe"
              width={48}
              height={48}
              className="mr-3"
            />
            <h1 className="text-4xl font-bold text-gray-800">
              Web Sustainability Checker
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze your website's environmental impact and get actionable recommendations 
            to make it more sustainable and energy-efficient.
          </p>
        </div>

        {/* URL Input Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., example.com or https://example.com)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 You can enter just the domain (e.g., "example.com") - we'll add https:// automatically
              </p>
              {url && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs text-blue-700">
                    <span className="font-medium">Will analyze:</span> {
                      url.startsWith('http://') || url.startsWith('https://') 
                        ? url 
                        : `https://${url}`
                    }
                  </p>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Analyzing...' : 'Check Sustainability'}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Analyzing website sustainability...</p>
          </div>
        )}

        {/* Sustainability Report */}
        {report && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Overall Score Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Sustainability Report
                </h2>
                <p className="text-gray-600">
                  Analyzed on {report.timestamp}
                </p>
                {report.analysisMethod && (
                  <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    report.analysisMethod === 'pagespeed' 
                      ? 'bg-blue-100 text-blue-800' 
                      : report.analysisMethod === 'basic'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      report.analysisMethod === 'pagespeed' 
                        ? 'bg-blue-500' 
                        : report.analysisMethod === 'basic'
                        ? 'bg-green-500' 
                        : 'bg-yellow-500'
                    }`}></div>
                    {report.analysisMethod === 'pagespeed' 
                      ? 'PageSpeed Insights + CO2.js' 
                      : report.analysisMethod === 'basic'
                      ? 'Basic Analysis'
                      : 'Simulated Analysis'}
                  </div>
                )}
              </div>

              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(report.overallScore)} mb-4`}>
                  <span className={`text-5xl font-bold ${getScoreColor(report.overallScore)}`}>
                    {report.overallScore}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Overall Sustainability Score</h3>
                <p className="text-gray-600 text-lg">
                  {report.overallScore >= 80 ? 'Excellent' : 
                   report.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">Energy Efficiency</h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">{report.energyEfficiency}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${report.energyEfficiency}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">Carbon Footprint</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{report.carbonFootprint}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${report.carbonFootprint}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">Resource Optimization</h4>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{report.resourceOptimization}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${report.resourceOptimization}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">Accessibility</h4>
                  <div className="text-3xl font-bold text-orange-600 mb-2">{report.accessibility}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${report.accessibility}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Technical Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Performance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Load Time:</span>
                      <span className="font-mono">{report.analysisData.loadTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Page Size:</span>
                      <span className="font-mono">{report.analysisData.pageSize} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance Score:</span>
                      <span className="font-mono">{report.analysisData.performanceScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Resources</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Images:</span>
                      <span className="font-mono">{report.analysisData.imageCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scripts:</span>
                      <span className="font-mono">{report.analysisData.scriptCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CSS Files:</span>
                      <span className="font-mono">{report.analysisData.cssCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fonts:</span>
                      <span className="font-mono">{report.analysisData.fontCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Videos:</span>
                      <span className="font-mono">{report.analysisData.videoCount}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Quality Scores</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>SEO Score:</span>
                      <span className="font-mono">{report.analysisData.seoScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbon Impact:</span>
                      <span className="font-mono">{report.analysisData.actualCarbonFootprint}g CO2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CO2 Emissions Analysis */}
            {report.co2Data && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Carbon Footprint Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-gray-800 mb-2">CO2 per Visit</h4>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {report.co2Data.co2PerVisit.toFixed(3)}g
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      report.co2Data.co2Rating === 'A+' || report.co2Data.co2Rating === 'A' 
                        ? 'bg-green-100 text-green-800'
                        : report.co2Data.co2Rating === 'B' || report.co2Data.co2Rating === 'C'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Rating: {report.co2Data.co2Rating}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-gray-800 mb-2">Data Center</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {(report.co2Data.breakdown.dataCenterCO2 * 1000).toFixed(1)}mg
                    </div>
                    <div className="text-xs text-gray-600">
                      {((report.co2Data.breakdown.dataCenterCO2 / report.co2Data.co2PerVisit) * 100).toFixed(1)}% of total
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-gray-800 mb-2">Network</h4>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {(report.co2Data.breakdown.networkCO2 * 1000).toFixed(1)}mg
                    </div>
                    <div className="text-xs text-gray-600">
                      {((report.co2Data.breakdown.networkCO2 / report.co2Data.co2PerVisit) * 100).toFixed(1)}% of total
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-gray-800 mb-2">Device</h4>
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {(report.co2Data.breakdown.deviceCO2 * 1000).toFixed(1)}mg
                    </div>
                    <div className="text-xs text-gray-600">
                      {((report.co2Data.breakdown.deviceCO2 / report.co2Data.co2PerVisit) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>

                {/* Green Hosting Impact */}
                {report.co2Data.greenHostingImpact.savingsPercentage > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-green-800 mb-3">🌱 Green Hosting Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Potential Savings:</span>
                        <div className="font-mono font-bold text-green-700">
                          {report.co2Data.greenHostingImpact.potentialSavings.toFixed(3)}g CO2
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Reduction:</span>
                        <div className="font-mono font-bold text-green-700">
                          {report.co2Data.greenHostingImpact.savingsPercentage.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">With Green Hosting:</span>
                        <div className="font-mono font-bold text-green-700">
                          {report.co2Data.greenHostingImpact.withGreenHosting.toFixed(3)}g CO2
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Optimization Potential */}
                {report.co2Data.optimizationPotential.totalPotentialSavings > 0.001 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-3">⚡ Optimization Potential</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Unused CSS:</span>
                        <div className="font-mono font-bold text-blue-700">
                          {report.co2Data.optimizationPotential.unusedCssSavings.toFixed(3)}g
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Unused JS:</span>
                        <div className="font-mono font-bold text-blue-700">
                          {report.co2Data.optimizationPotential.unusedJsSavings.toFixed(3)}g
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Image Optimization:</span>
                        <div className="font-mono font-bold text-blue-700">
                          {report.co2Data.optimizationPotential.imageOptimizationSavings.toFixed(3)}g
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Potential:</span>
                        <div className="font-mono font-bold text-blue-700">
                          {report.co2Data.optimizationPotential.totalPotentialSavings.toFixed(3)}g
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Performance Metrics */}
            {report.analysisData.firstContentfulPaint && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Core Web Vitals</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">First Contentful Paint</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {(report.analysisData.firstContentfulPaint! / 1000).toFixed(2)}s
                    </div>
                    <div className="text-xs text-gray-600">
                      {report.analysisData.firstContentfulPaint! < 1800 ? '✅ Good' : 
                       report.analysisData.firstContentfulPaint! < 3000 ? '⚠️ Needs Improvement' : '❌ Poor'}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Largest Contentful Paint</h4>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {(report.analysisData.largestContentfulPaint! / 1000).toFixed(2)}s
                    </div>
                    <div className="text-xs text-gray-600">
                      {report.analysisData.largestContentfulPaint! < 2500 ? '✅ Good' : 
                       report.analysisData.largestContentfulPaint! < 4000 ? '⚠️ Needs Improvement' : '❌ Poor'}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Cumulative Layout Shift</h4>
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {report.analysisData.cumulativeLayoutShift!.toFixed(3)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {report.analysisData.cumulativeLayoutShift! < 0.1 ? '✅ Good' : 
                       report.analysisData.cumulativeLayoutShift! < 0.25 ? '⚠️ Needs Improvement' : '❌ Poor'}
                    </div>
                  </div>

                  {report.analysisData.firstInputDelay && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">First Input Delay</h4>
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {report.analysisData.firstInputDelay.toFixed(0)}ms
                      </div>
                      <div className="text-xs text-gray-600">
                        {report.analysisData.firstInputDelay < 100 ? '✅ Good' : 
                         report.analysisData.firstInputDelay < 300 ? '⚠️ Needs Improvement' : '❌ Poor'}
                      </div>
                    </div>
                  )}

                  {report.analysisData.totalBlockingTime && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Total Blocking Time</h4>
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {report.analysisData.totalBlockingTime.toFixed(0)}ms
                      </div>
                      <div className="text-xs text-gray-600">
                        {report.analysisData.totalBlockingTime < 200 ? '✅ Good' : 
                         report.analysisData.totalBlockingTime < 600 ? '⚠️ Needs Improvement' : '❌ Poor'}
                      </div>
                    </div>
                  )}

                  {report.analysisData.speedIndex && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Speed Index</h4>
                      <div className="text-2xl font-bold text-indigo-600 mb-1">
                        {(report.analysisData.speedIndex / 1000).toFixed(2)}s
                      </div>
                      <div className="text-xs text-gray-600">
                        {report.analysisData.speedIndex < 3400 ? '✅ Good' : 
                         report.analysisData.speedIndex < 5800 ? '⚠️ Needs Improvement' : '❌ Poor'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Optimization Features */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Optimization Features</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-800">Green Hosting</h4>
                    <p className="text-sm text-gray-600">Renewable energy powered</p>
                  </div>
                  {getStatusIcon(report.analysisData.greenHosting)}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-800">Compression</h4>
                    <p className="text-sm text-gray-600">Gzip/Brotli enabled</p>
                  </div>
                  {getStatusIcon(report.analysisData.compressionEnabled)}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-800">CDN</h4>
                    <p className="text-sm text-gray-600">Content delivery network</p>
                  </div>
                  {getStatusIcon(report.analysisData.cdnEnabled)}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Recommendations</h3>
              
              {report.analysisMethod === 'simulated' && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-yellow-800">Simulated Analysis</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        This analysis uses simulated data because the website couldn't be accessed directly. 
                        For accurate results, ensure the website allows external analysis or try a different URL.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {report.analysisMethod === 'pagespeed' && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">Enhanced Analysis</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        This analysis uses Google PageSpeed Insights API combined with CO2.js for accurate carbon footprint calculations and comprehensive sustainability metrics.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <ul className="space-y-4">
                {report.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700 leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500">
          <p>Built with Next.js • Promoting sustainable web development</p>
        </footer>
      </div>
    </div>
  );
}
