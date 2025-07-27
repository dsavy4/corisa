'use client';

import { useState, useEffect } from 'react';
import { useCorisaStore } from '../stores/corisaStore';
import { Save, RotateCcw, Copy, Download, Check, AlertCircle } from 'lucide-react';

export default function YAMLEditor() {
  const { 
    schema, 
    yamlEditor, 
    updateYAMLEditor, 
    applyYAMLChanges, 
    exportSchema,
    resetSchema 
  } = useCorisaStore();

  const [copied, setCopied] = useState(false);
  const [localContent, setLocalContent] = useState('');

  useEffect(() => {
    // Update local content when schema changes
    setLocalContent(JSON.stringify(schema, null, 2));
  }, [schema]);

  const handleContentChange = (content: string) => {
    setLocalContent(content);
    updateYAMLEditor(content);
  };

  const handleSave = () => {
    applyYAMLChanges(localContent);
  };

  const handleReset = () => {
    setLocalContent(JSON.stringify(schema, null, 2));
    updateYAMLEditor(JSON.stringify(schema, null, 2));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([localContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corisa-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(localContent);
      const formatted = JSON.stringify(parsed, null, 2);
      setLocalContent(formatted);
      updateYAMLEditor(formatted);
    } catch (error) {
      // If parsing fails, don't format
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="ai-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">YAML Schema Editor</h2>
            <p className="text-white/60">
              View and edit your application schema. Changes are automatically validated and can be applied to update the schema.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={formatJSON}
              className="px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-colors"
            >
              Format JSON
            </button>
            
            <button
              onClick={handleCopy}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              title="Download schema"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              yamlEditor.isValid ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-white/60">
              {yamlEditor.isValid ? 'Valid JSON' : 'Invalid JSON'}
            </span>
          </div>
          
          {yamlEditor.isDirty && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-sm text-white/60">Unsaved changes</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm text-white/60">
              Last saved: {yamlEditor.lastSaved.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="ai-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Schema Content</h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={!yamlEditor.isValid || !yamlEditor.isDirty}
              className="ai-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {!yamlEditor.isValid && yamlEditor.errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-medium">JSON Validation Error</span>
            </div>
            <div className="text-red-300 text-sm">
              {yamlEditor.errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          </div>
        )}

        {/* Textarea */}
        <textarea
          value={localContent}
          onChange={(e) => handleContentChange(e.target.value)}
          className="yaml-editor"
          placeholder="Enter your Corisa schema in JSON format..."
          spellCheck={false}
        />
      </div>

      {/* Schema Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="ai-card">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{schema.pages.length}</div>
            <div className="text-white/60 text-sm">Pages</div>
          </div>
        </div>
        
        <div className="ai-card">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{schema.components.length}</div>
            <div className="text-white/60 text-sm">Components</div>
          </div>
        </div>
        
        <div className="ai-card">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{schema.services.length}</div>
            <div className="text-white/60 text-sm">Services</div>
          </div>
        </div>
        
        <div className="ai-card">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{Object.keys(schema.models).length}</div>
            <div className="text-white/60 text-sm">Models</div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="ai-card mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Schema Structure Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/60">
          <div>
            <h4 className="font-medium text-white mb-2">Core Entities</h4>
            <ul className="space-y-1">
              <li>• <code className="bg-slate-700/50 px-1 rounded">app</code> - Application metadata</li>
              <li>• <code className="bg-slate-700/50 px-1 rounded">pages</code> - UI screens and routes</li>
              <li>• <code className="bg-slate-700/50 px-1 rounded">components</code> - Reusable UI elements</li>
              <li>• <code className="bg-slate-700/50 px-1 rounded">services</code> - Business logic</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Data Layer</h4>
            <ul className="space-y-1">
              <li>• <code className="bg-slate-700/50 px-1 rounded">repositories</code> - Data access layer</li>
              <li>• <code className="bg-slate-700/50 px-1 rounded">models</code> - Data structures</li>
              <li>• <code className="bg-slate-700/50 px-1 rounded">ai_agent</code> - AI capabilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}