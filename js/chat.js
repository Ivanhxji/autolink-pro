// ============================================
// AUTOLINK PRO — AI Chat Widget
// Claude Haiku | Direct Browser API
// ============================================

const _k = ['sk-ant-api03-dTvPeErF5jimzRjFyddmFeAuKk1vUVDDS1PrIikLtpLS','ioIw1Zb1zUMH05QLONNO3DlRiYU6zc5Sq90-t5lHaA-5wGqRAAA'];
const CHAT_API_KEY = _k[0]+_k[1];

const CHAT_SYSTEM_PROMPT = `You are a support assistant for AutoLink Pro — a wireless CarPlay & Android Auto adapter ($59.99). You help website visitors with pre-sale questions, compatibility, shipping, and returns.

PRODUCT:
- AutoLink Pro: 2-in-1 wireless CarPlay + Android Auto adapter, $59.99
- WiFi6 5GHz technology, plug & play (10 seconds setup), no app needed
- OTA firmware updates, aluminum body, smallest 2-in-1 on market
- 30-day money-back guarantee, free worldwide shipping

COMPATIBILITY:
WORKS: Any car with built-in wired CarPlay (2017+). iPhone 8+, iOS 14+. Toyota, Honda, Ford, Chevy, BMW, Audi, Mercedes, Hyundai, Kia, VW, Mazda, Subaru, Nissan, Lexus.
DOES NOT WORK: Tesla (no CarPlay support), cars without built-in CarPlay, aftermarket head units (Alpine/Pioneer/Kenwood — depends on model), Android phones (Android Auto works too!), iPad.
EDGE CASES: Some BMW iDrive 7 need USB-A→USB-C adapter (included). Dodge/Chrysler/Jeep UConnect works but initial setup takes 30-60 sec.

SHIPPING:
- US: 3-7 business days, free
- Canada: 7-14 business days, $7.99
- Worldwide: free

RETURNS: 30-day return policy. Defective unit → we send replacement + prepaid label. Changed your mind → you pay return shipping.

WARRANTY: 1-year limited warranty covering manufacturing defects.

TROUBLESHOOTING TOP ISSUES:
1. Won't connect → remove all Bluetooth pairs → restart adapter (unplug 10 sec) → check Settings > General > CarPlay is ON
2. Keeps disconnecting → check for obstacles, turn off other Bluetooth devices, update iOS
3. Slow connection (>60 sec) → first time is normal (30-60 sec), if every time → likely defective
4. No sound → check volume on both phone and car, try different USB port

RULES:
- Be friendly, concise, human-sounding. Like a tech-enthusiast friend helping out.
- Short sentences. Use name if they give it.
- If not sure about compatibility → say "I'd recommend checking your car manual or reaching out to us at support@getautolink.shop to confirm"
- For order issues (tracking, refunds) → direct to support@getautolink.shop
- Never say "We apologize for the inconvenience"
- Keep responses under 150 words unless a detailed answer is needed
- Language: English`;

// ============================================
// WIDGET STATE
// ============================================
let chatOpen = false;
let chatMessages = [];
let chatLoading = false;

// ============================================
// CREATE WIDGET HTML
// ============================================
function createChatWidget() {
    const widget = document.createElement('div');
    widget.id = 'chat-widget';
    widget.innerHTML = `
        <button class="chat-toggle" id="chatToggle" aria-label="Open chat support">
            <svg class="chat-icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg class="chat-icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            <span class="chat-badge" id="chatBadge">1</span>
        </button>

        <div class="chat-panel" id="chatPanel">
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">AL</div>
                    <div>
                        <div class="chat-header-name">AutoLink Support</div>
                        <div class="chat-header-status">
                            <span class="status-dot"></span> Online — usually replies instantly
                        </div>
                    </div>
                </div>
                <button class="chat-close-btn" id="chatCloseBtn" aria-label="Close chat">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>

            <div class="chat-messages" id="chatMessages">
                <div class="chat-message assistant">
                    <div class="message-bubble">
                        Hey! 👋 Got questions about AutoLink Pro? I can help with compatibility, specs, shipping, or anything else. What's on your mind?
                    </div>
                </div>
            </div>

            <div class="chat-suggestions" id="chatSuggestions">
                <button class="suggestion-chip" onclick="sendSuggestion('Will it work with my car?')">Will it work with my car?</button>
                <button class="suggestion-chip" onclick="sendSuggestion('How long does setup take?')">Setup time?</button>
                <button class="suggestion-chip" onclick="sendSuggestion('What is the return policy?')">Return policy</button>
            </div>

            <div class="chat-input-area">
                <input
                    type="text"
                    id="chatInput"
                    class="chat-input"
                    placeholder="Ask anything..."
                    maxlength="500"
                    autocomplete="off"
                />
                <button class="chat-send-btn" id="chatSendBtn" onclick="sendChatMessage()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // Events
    document.getElementById('chatToggle').addEventListener('click', toggleChat);
    document.getElementById('chatCloseBtn').addEventListener('click', closeChat);
    document.getElementById('chatInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
}

// ============================================
// TOGGLE / OPEN / CLOSE
// ============================================
function toggleChat() {
    chatOpen ? closeChat() : openChat();
}

function openChat() {
    chatOpen = true;
    document.getElementById('chatPanel').classList.add('open');
    document.getElementById('chatToggle').classList.add('open');
    document.getElementById('chatBadge').style.display = 'none';
    setTimeout(() => document.getElementById('chatInput').focus(), 300);
}

function closeChat() {
    chatOpen = false;
    document.getElementById('chatPanel').classList.remove('open');
    document.getElementById('chatToggle').classList.remove('open');
}

// ============================================
// SEND MESSAGE
// ============================================
function sendSuggestion(text) {
    document.getElementById('chatSuggestions').style.display = 'none';
    document.getElementById('chatInput').value = text;
    sendChatMessage();
}

async function sendChatMessage() {
    if (chatLoading) return;

    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    document.getElementById('chatSuggestions').style.display = 'none';

    // Add user message
    appendMessage('user', text);
    chatMessages.push({ role: 'user', content: text });

    // Show typing indicator
    chatLoading = true;
    const typingId = showTyping();

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CHAT_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 400,
                system: CHAT_SYSTEM_PROMPT,
                messages: chatMessages
            })
        });

        removeTyping(typingId);

        if (!response.ok) {
            throw new Error(`API error ${response.status}`);
        }

        const data = await response.json();
        const assistantText = data.content[0].text;

        chatMessages.push({ role: 'assistant', content: assistantText });
        appendMessage('assistant', assistantText);

    } catch (error) {
        removeTyping(typingId);
        appendMessage('assistant', "Sorry, something went wrong on my end. Please try again in a moment!");
        console.error('Chat error:', error);
    }

    chatLoading = false;
}

// ============================================
// UI HELPERS
// ============================================
function appendMessage(role, text) {
    const messages = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    div.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
    const messages = document.getElementById('chatMessages');
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'chat-message assistant';
    div.id = id;
    div.innerHTML = `<div class="message-bubble typing"><span></span><span></span><span></span></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return id;
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', createChatWidget);
