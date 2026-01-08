// State Management
let messageHistory = [];
let isStreaming = false;
let currentStreamingMessage = null;
let apiKey = CONFIG.API_KEY || localStorage.getItem('apiKey') || '';
let apiUrl = CONFIG.API_BASE_URL || localStorage.getItem('apiUrl') || 'http://localhost:9621';
let queryMode = CONFIG.DEFAULT_MODE || localStorage.getItem('queryMode') || 'mix';
let topK = CONFIG.DEFAULT_TOP_K || parseInt(localStorage.getItem('topK')) || 60;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    checkConnection();
    setupEventListeners();
});

function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // Auto-resize textarea
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Send on Enter (without Shift)
    messageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Settings
function openSettings() {
    document.getElementById('apiKeyInput').value = apiKey;
    document.getElementById('apiUrlInput').value = apiUrl;
    document.getElementById('modeSelect').value = queryMode;
    document.getElementById('topKInput').value = topK;
    document.getElementById('settingsModal').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}

function saveSettings() {
    apiKey = document.getElementById('apiKeyInput').value;
    apiUrl = document.getElementById('apiUrlInput').value;
    queryMode = document.getElementById('modeSelect').value;
    topK = parseInt(document.getElementById('topKInput').value);

    // Save to localStorage
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('apiUrl', apiUrl);
    localStorage.setItem('queryMode', queryMode);
    localStorage.setItem('topK', topK);

    closeSettings();
    checkConnection();
    showNotification('✅ Đã lưu cài đặt!', 'success');
}

function loadSettings() {
    apiKey = localStorage.getItem('apiKey') || CONFIG.API_KEY || '';
    apiUrl = localStorage.getItem('apiUrl') || CONFIG.API_BASE_URL;
    queryMode = localStorage.getItem('queryMode') || CONFIG.DEFAULT_MODE;
    topK = parseInt(localStorage.getItem('topK')) || CONFIG.DEFAULT_TOP_K;
}

// Connection Check
async function checkConnection() {
    const statusBadge = document.getElementById('statusBadge');

    try {
        const response = await fetch(`${apiUrl}/health`, {
            headers: apiKey ? { 'X-API-Key': apiKey } : {}
        });

        if (response.ok) {
            const data = await response.json();
            statusBadge.innerHTML = '<span class="status-dot"></span> Đã kết nối';
            statusBadge.className = 'status-badge connected';
        } else {
            throw new Error('Connection failed');
        }
    } catch (error) {
        statusBadge.innerHTML = '<span class="status-dot"></span> Lỗi kết nối';
        statusBadge.className = 'status-badge error';
    }
}

// Message Handling
function setMessage(text) {
    document.getElementById('messageInput').value = text;
    document.getElementById('messageInput').focus();
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message || isStreaming) return;

    if (!apiKey) {
        showNotification('⚠️ Vui lòng cài đặt API key trước!', 'warning');
        openSettings();
        return;
    }

    // Add user message
    addMessage(message, 'user');
    input.value = '';
    input.style.height = 'auto';

    // Disable input while streaming
    isStreaming = true;
    updateSendButton(true);

    // Add bot typing indicator
    const typingId = addTypingIndicator();

    try {
        await queryStream(message, typingId);
    } catch (error) {
        removeMessage(typingId);
        addMessage(`❌ Lỗi: ${error.message}`, 'bot', true);
    } finally {
        isStreaming = false;
        updateSendButton(false);
    }
}

async function queryStream(query, typingId) {
    const url = `${apiUrl}/query/stream`;

    const requestBody = {
        query: query,
        mode: queryMode,
        only_need_context: false,
        stream: true,
        top_k: topK
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    // Remove typing indicator
    removeMessage(typingId);

    // Create streaming message container
    const messageId = addMessage('', 'bot', false, true);
    let fullResponse = '';

    // Read stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const data = JSON.parse(line.slice(6));

                    if (data.type === 'text' && data.data) {
                        fullResponse += data.data;
                        updateMessage(messageId, fullResponse);
                    } else if (data.type === 'done' || data.type === 'error') {
                        // Stream complete
                        break;
                    }
                } catch (e) {
                    console.error('Failed to parse chunk:', e);
                }
            }
        }
    }

    // Finalize message
    if (fullResponse) {
        updateMessage(messageId, fullResponse, true);
    } else {
        removeMessage(messageId);
        throw new Error('Không nhận được phản hồi từ server');
    }
}

// UI Functions
function addMessage(text, type = 'bot', isError = false, isStreaming = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageId = 'msg-' + Date.now();

    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `message ${type}-message${isError ? ' error-message' : ''}`;

    const avatar = type === 'user' ? '👤' : '🤖';
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text" id="${messageId}-text">${formatMessage(text)}${isStreaming ? '<span class="cursor">▋</span>' : ''}</div>
            <div class="message-time">${timestamp}</div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();

    return messageId;
}

function updateMessage(messageId, text, finalize = false) {
    const messageTextEl = document.getElementById(`${messageId}-text`);
    if (messageTextEl) {
        messageTextEl.innerHTML = formatMessage(text) + (finalize ? '' : '<span class="cursor">▋</span>');
        scrollToBottom();
    }
}

function removeMessage(messageId) {
    const messageEl = document.getElementById(messageId);
    if (messageEl) {
        messageEl.remove();
    }
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingId = 'typing-' + Date.now();

    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = 'message bot-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-text">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    scrollToBottom();

    return typingId;
}

function formatMessage(text) {
    if (!text) return '';

    // Basic markdown-like formatting
    text = text
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n/g, '<br>')
        // Links (simple)
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    return text;
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateSendButton(disabled) {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');

    sendButton.disabled = disabled;
    messageInput.disabled = disabled;

    if (disabled) {
        sendButton.innerHTML = '<span class="btn-send-text">Đang gửi...</span><span class="btn-send-icon">⏳</span>';
    } else {
        sendButton.innerHTML = '<span class="btn-send-text">Gửi</span><span class="btn-send-icon">📤</span>';
    }
}

function clearChat() {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ cuộc trò chuyện?')) return;

    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = `
        <div class="message bot-message welcome-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-text">
                    <h3>Xin chào! 👋</h3>
                    <p>Tôi là trợ lý bảo hiểm AI, được hỗ trợ bởi LightRAG. Tôi có thể giúp bạn:</p>
                    <ul>
                        <li>Tìm hiểu về các loại bảo hiểm (xe máy, ô tô, sức khỏe...)</li>
                        <li>Tính phí bảo hiểm</li>
                        <li>Hướng dẫn quy trình bồi thường</li>
                        <li>Giải đáp các câu hỏi về bảo hiểm</li>
                    </ul>
                    <p><strong>Hãy đặt câu hỏi để bắt đầu!</strong></p>
                </div>
                <div class="message-time">Hôm nay</div>
            </div>
        </div>
    `;

    messageHistory = [];
    showNotification('✅ Đã xóa cuộc trò chuyện!', 'success');
}

function showNotification(message, type = 'info') {
    // Simple notification (you can enhance this)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-green)' : type === 'error' ? 'var(--error-red)' : 'var(--primary-blue)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for cursor animation
const style = document.createElement('style');
style.textContent = `
    .cursor {
        animation: blink 1s infinite;
        margin-left: 2px;
    }
    
    @keyframes blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
