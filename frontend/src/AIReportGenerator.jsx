import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

const AIReportGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportHistory, setReportHistory] = useState([]);

  // Sample data structures based on the database schema
  const sampleData = {
    totalSpend: 515873620.03,
    totalVendors: 2718,
    totalTransactions: 72853,
    topVendors: [
      { name: 'Acme Manufacturing', spend: 45230000, risk: 'Low', performance: 92 },
      { name: 'Global Tech Solutions', spend: 38750000, risk: 'Medium', performance: 87 },
      { name: 'Premium Services Inc', spend: 32100000, risk: 'Low', performance: 95 },
      { name: 'Industrial Supply Co', spend: 28900000, risk: 'High', performance: 78 },
      { name: 'Advanced Materials Ltd', spend: 25600000, risk: 'Medium', performance: 89 }
    ],
    riskDistribution: [
      { name: 'Low Risk', value: 45, count: 1223 },
      { name: 'Medium Risk', value: 35, count: 952 },
      { name: 'High Risk', value: 20, count: 543 }
    ],
    spendByCategory: [
      { category: 'Manufacturing', amount: 156000000, percentage: 30.2 },
      { category: 'Technology', amount: 123000000, percentage: 23.8 },
      { category: 'Services', amount: 98000000, percentage: 19.0 },
      { category: 'Materials', amount: 87000000, percentage: 16.9 },
      { category: 'Logistics', amount: 52000000, percentage: 10.1 }
    ],
    monthlyTrends: [
      { month: 'Jan', spend: 42000000, contracts: 156 },
      { month: 'Feb', spend: 38000000, contracts: 142 },
      { month: 'Mar', spend: 45000000, contracts: 167 },
      { month: 'Apr', spend: 41000000, contracts: 153 },
      { month: 'May', spend: 43000000, contracts: 159 },
      { month: 'Jun', spend: 47000000, contracts: 171 }
    ]
  };

  const testPrompts = [
    "Hi I'm the Head of Manufacturing, create a consolidation report",
    "CFO needs supplier risk assessment with financial impact",
    "Executive summary of supplier performance for board meeting",
    "Procurement manager wants detailed spend analytics"
  ];

  const parsePrompt = (inputPrompt) => {
    const prompt = inputPrompt.toLowerCase();
    
    // Role detection
    let role = 'general';
    let department = 'general';
    let reportType = 'general';
    
    if (prompt.includes('head of manufacturing') || prompt.includes('manufacturing')) {
      role = 'manufacturing_head';
      department = 'manufacturing';
    } else if (prompt.includes('cfo') || prompt.includes('chief financial officer')) {
      role = 'cfo';
      department = 'finance';
    } else if (prompt.includes('executive') || prompt.includes('board')) {
      role = 'executive';
      department = 'executive';
    } else if (prompt.includes('procurement manager') || prompt.includes('procurement')) {
      role = 'procurement_manager';
      department = 'procurement';
    }
    
    // Report type detection
    if (prompt.includes('consolidation')) {
      reportType = 'consolidation';
    } else if (prompt.includes('risk assessment')) {
      reportType = 'risk_assessment';
    } else if (prompt.includes('executive summary') || prompt.includes('board meeting')) {
      reportType = 'executive_summary';
    } else if (prompt.includes('spend analytics')) {
      reportType = 'spend_analytics';
    }
    
    return { role, department, reportType };
  };

  const generateReport = async (parsedPrompt) => {
    const { role, department, reportType } = parsedPrompt;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    switch (reportType) {
      case 'consolidation':
        return generateConsolidationReport();
      case 'risk_assessment':
        return generateRiskAssessmentReport();
      case 'executive_summary':
        return generateExecutiveSummaryReport();
      case 'spend_analytics':
        return generateSpendAnalyticsReport();
      default:
        return generateGeneralReport();
    }
  };

  const generateConsolidationReport = () => ({
    title: 'Manufacturing Supplier Consolidation Report',
    role: 'Head of Manufacturing',
    timestamp: new Date().toLocaleString(),
    sections: [
      {
        title: 'Executive Summary',
        content: `Analysis of our manufacturing supplier base reveals significant consolidation opportunities. Currently managing ${sampleData.totalVendors.toLocaleString()} suppliers with potential to reduce by 35% while maintaining quality and reliability.`
      },
      {
        title: 'Key Findings',
        content: [
          `Total manufacturing spend: $${(sampleData.totalSpend * 0.302).toLocaleString()}`,
          'Top 5 suppliers represent 65% of manufacturing spend',
          '127 suppliers have overlapping capabilities',
          'Potential cost savings: $8.2M annually through consolidation'
        ]
      },
      {
        title: 'Recommended Actions',
        content: [
          'Consolidate similar suppliers in materials category',
          'Negotiate volume discounts with top performers',
          'Implement preferred supplier program',
          'Phase out underperforming suppliers over 6 months'
        ]
      }
    ],
    charts: [
      {
        type: 'bar',
        title: 'Top Manufacturing Suppliers by Spend',
        data: sampleData.topVendors.slice(0, 3)
      }
    ]
  });

  const generateRiskAssessmentReport = () => ({
    title: 'Supplier Risk Assessment with Financial Impact',
    role: 'Chief Financial Officer',
    timestamp: new Date().toLocaleString(),
    sections: [
      {
        title: 'Risk Overview',
        content: `Comprehensive risk analysis of our supplier portfolio reveals $${(sampleData.totalSpend * 0.20).toLocaleString()} in high-risk exposure requiring immediate attention.`
      },
      {
        title: 'Financial Impact Analysis',
        content: [
          `High-risk suppliers: ${sampleData.riskDistribution[2].count} suppliers ($${(sampleData.totalSpend * 0.20).toLocaleString()})`,
          `Medium-risk suppliers: ${sampleData.riskDistribution[1].count} suppliers ($${(sampleData.totalSpend * 0.35).toLocaleString()})`,
          `Potential financial exposure: $${(sampleData.totalSpend * 0.15).toLocaleString()}`,
          'Recommended contingency fund: $12.5M'
        ]
      },
      {
        title: 'Risk Mitigation Strategy',
        content: [
          'Diversify supplier base in high-risk categories',
          'Implement enhanced financial monitoring',
          'Establish backup suppliers for critical components',
          'Review and update contract terms for risk protection'
        ]
      }
    ],
    charts: [
      {
        type: 'pie',
        title: 'Supplier Risk Distribution',
        data: sampleData.riskDistribution
      }
    ]
  });

  const generateExecutiveSummaryReport = () => ({
    title: 'Supplier Performance Executive Summary',
    role: 'Executive Leadership',
    timestamp: new Date().toLocaleString(),
    sections: [
      {
        title: 'Strategic Overview',
        content: `Our supplier ecosystem spans ${sampleData.totalVendors.toLocaleString()} vendors managing $${(sampleData.totalSpend / 1000000).toFixed(0)}M in annual spend. Overall supplier performance remains strong with 87% meeting or exceeding expectations.`
      },
      {
        title: 'Key Performance Indicators',
        content: [
          `Total supplier spend: $${(sampleData.totalSpend / 1000000).toFixed(0)}M`,
          `Active suppliers: ${sampleData.totalVendors.toLocaleString()}`,
          'Average supplier performance score: 87%',
          'On-time delivery rate: 94.2%',
          'Quality compliance: 96.8%'
        ]
      },
      {
        title: 'Strategic Recommendations',
        content: [
          'Strengthen partnerships with top-tier suppliers',
          'Implement supplier innovation programs',
          'Expand supplier diversity initiatives',
          'Enhance digital procurement capabilities'
        ]
      }
    ],
    charts: [
      {
        type: 'line',
        title: 'Monthly Spend Trends',
        data: sampleData.monthlyTrends
      }
    ]
  });

  const generateSpendAnalyticsReport = () => ({
    title: 'Detailed Supplier Spend Analytics',
    role: 'Procurement Manager',
    timestamp: new Date().toLocaleString(),
    sections: [
      {
        title: 'Spend Analysis Overview',
        content: `Detailed analysis of $${(sampleData.totalSpend / 1000000).toFixed(0)}M in supplier spend across ${sampleData.spendByCategory.length} major categories. Manufacturing leads at ${sampleData.spendByCategory[0].percentage}% of total spend.`
      },
      {
        title: 'Category Breakdown',
        content: sampleData.spendByCategory.map(cat => 
          `${cat.category}: $${(cat.amount / 1000000).toFixed(1)}M (${cat.percentage}%)`
        )
      },
      {
        title: 'Optimization Opportunities',
        content: [
          'Technology category shows 15% overspend vs budget',
          'Services category has 23% single-source dependencies',
          'Materials pricing varies 18% across similar suppliers',
          'Logistics costs increased 8% YoY - review contracts'
        ]
      }
    ],
    charts: [
      {
        type: 'bar',
        title: 'Spend by Category',
        data: sampleData.spendByCategory
      }
    ]
  });

  const generateGeneralReport = () => ({
    title: 'General Supplier Report',
    role: 'General User',
    timestamp: new Date().toLocaleString(),
    sections: [
      {
        title: 'Supplier Overview',
        content: `Overview of supplier data including ${sampleData.totalVendors.toLocaleString()} vendors and $${(sampleData.totalSpend / 1000000).toFixed(0)}M in total spend.`
      }
    ],
    charts: []
  });

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    const parsedPrompt = parsePrompt(prompt);
    const generatedReport = await generateReport(parsedPrompt);
    
    setReport(generatedReport);
    setReportHistory(prev => [generatedReport, ...prev.slice(0, 4)]);
    setLoading(false);
  };

  const loadTestPrompt = (testPrompt) => {
    setPrompt(testPrompt);
  };

  const renderChart = (chart) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
    
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'Spend']} />
              <Bar dataKey="spend" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'Spend']} />
              <Line type="monotone" dataKey="spend" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Supplier Report Generator PoC
          </h1>
          <p className="text-gray-600">
            Generate intelligent supplier reports based on natural language prompts
          </p>
        </header>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your report request:
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="e.g., Hi I'm the Head of Manufacturing, create a consolidation report"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating Report...' : 'Generate Report'}
              </button>
            </div>
          </div>

          {/* Test Prompts */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Test Prompts:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {testPrompts.map((testPrompt, index) => (
                <button
                  key={index}
                  onClick={() => loadTestPrompt(testPrompt)}
                  className="text-left p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors"
                >
                  {testPrompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Display */}
        {report && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{report.title}</h2>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-blue-600 font-medium">Role: {report.role}</span>
                <span className="text-sm text-gray-500">Generated: {report.timestamp}</span>
              </div>
            </div>

            {/* Report Sections */}
            <div className="space-y-6">
              {report.sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Charts */}
            {report.charts && report.charts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Visualizations</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {report.charts.map((chart, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">{chart.title}</h4>
                      {renderChart(chart)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Report History */}
        {reportHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
            <div className="space-y-2">
              {reportHistory.map((historyReport, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => setReport(historyReport)}
                >
                  <div>
                    <span className="font-medium text-gray-900">{historyReport.title}</span>
                    <span className="text-sm text-gray-500 ml-2">({historyReport.role})</span>
                  </div>
                  <span className="text-xs text-gray-400">{historyReport.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIReportGenerator;