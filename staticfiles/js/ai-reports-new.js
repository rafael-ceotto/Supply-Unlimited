/**
 * AI Reports Module - Enhanced
 * Manages the 3-panel layout: Sessions | Chat | Preview
 * 
 * Features:
 * - Chat session management
 * - Real-time message streaming
 * - Report generation and preview
 * - Tab navigation for insights & details
 */

let chatSessions = [];
let currentSessionId = null;
let chatMessages = [];
let isProcessing = false;
let activeAgents = [];
let selectedAgentId = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAIReports);

/**
 * Initialize AI Reports module
 */
function initializeAIReports() {
    console.log('[AI Reports] Initializing...');
    
    // Get all elements
    const sendBtn = document.getElementById('ai-send-button');
    const inputField = document.getElementById('ai-chat-input');
    const newSessionBtn = document.getElementById('ai-new-session-btn');
    const clearSessionsBtn = document.getElementById('ai-clear-sessions-btn');
    const tabButtons = document.querySelectorAll('.ai-preview-tab');
    
    if (!sendBtn || !inputField) {
        console.warn('[AI Reports] Required elements not found');
        return;
    }
    
    // Event Listeners: Chat Input
    sendBtn.addEventListener('click', handleSendMessage);
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isProcessing) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Auto-resize textarea
    inputField.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        // Enable/disable send button based on input
        sendBtn.disabled = !this.value.trim();
    });
    
    // Event Listeners: Sessions
    if (newSessionBtn) {
        newSessionBtn.addEventListener('click', createNewSession);
    }
    if (clearSessionsBtn) {
        clearSessionsBtn.addEventListener('click', clearAllSessions);
    }
    
    // Event Listeners: Tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });
    
    // Load agents and sessions from API
    loadAvailableAgents();
    loadSessions();
    
    console.log('[AI Reports] Initialized successfully');
}

/**
 * Load available agents from API
 */
