'use client';

import { useState, useRef, useEffect } from 'react';
import { useCorisaStore } from '../stores/corisaStore';
import { Send, Sparkles, Copy, Check, Brain, FileText } from 'lucide-react';
import AIContextDisplay from './AIContextDisplay';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function ChatInterface() {
  const { chatHistory, processPrompt, isLoading, getInsightsForAI, analyzeAIContext, aiGenerationContext } = useCorisaStore();
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
    
    // Analyze AI context and show transparency
    analyzeAIContext(prompt);
    
    // Get insights to enhance AI responses
    const insights = getInsightsForAI();
    const enhancedPrompt = insights ? `${prompt}\n\nProject Insights:\n${insights}` : prompt;
    
    await processPrompt(enhancedPrompt);
  };

  const handleExampleClick = async (prompt: string) => {
    setInput(prompt);
    
    // Analyze AI context and show transparency
    analyzeAIContext(prompt);
    
    // Get insights to enhance AI responses
    const insights = getInsightsForAI();
    const enhancedPrompt = insights ? `${prompt}\n\nProject Insights:\n${insights}` : prompt;
    
    await processPrompt(enhancedPrompt);
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
    <div className="max-w-6xl mx-auto">
      {/* AI Context Display */}
      <div className="mb-6">
        <AIContextDisplay />
      </div>

      {/* Welcome Section */}
      {chatHistory.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome to Corisa AI
            </h2>
            <p className="text-muted-foreground mb-6">
              Describe your application in plain English and watch as AI generates the complete schema and code using your Insight Files for context.
            </p>
            
            {/* Example Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(prompt)}
                  disabled={isLoading}
                  className="p-3 text-left bg-muted border border-border rounded-lg hover:bg-muted/80 transition-all duration-300 text-muted-foreground hover:text-foreground"
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
            className={`bg-card border border-border rounded-lg p-4 ${message.type} slide-up`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-muted' 
                  : 'bg-muted'
              }`}>
                {message.type === 'user' ? (
                  <span className="text-white text-sm font-medium">U</span>
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div 
                  className="text-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMessage(message.content) 
                  }}
                />
                
                {/* Show AI context for AI messages */}
                {message.type === 'ai' && message.aiContext && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4" />
                      <span className="text-sm font-medium text-purple-600">AI Context</span>
                    </div>
                    
                    {/* Referenced Insights */}
                    {message.aiContext.referencedInsights && message.aiContext.referencedInsights.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-muted-foreground mb-2">Referenced Insight Files:</div>
                        <div className="flex flex-wrap gap-2">
                          {message.aiContext.referencedInsights.map((ref, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded text-xs flex items-center space-x-1 ${
                                ref.relevance === 'high' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : ref.relevance === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                              }`}
                            >
                              <FileText className="w-3 h-3" />
                              <span>{ref.insightName}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Missing Insights */}
                    {message.aiContext.missingInsights && message.aiContext.missingInsights.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-muted-foreground mb-2">Suggested Insights:</div>
                        <div className="flex flex-wrap gap-2">
                          {message.aiContext.missingInsights.map((insight, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded text-xs"
                            >
                              {insight}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Context Summary */}
                    {message.aiContext.contextSummary && (
                      <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded border-l-2 border-blue-500">
                        <strong>Context:</strong> {message.aiContext.contextSummary}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Show generation details for AI messages */}
                {message.type === 'ai' && message.metadata?.generation && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Generated Entities:</span>
                      <button
                        onClick={() => copyToClipboard(
                          JSON.stringify(message.metadata?.generation, null, 2),
                          message.id
                        )}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
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
                          className="px-2 py-1 bg-green-600/20 text-green-600 rounded"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* AI Context Transparency */}
        {aiGenerationContext && (
          <div className="bg-card border border-border rounded-lg p-4 slide-up">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">AI Context Analysis</div>
                <div className="text-sm text-muted-foreground mb-3">
                  {aiGenerationContext.contextSummary}
                </div>
                
                {aiGenerationContext.referencedInsights.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Referencing Insights:</div>
                    <div className="flex flex-wrap gap-2">
                      {aiGenerationContext.referencedInsights.map((ref, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-xs ${
                            ref.relevance === 'high' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : ref.relevance === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {ref.insightName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {aiGenerationContext.missingInsights.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">Suggested Insights:</div>
                    <div className="flex flex-wrap gap-2">
                      {aiGenerationContext.missingInsights.map((insight, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded text-xs"
                        >
                          {insight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="bg-card border border-border rounded-lg p-4 slide-up">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span className="text-muted-foreground">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-4">
        <div className="flex space-x-3">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your application or feature in plain English..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          Try: "Create a user dashboard with analytics charts" or "Add a shopping cart with payment integration"
        </div>
      </form>
    </div>
  );
}