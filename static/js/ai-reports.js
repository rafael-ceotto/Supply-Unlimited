/**
 * AI Reports Module
 * Manages the AI Copilot chat interface and report generation
 * 
 * This module coordinates:
 * - Chat message handling with AI stages (analyzing → planning → etl → generating → complete)
 * - Real-time status updates
 * - Report preview and data visualization
 * - Integration with Django REST API backend
 */

let chatMessages = [];
let isProcessing = false;
let reportGenerated = false;
let currentSessionId = null;

// Status configuration for AI processing stages
const STATUS_STAGES = {
    analyzing: { 
        label: 'Analisando...', 
        color: 'bg-blue-50 border-blue-200',
        icon: 'loader' 
    },
    planning: { 
        label: 'Planejando...', 
        color: 'bg-purple-50 border-purple-200',
        icon: 'loader' 
    },
    etl: { 
        label: 'Processando dados...', 
        color: 'bg-orange-50 border-orange-200',
        icon: 'database' 
    },
    generating: { 
        label: 'Gerando insights...', 
        color: 'bg-green-50 border-green-200',
        icon: 'loader' 
    },
    complete: { 
        label: 'Completo', 
        color: 'bg-green-50 border-green-200',
        icon: 'check-circle' 
    }
};

// Initialize AI Reports module
function initializeAIReports() {
    const chatContainer = document.getElementById('ai-chat-messages');
    const inputField = document.getElementById('ai-chat-input');
    const sendButton = document.getElementById('ai-send-button');
    
    if (!chatContainer || !inputField || !sendButton) {
        console.warn('AI Reports elements not found');
        return;
    }

    // Initial AI greeting message
    addSystemMessage(
        'Olá! Sou seu assistente de análise de supply chain. Descreva o relatório que você deseja criar e eu vou construí-lo para você.'
    );

    // Event listeners
    sendButton.addEventListener('click', handleSendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isProcessing) {
            handleSendMessage();
        }
    });

    // Show quick prompt suggestions if no messages sent yet
    showQuickPrompts();
    
    // Get CSRF token for API requests
    window.csrfToken = getCookie('csrftoken');
}

/**
 * Add a system message (from AI) to the chat
 */
function addSystemMessage(content, status = 'complete') {
    const message = {
        id: Date.now().toString(),
        type: 'ai',
        content,
        timestamp: new Date(),
        status
    };
    
    chatMessages.push(message);
    renderMessage(message);
}

/**
 * Add a user message to the chat
 */
function addUserMessage(content) {
    const message = {
        id: Date.now().toString(),
        type: 'user',
        content,
        timestamp: new Date()
    };
    
    chatMessages.push(message);
    renderMessage(message);
    scrollChatToBottom();
}

/**
 * Render a single message in the chat
 */