async function loadAvailableAgents() {
    try {
        console.log('[AI Reports] Carregando agentes disponíveis...');
        
        const response = await fetch('/api/ai-reports/agent-config/active-agents/', {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        
        if (!response.ok) {
            console.error('[AI Reports] Erro ao carregar agentes:', response.status);
            return;
        }
        
        activeAgents = await response.json();
        console.log(`[AI Reports] ${activeAgents.length} agentes carregados`);
        
        // Populate agent selector with visual cards
        const agentsContainer = document.getElementById('ai-agents-list');
        if (!agentsContainer) {
            console.warn('[AI Reports] Agent container not found');
            return;
        }
        
        if (activeAgents.length > 0) {
            agentsContainer.innerHTML = ''; // Clear loading state
            
            activeAgents.forEach((agent, index) => {
                const card = document.createElement('div');
                card.className = `ai-agent-card ${index === 0 ? 'active' : ''}`;
                card.textContent = agent.name;
                card.dataset.agentId = agent.id;
                
                card.addEventListener('click', () => {
                    // Remove active from all cards
                    document.querySelectorAll('.ai-agent-card').forEach(c => {
                        c.classList.remove('active');
                    });
                    // Add active to clicked card
                    card.classList.add('active');
                    // Update selected agent
                    selectedAgentId = agent.id;
                    updateAgentInfo();
                });
                
                agentsContainer.appendChild(card);
            });
            
            // Set first agent as selected
            selectedAgentId = activeAgents[0].id;
            updateAgentInfo();
            console.log(`[AI Reports] Agente padrão selecionado: ${activeAgents[0].name}`);
        } else {
            console.warn('[AI Reports] Nenhum agente ativo encontrado');
            agentsContainer.innerHTML = '<div class="ai-agent-loading">Nenhum agente disponível</div>';
        }
    } catch (error) {
        console.error('[AI Reports] Erro ao carregar agentes:', error);
    }
}

/**
 * Update agent info display
 */
function updateAgentInfo() {
    const agent = activeAgents.find(a => a.id === selectedAgentId);
    if (agent) {
        // Update card active state
        document.querySelectorAll('.ai-agent-card').forEach(card => {
            if (parseInt(card.dataset.agentId) === selectedAgentId) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
}

/**
 * Handle sending a message
 */
async function handleSendMessage() {
    const inputField = document.getElementById('ai-chat-input');
    const message = inputField.value.trim();
    
    if (!message || isProcessing) return;
    
    // Create new session if needed
    if (!currentSessionId) {
        currentSessionId = await createNewSession();
        if (!currentSessionId) return;
    }
    
    // Add user message to chat
    addMessageToChat('user', message);
    inputField.value = '';
    inputField.style.height = 'auto';
    
    // Disable input while processing
    isProcessing = true;
    document.getElementById('ai-send-button').disabled = true;
    
    // Show processing status
    showProcessingStatus();
    
    try {
        // Update session title if it's the first message (for both quick prompts and manual text)
        const session = chatSessions.find(s => s.id === currentSessionId);
        if (session && (!session.title || session.title === 'Untitled' || session.title.trim() === '')) {
            const titleText = message.substring(0, 60).trim();
            if (titleText) {
                await updateSessionTitle(currentSessionId, titleText);
            }
        }
        
        // Send to API
        const response = await fetch('/api/ai-reports/messages/send/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                message: message,
                session_id: currentSessionId,
                agent_id: selectedAgentId
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Get current agent info from selected agent
        const agent = activeAgents.find(a => a.id === selectedAgentId);
        
        // Add AI response with agent info
        addMessageToChat('ai', data.report_title || 'Report generated', false, agent);
        
        // Show report preview
        displayReportPreview(data);
        
        // Reload sessions to sync data
        await loadSessions();
        
    } catch (error) {
        console.error('[AI Reports] Error:', error);
        addMessageToChat('ai', `Error: ${error.message}`);
    } finally {
        isProcessing = false;
        document.getElementById('ai-send-button').disabled = false;
        hideProcessingStatus();
        
        // Show quick prompts again
        showQuickPrompts();
    }
}

/**
 * Add message to chat
 */
function addMessageToChat(type, content, isHtml = false, agentInfo = null) {
    const chatContainer = document.getElementById('ai-chat-messages');
    
    // Remove greeting if this is the first real message
    const greeting = chatContainer.querySelector('.ai-chat-greeting');
    if (greeting && type === 'user') {
        greeting.remove();
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = `ai-chat-message ${type}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = `ai-message-content ${type}`;
    
    if (isHtml) {
        contentDiv.innerHTML = content;
    } else {
        contentDiv.textContent = content;
    }
    
    // Add agent badge for AI responses
    if (type === 'ai' && agentInfo) {
        const agentBadge = document.createElement('div');
        agentBadge.className = 'ai-agent-badge';
        agentBadge.innerHTML = `<small>🤖 ${agentInfo.name}</small>`;
        contentDiv.insertBefore(agentBadge, contentDiv.firstChild);
    }
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'ai-message-time';
    timeDiv.textContent = formatTime(new Date());
    
    contentDiv.appendChild(timeDiv);
    messageEl.appendChild(contentDiv);
    chatContainer.appendChild(messageEl);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Display report in preview panel
 */
function displayReportPreview(reportData) {
    // Build report HTML to display in chat
    let html = `<div class="ai-report-preview" style="max-width: 100%; font-size: 13px;">`;
    
    // Title
    if (reportData.report_title) {
        html += `<h3 style="font-size: 16px; color: #111827; margin: 0 0 12px 0; font-weight: 600;">📊 ${escapeHtml(reportData.report_title)}</h3>`;
    }
    
    // Main report data
    if (reportData.report_data) {
        const data = reportData.report_data;
        
        // Executive Summary
        if (data.executive_summary) {
            html += `<div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 10px; border-radius: 4px; margin-bottom: 12px;">
                <p style="margin: 0; font-size: 12px; color: #065f46;"><strong>Summary:</strong> ${escapeHtml(data.executive_summary.overview || '')}</p>
            </div>`;
        }
        
        // KPI Cards
        if (data.kpis && Object.keys(data.kpis).length > 0) {
            html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 12px;">';
            for (const [key, value] of Object.entries(data.kpis)) {
                html += `
                    <div style="padding: 8px; background: #f9fafb; border-radius: 6px; border-left: 3px solid #10b981;">
                        <div style="font-size: 11px; color: #6b7280; font-weight: 500;">${escapeHtml(key)}</div>
                        <div style="font-size: 16px; font-weight: 700; color: #111827;">${escapeHtml(String(value))}</div>
                    </div>
                `;
            }
            html += '</div>';
        }
        
        // Charts section
        if (data.charts && data.charts.length > 0) {
            html += `<p style="font-size: 12px; font-weight: 600; color: #111827; margin: 12px 0 8px 0;">📈 Visualizations</p>`;
            for (const chart of data.charts) {
                html += `<div style="background: #f9fafb; padding: 8px; border-radius: 6px; margin-bottom: 8px; font-size: 11px;">
                    <strong>${escapeHtml(chart.title)}</strong> (${escapeHtml(chart.type)})
                </div>`;
            }
        }
        
        // Data Table (compact)
        if (data.data_table && data.data_table.rows && data.data_table.rows.length > 0) {
            html += `<p style="font-size: 12px; font-weight: 600; color: #111827; margin: 12px 0 8px 0;">📋 Data</p>`;
            html += '<table style="width: 100%; font-size: 11px; border-collapse: collapse; margin-bottom: 12px;">';
            
            // Header
            if (data.data_table.columns) {
                html += '<thead style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">';
                for (const col of data.data_table.columns) {
                    html += `<th style="padding: 6px; text-align: left; font-weight: 600; color: #6b7280;">${escapeHtml(col)}</th>`;
                }
                html += '</thead>';
            }
            
            // Body (limit to first 3 rows in chat)
            html += '<tbody>';
            for (let i = 0; i < Math.min(3, data.data_table.rows.length); i++) {
                const row = data.data_table.rows[i];
                html += '<tr style="border-bottom: 1px solid #f3f4f6;">';
                for (const cell of row) {
                    html += `<td style="padding: 6px; color: #374151;">${escapeHtml(String(cell))}</td>`;
                }
                html += '</tr>';
            }
            if (data.data_table.rows.length > 3) {
                html += `<tr><td colspan="100%" style="padding: 6px; text-align: center; color: #9ca3af; font-style: italic;">... and ${data.data_table.rows.length - 3} more rows</td></tr>`;
            }
            html += '</tbody></table>';
        }
        
        // Trends
        if (data.trends && Object.keys(data.trends).length > 0) {
            html += `<p style="font-size: 12px; font-weight: 600; color: #111827; margin: 12px 0 8px 0;">📈 Trends</p>`;
            for (const [metric, trend] of Object.entries(data.trends)) {
                const trendIcon = trend === 'increasing' ? '📈' : trend === 'decreasing' ? '📉' : '➡️';
                html += `<p style="margin: 3px 0; font-size: 11px; color: #374151;"><strong>${escapeHtml(metric)}:</strong> ${trendIcon} ${escapeHtml(trend)}</p>`;
            }
        }
    }
    
    html += '</div>';
    
    // Display report as AI message in chat
    addMessageToChat('ai', html, true);
    
    // Optionally still update the preview panel if it exists (for backward compatibility)
    const reportContent = document.querySelector('#ai-report-tab .ai-report-content');
    if (reportContent) {
        reportContent.innerHTML = html;
    }
}

/**
 * Load sessions from API
 */
async function loadSessions() {
    try {
        const response = await fetch('/api/ai-reports/chat-sessions/', {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        
        if (!response.ok) return;
        
        const sessions = await response.json();
        chatSessions = sessions;
        renderSessionsList();
        
    } catch (error) {
        console.error('[AI Reports] Error loading sessions:', error);
    }
}

/**
 * Render sessions list
 */
function renderSessionsList() {
    const sessionsList = document.getElementById('ai-sessions-list');
    if (!sessionsList) return;
    
    if (chatSessions.length === 0) {
        sessionsList.innerHTML = `
            <div class="ai-empty-sessions">
                <i data-lucide="message-circle" style="width: 24px; height: 24px;"></i>
                <p>No sessions yet</p>
            </div>
        `;
        return;
    }
    
    sessionsList.innerHTML = '';
    for (const session of chatSessions) {
        const itemEl = document.createElement('div');
        itemEl.className = `ai-session-item ${session.id === currentSessionId ? 'active' : ''}`;
        itemEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 8px;">
                <div style="flex: 1; cursor: pointer; min-width: 0;" onclick="loadSession(${session.id})">
                    <div class="ai-session-item-title">${escapeHtml(session.title || 'Untitled')}</div>
                    <div class="ai-session-item-time">${formatDate(new Date(session.created_at))}</div>
                </div>
                <div style="display: flex; gap: 4px; flex-shrink: 0;">
                    <button 
                        style="padding: 4px 6px; font-size: 12px; cursor: pointer; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 4px; color: #6b7280;" 
                        onclick="renameSession(${session.id}, '${escapeHtml(session.title || 'Untitled').replace(/'/g, "\\'")}')"
                        title="Rename session">✏️
                    </button>
                    <button 
                        style="padding: 4px 6px; font-size: 12px; cursor: pointer; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 4px; color: #dc2626;" 
                        onclick="deleteSession(${session.id}, event)"
                        title="Delete session">🗑️
                    </button>
                </div>
            </div>
        `;
        sessionsList.appendChild(itemEl);
    }
    
    // Reinitialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/**
 * Create new session
 */
async function createNewSession() {
    try {
        const response = await fetch('/api/ai-reports/chat-sessions/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({})
        });
        
        if (!response.ok) return null;
        
        const newSession = await response.json();
        currentSessionId = newSession.id;
        
        // Reset chat
        document.getElementById('ai-chat-messages').innerHTML = `
            <div class="ai-chat-greeting">
                <div class="ai-greeting-icon">
                    <i data-lucide="sparkles" style="width: 24px; height: 24px;"></i>
                </div>
                <h4>New Session</h4>
                <p>Ready to help</p>
                <div class="ai-quick-prompts">
                    <button class="ai-quick-prompt-btn" onclick="setQuickPrompt('Analyze inventory turnover by country for the last 90 days')">
                        <i data-lucide="package" style="width: 16px; height: 16px;"></i>
                        <span>Inventory Analysis</span>
                    </button>
                    <button class="ai-quick-prompt-btn" onclick="setQuickPrompt('Show supply chain risks and exceptions')">
                        <i data-lucide="alert-triangle" style="width: 16px; height: 16px;"></i>
                        <span>Risk Analysis</span>
                    </button>
                    <button class="ai-quick-prompt-btn" onclick="setQuickPrompt('Compare supplier performance metrics')">
                        <i data-lucide="trending-up" style="width: 16px; height: 16px;"></i>
                        <span>Supplier Report</span>
                    </button>
                    <button class="ai-quick-prompt-btn" onclick="setQuickPrompt('Analyze OTIF performance by customer')">
                        <i data-lucide="target" style="width: 16px; height: 16px;"></i>
                        <span>OTIF Report</span>
                    </button>
                </div>
            </div>
        `;
        
        // Reload sessions list
        loadSessions();
        
        // Reinitialize icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        return newSession.id;
        
    } catch (error) {
        console.error('[AI Reports] Error creating session:', error);
        return null;
    }
}

/**
 * Load a session
 */
async function loadSession(sessionId) {
    currentSessionId = sessionId;
    
    try {
        const response = await fetch(`/api/ai-reports/chat-sessions/${sessionId}/messages/`, {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        
        if (!response.ok) return;
        
        const messages = await response.json();
        
        // Rebuild chat
        const chatContainer = document.getElementById('ai-chat-messages');
        chatContainer.innerHTML = '';
        
        // If no messages, show greeting with quick prompts
        if (!messages || messages.length === 0) {
            showQuickPrompts();
            renderSessionsList();
            return;
        }
        
        for (const msg of messages) {
            // Check if message has report_data (AI response with report)
            let content = msg.content;
            let isHtml = false;
            
            if (msg.message_type === 'ai' && msg.report_data) {
                // Rebuild report HTML if stored in report_data
                content = buildReportHtml(msg.report_data, msg);
                isHtml = true;
            }
            
            // Pass agent info for AI messages
            const agentInfo = msg.message_type === 'ai' && msg.agent_name ? {
                name: msg.agent_name,
                model: msg.agent_model
            } : null;
            addMessageToChat(msg.message_type, content, isHtml, agentInfo);
        }
        
        // Show quick prompts at the end
        showQuickPrompts();
        
        // Reload sessions to update active state
        renderSessionsList();
        
    } catch (error) {
        console.error('[AI Reports] Error loading session:', error);
    }
}

/**
 * Clear all sessions
 */
async function clearAllSessions() {
    if (!confirm('Delete all sessions?')) return;
    
    try {
        await fetch('/api/ai-reports/chat-sessions/clear-all/', {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        
        chatSessions = [];
        currentSessionId = null;
        renderSessionsList();
        
        // Reset chat
        document.getElementById('ai-chat-messages').innerHTML = `
            <div class="ai-chat-greeting">
                <div class="ai-greeting-icon">
                    <i data-lucide="sparkles" style="width: 24px; height: 24px;"></i>
                </div>
                <h4>Welcome to AI Reports</h4>
                <p>I'm your supply chain analyst. Describe what you need and I'll create a personalized report for you.</p>
            </div>
        `;
        
    } catch (error) {
        console.error('[AI Reports] Error clearing sessions:', error);
    }
}

/**
 * Switch between preview tabs
 */
function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.ai-preview-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('.ai-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`ai-${tabName}-tab`).classList.add('active');
}

/**
 * Show quick prompts section
 */
function showQuickPrompts() {
    const chatContainer = document.getElementById('ai-chat-messages');
    
    // Check if quick prompts already exist
    if (chatContainer.querySelector('.ai-quick-prompts')) {
        return; // Already showing
    }
    
    // Create quick prompts container
    const promptsDiv = document.createElement('div');
    promptsDiv.className = 'ai-chat-greeting';
    promptsDiv.style.marginTop = '20px';
    promptsDiv.innerHTML = `
        <div class="ai-greeting-icon">
            <i data-lucide="sparkles" style="width: 24px; height: 24px;"></i>
        </div>
        <h4>What would you like to analyze?</h4>
        <div class="ai-quick-prompts">
            <button class="ai-quick-prompt-btn" onclick="setQuickPrompt('Analyze inventory turnover by country for the last 90 days')">
                <i data-lucide="package" style="width: 16px; height: 16px;"></i>
                <span>Inventory Analysis</span>
            </button>
            <button class="ai-quick-prompt-btn" onclick="setQuickPrompt('Show supply chain risks and exceptions')">
                <i data-lucide="alert-triangle" style="width: 16px; height: 16px;"></i>
                <span>Risk Analysis</span>
            </button>
            <button class="ai-quick-prompt-btn" onclick="setQuickPrompt('Compare supplier performance metrics')">
                <i data-lucide="trending-up" style="width: 16px; height: 16px;"></i>
                <span>Supplier Report</span>
            </button>
            <button class="ai-quick-prompt-btn" onclick="setQuickPrompt('Analyze OTIF performance by customer')">
                <i data-lucide="target" style="width: 16px; height: 16px;"></i>
                <span>OTIF Report</span>
            </button>
        </div>
    `;
    chatContainer.appendChild(promptsDiv);
    
    // Reinitialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/**
 * Set quick prompt
 */
function setQuickPrompt(prompt) {
    const input = document.getElementById('ai-chat-input');
    input.value = prompt;
    input.focus();
    input.dispatchEvent(new Event('input'));
}

/**
 * Build report HTML from stored report_data
 */
function buildReportHtml(reportData, messageObj) {
    let html = `<div class="ai-report-preview" style="max-width: 100%; font-size: 13px;">`;
    
    if (messageObj.report_title) {
        html += `<h3 style="font-size: 16px; color: #111827; margin: 0 0 12px 0; font-weight: 600;">📊 ${escapeHtml(messageObj.report_title)}</h3>`;
    }
    
    if (reportData) {
        const data = typeof reportData === 'string' ? JSON.parse(reportData) : reportData;
        
        if (data.executive_summary) {
            html += `<div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 10px; border-radius: 4px; margin-bottom: 12px;">
                <p style="margin: 0; font-size: 12px; color: #065f46;"><strong>Summary:</strong> ${escapeHtml(data.executive_summary.overview || '')}</p>
            </div>`;
        }
        
        if (data.kpis && Object.keys(data.kpis).length > 0) {
            html += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">`;
            for (const [key, value] of Object.entries(data.kpis)) {
                html += `<div style="background: #f3f4f6; padding: 8px; border-radius: 4px; border-left: 3px solid #3b82f6;">
                    <div style="font-size: 11px; color: #6b7280;">${escapeHtml(key)}</div>
                    <div style="font-size: 14px; font-weight: 600; color: #1f2937;">${escapeHtml(String(value))}</div>
                </div>`;
            }
            html += `</div>`;
        }
    }
    
    html += `</div>`;
    return html;
}

/**
 * Show processing status
 */
function showProcessingStatus() {
    const status = document.getElementById('ai-processing-status');
    if (!status) return;
    
    status.style.display = 'block';
    status.innerHTML = `
        <div class="ai-status-header">
            <h4>Processing</h4>
        </div>
        <div class="ai-status-stages">
            <div class="ai-status-stage active">
                <span class="ai-status-spinner"></span>
                Interpreting request...
            </div>
            <div class="ai-status-stage pending">Planning analysis...</div>
            <div class="ai-status-stage pending">Collecting data...</div>
            <div class="ai-status-stage pending">Generating report...</div>
        </div>
    `;
}

/**
 * Hide processing status
 */
function hideProcessingStatus() {
    const status = document.getElementById('ai-processing-status');
    if (status) {
        status.style.display = 'none';
    }
}

/**
 * Utility: Escape HTML
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Utility: Format time
 */
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Utility: Format date
 */
function formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Utility: Get CSRF token
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * Rename a chat session
 * Prompts user for new name, then updates via API
 */
function renameSession(sessionId, currentTitle) {
    const newTitle = prompt('Enter new session name:', currentTitle);
    if (!newTitle || newTitle === currentTitle) return;
    
    updateSessionTitle(sessionId, newTitle.substring(0, 100));
}

/**
 * Update session title via API
 */
async function updateSessionTitle(sessionId, newTitle) {
    try {
        const csrfToken = getCookie('csrftoken');
        const response = await fetch(`/api/ai-reports/chat-sessions/${sessionId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ title: newTitle })
        });
        
        if (response.ok) {
            // Update local state
            const session = chatSessions.find(s => s.id === sessionId);
            if (session) {
                session.title = newTitle;
            }
            renderSessionsList();
            console.log('[AI Reports] Session renamed successfully');
        } else {
            console.error('[AI Reports] Failed to update session title');
            alert('Failed to rename session');
        }
    } catch (error) {
        console.error('[AI Reports] Error updating session title:', error);
        alert('Error renaming session: ' + error.message);
    }
}

/**
 * Delete a chat session
 * Shows confirmation dialog, then deletes via API
 */
function deleteSession(sessionId, event) {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
        return;
    }
    
    deleteSessionFromAPI(sessionId);
}

/**
 * Delete session via API
 */
async function deleteSessionFromAPI(sessionId) {
    try {
        const csrfToken = getCookie('csrftoken');
        const response = await fetch(`/api/ai-reports/chat-sessions/${sessionId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrfToken
            }
        });
        
        if (response.ok) {
            // Update local state
            chatSessions = chatSessions.filter(s => s.id !== sessionId);
            
            // If deleted session was active, create a new one
            if (currentSessionId === sessionId) {
                currentSessionId = null;
                chatMessages = [];
                createNewSession();
            }
            
            renderSessionsList();
            console.log('[AI Reports] Session deleted successfully');
        } else {
            console.error('[AI Reports] Failed to delete session');
            alert('Failed to delete session');
        }
    } catch (error) {
        console.error('[AI Reports] Error deleting session:', error);
        alert('Error deleting session: ' + error.message);
    }
}
