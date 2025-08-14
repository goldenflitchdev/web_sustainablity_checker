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

    setIsLoading(true);
    setError('');
    setReport(null);

    try {
      const response = await fetch('/api/ws-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: { url } }),
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
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
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
