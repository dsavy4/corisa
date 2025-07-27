'use client';

import { useState, useRef, useEffect } from 'react';
import { useCorisaStore } from '../stores/corisaStore';
import { Send, Sparkles, Copy, Check } from 'lucide-react';

export default function ChatInterface() {
  const { chatHistory, processPrompt, isLoading } = useCorisaStore();
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const examplePrompts = [
    "Create a user authentication system with login and registration",
    "Add a project management dashboard with task tracking",
    "Create a product catalog with search and filtering",
    "Add a user profile page with settings",
    "Create an admin panel for user management",
    "Add a notification system with real-time updates"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const prompt = input.trim();
    setInput('');
    await processPrompt(prompt);
  };

  const handleExampleClick = async (prompt: string) => {
    setInput(prompt);
    await processPrompt(prompt);
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-700/50 px-1 rounded">$1</code>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Section */}
      {chatHistory.length === 0 && (
        <div className="ai-card mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to Corisa AI
            </h2>
            <p className="text-white/60 mb-6">
              Describe your application in plain English and watch as AI generates the complete YAML schema and code.
            </p>
            
            {/* Example Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(prompt)}
                  disabled={isLoading}
                  className="p-3 text-left bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 text-white/80 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="space-y-4 mb-6">
        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.type} slide-up`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-purple-600' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600'
              }`}>
                {message.type === 'user' ? (
                  <span className="text-white text-sm font-medium">U</span>
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div 
                  className="text-white"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMessage(message.content) 
                  }}
                />
                
                {/* Show generation details for AI messages */}
                {message.type === 'ai' && message.metadata?.generation && (
                  <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Generated Entities:</span>
                      <button
                        onClick={() => copyToClipboard(
                          JSON.stringify(message.metadata?.generation, null, 2),
                          message.id
                        )}
                        className="p-1 text-white/40 hover:text-white transition-colors"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {message.metadata.generation.newEntities.map((entity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-600/20 text-green-300 rounded"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-white/40 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="chat-message ai slide-up">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span className="text-white/60">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="ai-card">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your application or feature in plain English..."
            disabled={isLoading}
            className="ai-input flex-1"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="ai-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-3 text-xs text-white/40">
          Try: "Create a user dashboard with analytics charts" or "Add a shopping cart with payment integration"
        </div>
      </form>
    </div>
  );
}