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
  Download,
  Lightbulb,
  Target,
  Settings
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import GitImport from './GitImport';

export default function Onboarding() {
  const { 
    createNewProject, 
    importProject, 
    exportInsightFiles, 
    importInsightFiles,
    isProjectLoaded,
    quickStartFromPrompt,
    setCurrentView 
  } = useCorisaStore();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    if (!projectName.trim() || !projectDescription.trim()) return;
    
    setIsCreating(true);
    createNewProject(projectName.trim(), projectDescription.trim(), 'new');
    try {
      await quickStartFromPrompt(projectDescription.trim());
      setCurrentView('chat');
    } finally {
      setIsCreating(false);
    }
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
        type: 'project-overview' as const,
        name: 'Project Overview',
        displayName: 'Project Overview',
        description: 'High-level project description, goals, and vision',
        content: INSIGHT_TEMPLATES['project-overview'].defaultContent,
        order: 0,
        lastModified: new Date(),
        isDirty: false,
        metadata: {
          category: 'project',
          priority: 'high',
          tags: ['overview', 'goals', 'vision'],
          relatedFiles: []
        },
        aiReferences: []
      },
      {
        id: '2',
        type: 'features-spec' as const,
        name: 'Features Specification',
        displayName: 'Features Specification',
        description: 'Detailed feature requirements and specifications',
        content: INSIGHT_TEMPLATES['features-spec'].defaultContent,
        order: 1,
        lastModified: new Date(),
        isDirty: false,
        metadata: {
          category: 'business',
          priority: 'high',
          tags: ['features', 'requirements', 'specs'],
          relatedFiles: []
        },
        aiReferences: []
      }
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corisa-insights-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isProjectLoaded) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold">
                  Corisa AI
                </h1>
                <p className="text-lg text-white/80">Revolutionary Abstract Coding Platform</p>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-xl text-white/90 leading-relaxed">
                Bridge the communication gap between humans and AI with structured, persistent context. 
                Create Insight Files that act as the evolving mind of your project — providing deep, 
                rich background for AI to work more intelligently.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>AI never guesses — it reads from your insights first</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Structured context that evolves with your project</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Transparent AI reasoning and suggestions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Creation Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create New Project */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Start New Project</span>
                </CardTitle>
                <CardDescription className="text-white/70">
                  Describe your project vision and let AI scaffold intelligent Insight Files
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
                  />
                </div>

                <Button 
                  onClick={handleCreateProject}
                  disabled={!projectName.trim() || !projectDescription.trim() || isCreating}
                  className="w-full"
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5" />
                  <span>Import Project</span>
                </CardTitle>
                <CardDescription className="text-white/70">
                  Import existing codebase and generate Insight Files from your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <GitImport />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h3 className="font-semibold text-white mb-1">Insight-Driven</h3>
              <p className="text-sm text-white/60">AI reads from structured project insights</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h3 className="font-semibold text-white mb-1">Transparent AI</h3>
              <p className="text-sm text-white/60">See exactly what context AI is using</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
              <Settings className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h3 className="font-semibold text-white mb-1">Evolving Context</h3>
              <p className="text-sm text-white/60">Insights grow with your project</p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Import the templates
import { INSIGHT_TEMPLATES } from '../types/insights';