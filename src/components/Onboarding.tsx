import { useState } from 'react';
import { useCorisaStore } from '../stores/corisaStore';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  FolderOpen, 
  Plus, 
  Sparkles, 
  FileText, 
  Code, 
  Brain,
  Upload,
  Download
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export default function Onboarding() {
  const { 
    createNewProject, 
    importProject, 
    exportContextFiles, 
    importContextFiles,
    isProjectLoaded 
  } = useCorisaStore();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = () => {
    if (!projectName.trim() || !projectDescription.trim()) return;
    
    setIsCreating(true);
    createNewProject(projectName.trim(), projectDescription.trim(), 'new');
    setIsCreating(false);
  };

  const handleImportProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      importProject(files);
    }
  };

  const handleExportTemplate = () => {
    const template = [
      {
        id: '1',
        type: 'setup.context' as const,
        name: 'Project Setup',
        displayName: 'Project Setup',
        description: 'Initial project configuration and environment setup',
        content: CONTEXT_FILE_TEMPLATES['setup.context'].defaultContent,
        order: 0,
        lastModified: new Date(),
        isDirty: false
      },
      {
        id: '2',
        type: 'goals.plan' as const,
        name: 'Business Goals',
        displayName: 'Business Goals',
        description: 'Project objectives, features, and success metrics',
        content: CONTEXT_FILE_TEMPLATES['goals.plan'].defaultContent,
        order: 1,
        lastModified: new Date(),
        isDirty: false
      }
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corisa-project-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isProjectLoaded) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Corisa AI
                </h1>
                <p className="text-lg text-white/80">Revolutionary Abstract Coding Platform</p>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-white/90 leading-relaxed">
                Import an existing project or describe your goal to begin. The app will generate and organize intelligent config files that guide the AI to help you build faster.
              </p>
            </div>
          </div>

          {/* Project Creation Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create New Project */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Start New Project</span>
                </CardTitle>
                <CardDescription className="text-white/70">
                  Describe what you want to build and let AI generate the perfect configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">
                    Project Name
                  </label>
                  <Input
                    placeholder="My Awesome App"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">
                    What do you want to build?
                  </label>
                  <Textarea
                    placeholder="Describe your project goals, features, and requirements..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={4}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <Button 
                  onClick={handleCreateProject}
                  disabled={!projectName.trim() || !projectDescription.trim() || isCreating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isCreating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Import Existing Project */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5" />
                  <span>Import Project</span>
                </CardTitle>
                <CardDescription className="text-white/70">
                  Import an existing project folder or configuration files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <FileText className="w-4 h-4" />
                    <span>Project configuration files</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Code className="w-4 h-4" />
                    <span>Source code analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Brain className="w-4 h-4" />
                    <span>AI context generation</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-white/60" />
                      <p className="text-white/80 font-medium">Click to select files</p>
                      <p className="text-sm text-white/60">or drag and drop</p>
                      <input
                        type="file"
                        multiple
                        accept=".json,.yaml,.yml,.js,.ts,.jsx,.tsx"
                        onChange={handleImportProject}
                        className="hidden"
                      />
                    </div>
                  </label>

                  <div className="flex space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleExportTemplate}
                          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Template
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download a template to get started</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h3 className="font-semibold text-white mb-1">AI-Powered</h3>
              <p className="text-sm text-white/60">Intelligent code generation and analysis</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
              <FileText className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h3 className="font-semibold text-white mb-1">Context Aware</h3>
              <p className="text-sm text-white/60">Smart configuration management</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
              <Code className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h3 className="font-semibold text-white mb-1">Developer Focused</h3>
              <p className="text-sm text-white/60">Built for modern development workflows</p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Import the templates
import { CONTEXT_FILE_TEMPLATES } from '../types/context';