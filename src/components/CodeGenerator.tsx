'use client';

import { useState } from 'react';
import { useCorisaStore } from '../stores/corisaStore';
import { Play, Download, Copy, Check, Settings } from 'lucide-react';

export default function CodeGenerator() {
  const { schema, generateCode } = useCorisaStore();
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [generationConfig, setGenerationConfig] = useState({
    frontend: {
      framework: 'react',
      language: 'typescript',
      styling: 'tailwind'
    },
    backend: {
      framework: 'express',
      language: 'typescript',
      database: 'postgresql'
    },
    features: {
      authentication: true,
      api: true,
      database: true,
      documentation: true
    }
  });

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const result = await generateCode(generationConfig);
      setGeneratedCode(result);
    } catch (error) {
      console.error('Failed to generate code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyFile = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      console.error('Failed to copy file:', err);
    }
  };

  const handleDownloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    if (!generatedCode) return;

    const allFiles = [
      ...generatedCode.frontend,
      ...generatedCode.backend,
      ...generatedCode.database,
      ...generatedCode.configuration,
      ...generatedCode.documentation
    ];

    allFiles.forEach(file => {
      handleDownloadFile(file.content, file.path);
    });
  };

  const renderFileSection = (title: string, files: any[], icon: any) => {
    if (!files || files.length === 0) return null;

    return (
      <div className="ai-card">
        <div className="flex items-center space-x-2 mb-4">
          {icon}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span className="text-sm text-white/60">({files.length} files)</span>
        </div>
        
        <div className="space-y-3">
          {files.map((file, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">{file.path}</span>
                  <span className="text-xs text-white/40">({file.language})</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyFile(file.content, file.path)}
                    className="p-1 text-white/40 hover:text-white transition-colors"
                    title="Copy file"
                  >
                    {copiedFile === file.path ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDownloadFile(file.content, file.path)}
                    className="p-1 text-white/40 hover:text-white transition-colors"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="code-block max-h-40 overflow-y-auto">
                <pre className="text-xs">{file.content}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="ai-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Code Generator</h2>
            <p className="text-white/60">
              Generate complete application code from your Corisa schema. Choose your preferred frameworks and technologies.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="ai-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isGenerating ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isGenerating ? 'Generating...' : 'Generate Code'}</span>
            </button>
            
            {generatedCode && (
              <button
                onClick={downloadAllFiles}
                className="px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </button>
            )}
          </div>
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-white mb-2 flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Frontend</span>
            </h4>
            <div className="space-y-2">
              <select
                value={generationConfig.frontend.framework}
                onChange={(e) => setGenerationConfig(prev => ({
                  ...prev,
                  frontend: { ...prev.frontend, framework: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="react">React</option>
                <option value="vue">Vue.js</option>
                <option value="angular">Angular</option>
                <option value="svelte">Svelte</option>
              </select>
              
              <select
                value={generationConfig.frontend.language}
                onChange={(e) => setGenerationConfig(prev => ({
                  ...prev,
                  frontend: { ...prev.frontend, language: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-2">Backend</h4>
            <div className="space-y-2">
              <select
                value={generationConfig.backend.framework}
                onChange={(e) => setGenerationConfig(prev => ({
                  ...prev,
                  backend: { ...prev.backend, framework: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="express">Express.js</option>
                <option value="fastify">Fastify</option>
                <option value="koa">Koa</option>
                <option value="nest">NestJS</option>
              </select>
              
              <select
                value={generationConfig.backend.database}
                onChange={(e) => setGenerationConfig(prev => ({
                  ...prev,
                  backend: { ...prev.backend, database: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="mongodb">MongoDB</option>
                <option value="sqlite">SQLite</option>
              </select>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-2">Features</h4>
            <div className="space-y-2">
              {Object.entries(generationConfig.features).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setGenerationConfig(prev => ({
                      ...prev,
                      features: { ...prev.features, [key]: e.target.checked }
                    }))}
                    className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-white/80 capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Code Display */}
      {generatedCode && (
        <div className="space-y-6">
          {renderFileSection('Frontend', generatedCode.frontend, <span className="text-blue-400">⚛️</span>)}
          {renderFileSection('Backend', generatedCode.backend, <span className="text-green-400">🔧</span>)}
          {renderFileSection('Database', generatedCode.database, <span className="text-yellow-400">🗄️</span>)}
          {renderFileSection('Configuration', generatedCode.configuration, <span className="text-purple-400">⚙️</span>)}
          {renderFileSection('Documentation', generatedCode.documentation, <span className="text-pink-400">📚</span>)}
        </div>
      )}

      {/* Empty State */}
      {!generatedCode && !isGenerating && (
        <div className="ai-card text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate Code</h3>
          <p className="text-white/60 mb-4">
            Configure your preferences above and click "Generate Code" to create your application.
          </p>
          <button
            onClick={handleGenerateCode}
            className="ai-button"
          >
            <Play className="w-4 h-4" />
            <span>Generate Code</span>
          </button>
        </div>
      )}
    </div>
  );
}