function renderMessage(message) {
    const chatContainer = document.getElementById('ai-chat-messages');
    if (!chatContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`;
    msgDiv.id = `message-${message.id}`;

    const msgContent = document.createElement('div');
    msgContent.className = `max-w-xs rounded-lg px-4 py-3 ${
        message.type === 'user'
            ? 'bg-green-600 text-white'
            : `border ${STATUS_STAGES[message.status]?.color || 'bg-gray-50 border-gray-200'}`
    }`;

    let html = '';
    
    if (message.type === 'ai') {
        const stage = STATUS_STAGES[message.status];
        html += `
            <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-medium text-gray-600">${stage?.label || 'AI Assistant'}</span>
            </div>
        `;
    }

    html += `<p class="text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-800'}">${escapeHtml(message.content)}</p>`;
    html += `<p class="text-xs mt-2 ${message.type === 'user' ? 'text-green-200' : 'text-gray-400'}">
        ${message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
    </p>`;

    msgContent.innerHTML = html;
    msgDiv.appendChild(msgContent);
    chatContainer.appendChild(msgDiv);
    scrollChatToBottom();
}

/**
 * Show quick prompt suggestions
 */
function showQuickPrompts() {
    const promptsContainer = document.getElementById('ai-quick-prompts');
    if (!promptsContainer || chatMessages.length > 1) return;

    promptsContainer.innerHTML = `
        <p class="text-xs text-gray-500 mb-2">Sugestões de prompts:</p>
        <div class="flex flex-wrap gap-2">
            <button class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100 transition-colors" 
                onclick="setQuickPrompt('Analyze inventory turnover by country for the last 90 days')">
                Inventory Analysis
            </button>
            <button class="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs hover:bg-purple-100 transition-colors"
                onclick="setQuickPrompt('Show supply chain risks in Southern Europe')">
                Risk Analysis
            </button>
            <button class="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs hover:bg-green-100 transition-colors"
                onclick="setQuickPrompt('Compare stock levels vs sales performance by DC')">
                Performance Report
            </button>
        </div>
    `;
}

/**
 * Set a quick prompt in the input field
 */
function setQuickPrompt(prompt) {
    const inputField = document.getElementById('ai-chat-input');
    if (inputField) {
        inputField.value = prompt;
        inputField.focus();
    }
}

/**
 * Handle message sending
 */
async function handleSendMessage() {
    const inputField = document.getElementById('ai-chat-input');
    const content = inputField.value.trim();

    if (!content || isProcessing) return;

    // Add user message
    addUserMessage(content);
    inputField.value = '';
    isProcessing = true;

    // Disable input during processing
    inputField.disabled = true;
    document.getElementById('ai-send-button').disabled = true;

    try {
        // Mostrar estágio "analisando"
        addSystemMessage('Analisando seu pedido...', 'analyzing');

        // Fazer chamada à API Django
        const response = await fetch('/api/ai-reports/messages/send/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.csrfToken || getCookie('csrftoken')
            },
            body: JSON.stringify({
                message: content,
                session_id: currentSessionId || null
            })
        });

        if (!response.ok) {
            const error = await response.json();
            addSystemMessage(`Erro: ${error.error || 'Erro ao processar requisição'}`, 'complete');
            throw new Error(error.error || 'Erro na API');
        }

        const data = await response.json();
        
        // Atualizar session ID para próximas mensagens
        currentSessionId = data.session_id;

        // Atualizar mensagens de progresso baseado nos estágios recebidos
        if (data.stage_progress && data.stage_progress.length > 0) {
            // Limpar mensagem de "analisando"
            const aiMessages = document.querySelectorAll('[id^="message-"]');
            const lastAiMsg = aiMessages[aiMessages.length - 1];
            if (lastAiMsg) lastAiMsg.remove();
            chatMessages = chatMessages.filter(m => m.type !== 'ai' || m.status !== 'analyzing');

            // Mostrar cada estágio
            for (const stage of data.stage_progress) {
                const stageName = stage.stage.toUpperCase();
                const stageLabel = {
                    'INTERPRETING': 'Interpretando requisição...',
                    'PLANNING': 'Planejando análise...',
                    'DATA_COLLECTION': 'Coletando dados...',
                    'ANALYSIS': 'Analisando dados...',
                    'GENERATING': 'Gerando insights...'
                }[stage.stage] || `${stageName}...`;

                addSystemMessage(stageLabel, stage.stage.toLowerCase());
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // Adicionar mensagem final com título do relatório
        addSystemMessage(`✓ ${data.report_title}`, 'complete');

        // Gerar preview do relatório
        if (data.report_data) {
            reportGenerated = true;
            showReportPreview(data.report_data, data.insights);
            showAIInsights(data.insights, data.recommendations);
        }

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        addSystemMessage('Desculpe, houve um erro ao processar sua requisição. Tente novamente.', 'complete');
    } finally {
        // Hide quick prompts after first message
        const promptsContainer = document.getElementById('ai-quick-prompts');
        if (promptsContainer) {
            promptsContainer.style.display = 'none';
        }

        // Re-enable input
        isProcessing = false;
        inputField.disabled = false;
        document.getElementById('ai-send-button').disabled = false;
        inputField.focus();
    }
}

/**
 * Show report preview with charts and data
 */
function showReportPreview(reportData = null, insights = null) {
    const previewContainer = document.getElementById('ai-report-preview');
    if (!previewContainer) return;

    // Usar dados da API ou dados de fallback
    const data = reportData || generateDefaultReportData();
    const kpis = data.kpis || {};

    let kpiHtml = '';
    let kpiCount = 0;
    for (const [key, value] of Object.entries(kpis)) {
        if (kpiCount >= 3) break;
        const colors = ['from-blue-50 to-blue-100 border-blue-200', 'from-green-50 to-green-100 border-green-200', 'from-purple-50 to-purple-100 border-purple-200'];
        const textColors = ['text-blue-700', 'text-green-700', 'text-purple-700'];
        const fontColors = ['text-blue-900', 'text-green-900', 'text-purple-900'];
        
        kpiHtml += `
            <div class="bg-gradient-to-br ${colors[kpiCount]} rounded-lg p-4 border">
                <p class="text-sm ${textColors[kpiCount]} mb-1">${key.replace(/_/g, ' ')}</p>
                <p class="text-2xl font-bold ${fontColors[kpiCount]}">${value}</p>
            </div>
        `;
        kpiCount++;
    }

    const html = `
        <div class="space-y-6">
            <!-- KPIs -->
            <div class="grid grid-cols-3 gap-4">
                ${kpiHtml || `
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <p class="text-sm text-blue-700 mb-1">Total Inventory</p>
                        <p class="text-2xl font-bold text-blue-900">€2.5M</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <p class="text-sm text-green-700 mb-1">Turnover Rate</p>
                        <p class="text-2xl font-bold text-green-900">8.6x</p>
                    </div>
                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <p class="text-sm text-purple-700 mb-1">Fill Rate</p>
                        <p class="text-2xl font-bold text-purple-900">94.3%</p>
                    </div>
                `}
            </div>

            <!-- Data Table -->
            <div class="border border-gray-200 rounded-lg overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 class="text-sm font-semibold text-gray-900">Dataset Preview</h4>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                                <th class="text-right py-3 px-4 font-semibold text-gray-700">Stock Value</th>
                                <th class="text-right py-3 px-4 font-semibold text-gray-700">Turnover</th>
                                <th class="text-right py-3 px-4 font-semibold text-gray-700">DOH</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-gray-100">
                                <td class="py-3 px-4">Germany</td>
                                <td class="text-right py-3 px-4">€850K</td>
                                <td class="text-right py-3 px-4">9.2x</td>
                                <td class="text-right py-3 px-4">39 days</td>
                            </tr>
                            <tr class="border-b border-gray-100">
                                <td class="py-3 px-4">France</td>
                                <td class="text-right py-3 px-4">€720K</td>
                                <td class="text-right py-3 px-4">8.5x</td>
                                <td class="text-right py-3 px-4">43 days</td>
                            </tr>
                            <tr class="border-b border-gray-100">
                                <td class="py-3 px-4">Italy</td>
                                <td class="text-right py-3 px-4">€580K</td>
                                <td class="text-right py-3 px-4">7.8x</td>
                                <td class="text-right py-3 px-4">47 days</td>
                            </tr>
                            <tr class="border-b border-gray-100">
                                <td class="py-3 px-4">Spain</td>
                                <td class="text-right py-3 px-4">€350K</td>
                                <td class="text-right py-3 px-4">6.9x</td>
                                <td class="text-right py-3 px-4">52 days</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    previewContainer.innerHTML = html;
    previewContainer.parentElement.style.display = 'block';
}

/**
 * Show AI insights and recommendations
 */
function showAIInsights(insights = null, recommendations = null) {
    const insightsContainer = document.getElementById('ai-insights');
    if (!insightsContainer) return;

    const defaultInsights = [
        "Inventário distribuído principalmente na Alemanha (33%) e França (27%)",
        "Taxa de rotatividade anual de 8.6x indica bom fluxo de estoque",
        "Utilização de armazém em 78% - espaço adequado para crescimento"
    ];

    const defaultRecommendations = [
        "Considerar redistribuição de estoque para Itália e Espanha para melhorar cobertura local",
        "Taxa de turnover de 8.6x é saudável - manter estratégia atual de reabastecimento",
        "Aproveitar 22% de capacidade livre para planejar crescimento de 15-20%"
    ];

    const finalInsights = insights || defaultInsights;
    const finalRecommendations = recommendations || defaultRecommendations;

    let insightsHtml = '';
    if (finalInsights && finalInsights.length > 0) {
        insightsHtml = `
            <div class="bg-white rounded-lg p-4 border border-blue-200">
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i data-lucide="trending-up" style="width: 16px; height: 16px; color: #2563eb;"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Key Insights</h4>
                        <ul class="text-sm text-gray-700 space-y-1">
                            ${finalInsights.map(insight => `<li>• ${escapeHtml(insight)}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    let recommendationsHtml = '';
    if (finalRecommendations && finalRecommendations.length > 0) {
        recommendationsHtml = `
            <div class="bg-white rounded-lg p-4 border border-green-200">
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i data-lucide="check-circle" style="width: 16px; height: 16px; color: #10b981;"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-2 text-sm">Recommendations</h4>
                        <ul class="text-sm text-gray-700 space-y-1">
                            ${finalRecommendations.map(rec => `<li>✓ ${escapeHtml(rec)}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    const html = `
        <div class="space-y-4">
            ${insightsHtml}
            ${recommendationsHtml}
        </div>
    `;

    insightsContainer.innerHTML = html;
    insightsContainer.style.display = 'block';
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Scroll chat to bottom
 */
function scrollChatToBottom() {
    const chatContainer = document.getElementById('ai-chat-messages');
    if (chatContainer) {
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 0);
    }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Get CSRF token from cookies
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * Generate default report data for fallback
 */
function generateDefaultReportData() {
    return {
        kpis: {
            'Total Inventory': '€2.5M',
            'Turnover Rate': '8.6x',
            'Fill Rate': '94.3%'
        },
        charts: []
    };
}

/**
 * Set a quick prompt in the input field
 */
function setQuickPrompt(prompt) {
    const inputField = document.getElementById('ai-chat-input');
    if (inputField) {
        inputField.value = prompt;
        inputField.focus();
        // Optionally auto-submit after a short delay
        setTimeout(() => {
            if (!isProcessing) {
                handleSendMessage();
            }
        }, 100);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAIReports);
