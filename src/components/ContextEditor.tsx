import { useState } from 'react';
import { useCorisaStore } from '../stores/corisaStore';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { CONTEXT_FILE_TEMPLATES } from '../types/context';
import { 
  Save, 
  Sparkles, 
  FileText, 
  Edit3, 
  X,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export default function ContextEditor() {
  const { 
    selectedContextFile, 
    updateContextFile, 
    generateContextFileContent,
    contextFiles 
  } = useCorisaStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');

  // Update edit content when selected file changes
  React.useEffect(() => {
    if (selectedContextFile) {
      setEditContent(selectedContextFile.content);
    }
  }, [selectedContextFile]);

  const handleSave = () => {
    if (selectedContextFile) {
      updateContextFile(selectedContextFile.id, { content: editContent });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (selectedContextFile) {
      setEditContent(selectedContextFile.content);
      setIsEditing(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedContextFile || !generationPrompt.trim()) return;

    setIsGenerating(true);
    try {
      await generateContextFileContent(selectedContextFile.id, generationPrompt);
      setGenerationPrompt('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportFile = () => {
    if (!selectedContextFile) return;

    const content = JSON.stringify(selectedContextFile, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedContextFile.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedContextFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          updateContextFile(selectedContextFile.id, { content });
          setEditContent(content);
        } catch (error) {
          console.error('Failed to import file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!selectedContextFile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No file selected</h3>
          <p className="text-sm">Select a context file from the sidebar to edit</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{CONTEXT_FILE_TEMPLATES[selectedContextFile.type].icon}</span>
                <div>
                  <h2 className="text-lg font-semibold">{selectedContextFile.displayName}</h2>
                  <p className="text-sm text-muted-foreground">{selectedContextFile.description}</p>
                </div>
              </div>
              {selectedContextFile.isDirty && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              )}
            </div>

            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cancel editing</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSave}
                        className="h-8 w-8"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save changes</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(true)}
                        className="h-8 w-8"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit file</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="cursor-pointer">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <span>
                            <Upload className="h-4 w-4" />
                            <input
                              type="file"
                              accept=".json,.txt,.md"
                              onChange={handleImportFile}
                              className="hidden"
                            />
                          </span>
                        </Button>
                      </label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Import content</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleExportFile}
                        className="h-8 w-8"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export file</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </div>

        {/* AI Generation Panel */}
        <Card className="m-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Content Generation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Describe what you want to generate..."
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleGenerate}
                disabled={!generationPrompt.trim() || isGenerating}
                size="sm"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              The AI will use your project context to generate relevant content for this file.
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <div className="flex-1 p-4">
          <div className="h-full">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Enter your context content here..."
              className="h-full resize-none font-mono text-sm"
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Last modified: {selectedContextFile.lastModified.toLocaleString()}
            </div>
            <div>
              {editContent.length} characters
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Import React for useEffect
import React from 'react';