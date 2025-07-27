'use client';

import { useCorisaStore } from '../stores/corisaStore';
import { Brain, Code, FileText, Eye, Download, Upload, RotateCcw } from 'lucide-react';

export default function Header() {
  const { 
    currentView, 
    setCurrentView, 
    getSchemaSummary, 
    exportSchema, 
    importSchema, 
    resetSchema 
  } = useCorisaStore();

  const summary = getSchemaSummary();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importSchema(content);
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const schema = exportSchema();
    const blob = new Blob([schema], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corisa-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: Brain },
    { id: 'yaml', label: 'YAML Editor', icon: FileText },
    { id: 'code', label: 'Code Generator', icon: Code },
    { id: 'preview', label: 'Schema Preview', icon: Eye },
  ];

  return (
    <header className="glass-morphism border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Corisa AI</h1>
                <p className="text-sm text-white/60">Revolutionary Abstract Coding Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Schema Stats */}
            <div className="hidden md:flex items-center space-x-4 text-sm text-white/60">
              <span>{summary.totalPages} Pages</span>
              <span>{summary.totalComponents} Components</span>
              <span>{summary.totalServices} Services</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExport}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                title="Export Schema"
              >
                <Download className="w-4 h-4" />
              </button>
              
              <label className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept=".json,.yaml,.yml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={resetSchema}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                title="Reset Schema"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}