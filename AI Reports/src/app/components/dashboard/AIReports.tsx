import { useState } from 'react';
import { Send, Sparkles, Loader2, CheckCircle, Download, Save, RefreshCw, TrendingUp, AlertCircle, Lightbulb, Database, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  status?: 'analyzing' | 'planning' | 'etl' | 'generating' | 'complete';
}

export function AIReports() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Olá! Sou seu assistente de análise de supply chain. Descreva o relatório que você deseja criar e eu vou construí-lo para você.',
      timestamp: new Date(),
      status: 'complete'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'analyzing' | 'planning' | 'etl' | 'generating' | 'complete' | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Mock data for report preview
  const mockChartData = [
    { month: 'Jan', inventory: 2400, sales: 2800 },
    { month: 'Feb', inventory: 2210, sales: 2900 },
    { month: 'Mar', inventory: 2290, sales: 3100 },
    { month: 'Apr', inventory: 2000, sales: 3000 },
    { month: 'May', inventory: 2181, sales: 3200 },
    { month: 'Jun', inventory: 2500, sales: 3400 },
  ];

  const mockBarData = [
    { country: 'Germany', value: 4000 },
    { country: 'France', value: 3000 },
    { country: 'Italy', value: 2800 },
    { country: 'Spain', value: 2400 },
    { country: 'Netherlands', value: 1800 },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate AI processing stages
    const stages = [
      { status: 'analyzing' as const, message: 'Analisando seu pedido...', duration: 1500 },
      { status: 'planning' as const, message: 'Planejando métricas e KPIs necessários...', duration: 2000 },
      { status: 'etl' as const, message: 'Executando ETL e processando dados...', duration: 2500 },
      { status: 'generating' as const, message: 'Gerando visualizações e insights...', duration: 2000 },
      { status: 'complete' as const, message: 'Relatório concluído! Analisei os dados e identifiquei os principais insights.', duration: 0 },
    ];

    for (const stage of stages) {
      setCurrentStatus(stage.status);
      
      const aiMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'ai',
        content: stage.message,
        timestamp: new Date(),
        status: stage.status,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (stage.duration > 0) {
        await new Promise(resolve => setTimeout(resolve, stage.duration));
      }
    }

    setIsProcessing(false);
    setCurrentStatus('complete');
    setReportGenerated(true);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'analyzing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      case 'planning':
        return <Loader2 className="w-4 h-4 animate-spin text-purple-600" />;
      case 'etl':
        return <Database className="w-4 h-4 text-orange-600" />;
      case 'generating':
        return <Loader2 className="w-4 h-4 animate-spin text-green-600" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'analyzing':
        return 'bg-blue-50 border-blue-200';
      case 'planning':
        return 'bg-purple-50 border-purple-200';
      case 'etl':
        return 'bg-orange-50 border-orange-200';
      case 'generating':
        return 'bg-green-50 border-green-200';
      case 'complete':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Reports</h1>
            <p className="text-gray-600">Create custom supply chain reports with AI assistance</p>
          </div>
        </div>
      </div>

      {/* Main Layout: Chat + Preview */}
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Left Column: AI Copilot Chat */}
        <div className="col-span-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Copilot</h3>
                <p className="text-xs text-gray-500">Supply Chain Analyst</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : `border ${getStatusColor(message.status)}`
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(message.status)}
                      <span className="text-xs font-medium text-gray-600">
                        {message.status === 'analyzing' && 'Analyzing...'}
                        {message.status === 'planning' && 'Planning...'}
                        {message.status === 'etl' && 'Processing Data...'}
                        {message.status === 'generating' && 'Generating...'}
                        {message.status === 'complete' && 'Complete'}
                        {!message.status && 'AI Assistant'}
                      </span>
                    </div>
                  )}
                  <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                    {message.content}
                  </p>
                  <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="px-6 py-4 border-t border-gray-200">
            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Try these prompts:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setInputValue("Analyze inventory turnover by country for the last 90 days")}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100 transition-colors"
                  >
                    Inventory Analysis
                  </button>
                  <button
                    onClick={() => setInputValue("Show supply chain risks in Southern Europe")}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs hover:bg-purple-100 transition-colors"
                  >
                    Risk Analysis
                  </button>
                  <button
                    onClick={() => setInputValue("Compare stock levels vs sales performance by DC")}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs hover:bg-green-100 transition-colors"
                  >
                    Performance Report
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Descreva o relatório que você deseja criar..."
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={isProcessing || !inputValue.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Report Preview & Insights */}
        <div className="col-span-2 flex flex-col gap-6 overflow-y-auto">
          {/* Report Preview / Builder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Report Preview</h3>
              </div>

              {reportGenerated && (
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refine
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
              )}
            </div>

            {!reportGenerated ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Report Yet</h4>
                <p className="text-gray-600 max-w-md mx-auto">
                  Start a conversation with the AI Copilot to create your custom supply chain report
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-700 mb-1">Total Inventory</p>
                    <p className="text-2xl font-bold text-blue-900">€2.5M</p>
                    <p className="text-xs text-blue-600 mt-1">↑ 12.5% vs last month</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-green-700 mb-1">Turnover Rate</p>
                    <p className="text-2xl font-bold text-green-900">8.6x</p>
                    <p className="text-xs text-green-600 mt-1">↑ 5.2% vs target</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-purple-700 mb-1">Fill Rate</p>
                    <p className="text-2xl font-bold text-purple-900">94.3%</p>
                    <p className="text-xs text-purple-600 mt-1">↓ 1.2% vs last month</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Inventory vs Sales Trend</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Line type="monotone" dataKey="inventory" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Stock by Country</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={mockBarData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="country" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Data Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900">Dataset Preview</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Stock Value</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Turnover</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">DOH</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4">Germany</td>
                          <td className="text-right py-3 px-4">€850K</td>
                          <td className="text-right py-3 px-4">9.2x</td>
                          <td className="text-right py-3 px-4">39 days</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4">France</td>
                          <td className="text-right py-3 px-4">€720K</td>
                          <td className="text-right py-3 px-4">8.5x</td>
                          <td className="text-right py-3 px-4">43 days</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4">Italy</td>
                          <td className="text-right py-3 px-4">€580K</td>
                          <td className="text-right py-3 px-4">7.8x</td>
                          <td className="text-right py-3 px-4">47 days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Insights Panel */}
          {reportGenerated && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
              </div>

              <div className="space-y-4">
                {/* Executive Summary */}
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Executive Summary</h4>
                      <p className="text-sm text-gray-700">
                        Inventory levels have increased 12.5% month-over-month, primarily driven by proactive stocking in Germany and France. 
                        Overall turnover rate of 8.6x remains above target, indicating healthy stock movement.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Operational Alerts */}
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Operational Alerts</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Italy showing slower turnover (7.8x) - consider redistribution</li>
                        <li>• Fill rate decreased by 1.2% - investigate demand patterns</li>
                        <li>• Spain DOH approaching upper threshold at 52 days</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Recommendations</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>✓ Transfer 15% of Italian stock to high-demand German DCs</li>
                        <li>✓ Optimize safety stock levels in Spain to reduce DOH</li>
                        <li>✓ Increase replenishment frequency for top-selling SKUs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}