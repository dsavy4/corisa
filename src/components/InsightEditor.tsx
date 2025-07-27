import { useState } from 'react';
import { useCorisaStore } from '../stores/corisaStore';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { 
  Save, 
  Sparkles, 
  FileText, 
  Edit3, 
  X,
  RotateCcw,
  Download,
  Upload,
  Tag,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { INSIGHT_TEMPLATES } from '../types/insights';

export default function InsightEditor() {
  const { 
    selectedInsightFile, 
    updateInsightFile, 
    generateInsightFileContent,
    insightFiles 
  } = useCorisaStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');

  // Update edit content when selected file changes
  React.useEffect(() => {
    if (selectedInsightFile) {
      setEditContent(selectedInsightFile.content);
    }
  }, [selectedInsightFile]);

  const handleSave = () => {
    if (selectedInsightFile) {
      updateInsightFile(selectedInsightFile.id, { content: editContent });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (selectedInsightFile) {
      setEditContent(selectedInsightFile.content);
      setIsEditing(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedInsightFile || !generationPrompt.trim()) return;

    setIsGenerating(true);
    try {
      await generateInsightFileContent(selectedInsightFile.id, generationPrompt);
      setGenerationPrompt('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportFile = () => {
    if (!selectedInsightFile) return;

    const content = JSON.stringify(selectedInsightFile, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedInsightFile.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedInsightFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          updateInsightFile(selectedInsightFile.id, { content });
          setEditContent(content);
        } catch (error) {
          console.error('Failed to import file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!selectedInsightFile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No insight selected</h3>
          <p className="text-sm">Select an insight file from the sidebar to edit</p>
        </div>
      </div>
    );
  }

  const template = INSIGHT_TEMPLATES[selectedInsightFile.type];

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold">{selectedInsightFile.displayName}</h2>
                  <p className="text-sm text-muted-foreground">{selectedInsightFile.description}</p>
                </div>
              </div>
              {selectedInsightFile.isDirty && (
                <div className="flex items-center space-x-1 text-orange-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">Unsaved changes</span>
                </div>
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
                      <p>Edit insight</p>
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
                      <p>Export insight</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span className="capitalize">{selectedInsightFile.metadata.category}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="capitalize">{selectedInsightFile.metadata.priority} priority</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Last modified: {selectedInsightFile.lastModified.toLocaleDateString()}</span>
            </div>
            {selectedInsightFile.metadata.lastAIAccess && (
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>AI accessed: {selectedInsightFile.metadata.lastAIAccess.toLocaleDateString()}</span>
              </div>
            )}
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
              The AI will use your project insights to generate relevant content for this file.
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <div className="flex-1 p-4">
          <div className="h-full">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Enter your insight content here..."
              className="h-full resize-none font-mono text-sm"
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Last modified: {selectedInsightFile.lastModified.toLocaleString()}
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