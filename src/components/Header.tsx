import { useCorisaStore } from '../stores/corisaStore';
import { Brain, Code, FileText, Eye, Download, Upload, RotateCcw, FolderOpen } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { 
    currentView, 
    setCurrentView, 
    getSchemaSummary, 
    exportSchema, 
    importSchema, 
    resetSchema,
    isProjectLoaded
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
    { id: 'context', label: 'Context Files', icon: FolderOpen },
    { id: 'yaml', label: 'YAML Editor', icon: FileText },
    { id: 'code', label: 'Code Generator', icon: Code },
    { id: 'preview', label: 'Schema Preview', icon: Eye },
  ];

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-purple-600 bg-clip-text text-transparent">Corisa AI</h1>
                <p className="text-sm text-muted-foreground">Revolutionary Abstract Coding Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id as any)}
                  variant={isActive ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">🌙</span>
                    <Switch
                      checked={theme === 'light'}
                      onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
                    />
                    <span className="text-sm text-muted-foreground">☀️</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Schema Stats */}
            {isProjectLoaded && (
              <div className="hidden md:flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{summary.totalPages} Pages</span>
                <span>{summary.totalComponents} Components</span>
                <span>{summary.totalServices} Services</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleExport}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Export Schema"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <label className="cursor-pointer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept=".json,.yaml,.yml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </span>
                </Button>
              </label>
              
              <Button
                onClick={resetSchema}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Reset Schema"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}