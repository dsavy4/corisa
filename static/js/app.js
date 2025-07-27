// Corisa AI Web Interface JavaScript

class CorisaAI {
    constructor() {
        this.currentTab = 'frontend';
        this.generatedCode = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSchema();
        this.autoResizeTextarea();
    }

    setupEventListeners() {
        // Auto-resize textarea
        const textarea = document.getElementById('messageInput');
        textarea.addEventListener('input', () => this.autoResizeTextarea());
        
        // Handle Enter key
        textarea.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Modal close on backdrop click
        document.getElementById('codeModal').addEventListener('click', (e) => {
            if (e.target.id === 'codeModal') {
                this.closeModal();
            }
        });
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('messageInput');
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }

    handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        input.value = '';
        this.autoResizeTextarea();

        // Show loading
        this.showLoading();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            if (data.error) {
                this.addMessage(`Error: ${data.error}`, 'ai');
            } else {
                this.addMessage(this.formatAIResponse(data), 'ai');
                this.updateSchemaSummary(data.schema_summary);
            }

        } catch (error) {
            this.addMessage(`Network error: ${error.message}`, 'ai');
        } finally {
            this.hideLoading();
        }
    }

    addMessage(content, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const author = sender === 'user' ? 'You' : 'Corisa AI';
        const icon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${icon}"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${author}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">${content}</div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatAIResponse(data) {
        let response = '';

        if (data.type === 'success') {
            response += `<h3>✅ ${data.message}</h3>`;
            
            if (data.modifications && Object.keys(data.modifications).length > 0) {
                response += '<h4>📄 Generated Entities:</h4><ul>';
                for (const [entityType, entities] of Object.entries(data.modifications)) {
                    if (Array.isArray(entities)) {
                        response += `<li><strong>${entityType}:</strong> ${entities.length} new entities</li>`;
                    } else {
                        response += `<li><strong>${entityType}:</strong> modified</li>`;
                    }
                }
                response += '</ul>';
            }
        } else {
            response += `<h3>ℹ️ ${data.message}</h3>`;
        }

        return response;
    }

    async loadSchema() {
        try {
            const response = await fetch('/api/schema');
            const schema = await response.json();
            this.updateSchemaSummary(this.getSchemaSummary(schema));
        } catch (error) {
            console.error('Failed to load schema:', error);
        }
    }

    getSchemaSummary(schema) {
        return {
            pages: schema.pages ? schema.pages.length : 0,
            sections: schema.sections ? schema.sections.length : 0,
            components: schema.components ? schema.components.length : 0,
            services: schema.services ? schema.services.length : 0,
            repositories: schema.repositories ? schema.repositories.length : 0,
            buttons: schema.buttons ? schema.buttons.length : 0,
            menus: schema.menus ? schema.menus.length : 0
        };
    }

    updateSchemaSummary(summary) {
        const summaryElement = document.getElementById('schemaSummary');
        
        if (summaryElement) {
            const items = summaryElement.querySelectorAll('.summary-item strong');
            if (items.length >= 5) {
                items[0].textContent = summary.pages;
                items[1].textContent = summary.sections;
                items[2].textContent = summary.components;
                items[3].textContent = summary.services;
                items[4].textContent = summary.repositories;
            }
        }
    }

    async generateCode() {
        this.showLoading();

        try {
            const response = await fetch('/api/generate-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: 'all' })
            });

            const data = await response.json();

            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                this.generatedCode = {
                    frontend: data.code,
                    backend: data.code,
                    database: data.code
                };
                this.showCodeModal();
            }

        } catch (error) {
            alert(`Network error: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    showCodeModal() {
        const modal = document.getElementById('codeModal');
        modal.classList.add('active');
        this.switchTab('frontend');
    }

    closeModal() {
        const modal = document.getElementById('codeModal');
        modal.classList.remove('active');
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Update code content
        const codeElement = document.getElementById('generatedCode');
        if (this.generatedCode[tab]) {
            codeElement.textContent = this.generatedCode[tab];
        } else {
            codeElement.textContent = '// No code generated for this tab';
        }
    }

    async saveSchema() {
        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                this.showNotification(data.message, 'success');
            }

        } catch (error) {
            alert(`Network error: ${error.message}`);
        }
    }

    toggleSchemaView() {
        const summary = document.getElementById('schemaSummary');
        const yaml = document.getElementById('schemaYaml');
        
        if (summary.style.display === 'none') {
            summary.style.display = 'flex';
            yaml.style.display = 'none';
        } else {
            summary.style.display = 'none';
            yaml.style.display = 'block';
            this.loadYamlContent();
        }
    }

    async loadYamlContent() {
        try {
            const response = await fetch('/api/schema');
            const schema = await response.json();
            const yamlContent = document.getElementById('yamlContent');
            yamlContent.textContent = JSON.stringify(schema, null, 2);
        } catch (error) {
            console.error('Failed to load YAML:', error);
        }
    }

    downloadSchema() {
        fetch('/api/schema')
            .then(response => response.json())
            .then(data => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'corisa-schema.json';
                a.click();
                URL.revokeObjectURL(url);
            })
            .catch(error => {
                alert(`Download failed: ${error.message}`);
            });
    }

    downloadCode() {
        const code = this.generatedCode[this.currentTab];
        if (code) {
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `corisa-${this.currentTab}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
let corisaAI;

function sendMessage() {
    corisaAI.sendMessage();
}

function handleKeyDown(event) {
    corisaAI.handleKeyDown(event);
}

function generateCode() {
    corisaAI.generateCode();
}

function saveSchema() {
    corisaAI.saveSchema();
}

function toggleSchemaView() {
    corisaAI.toggleSchemaView();
}

function downloadSchema() {
    corisaAI.downloadSchema();
}

function closeModal() {
    corisaAI.closeModal();
}

function switchTab(tab) {
    corisaAI.switchTab(tab);
}

function downloadCode() {
    corisaAI.downloadCode();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    corisaAI = new CorisaAI();
});

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 3000;
        max-width: 300px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #10b981;
    }

    .notification-success i {
        color: #10b981;
    }

    .notification-info {
        border-left: 4px solid #3b82f6;
    }

    .notification-info i {
        color: #3b82f6;
    }

    .notification-error {
        border-left: 4px solid #ef4444;
    }

    .notification-error i {
        color: #ef4444;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);