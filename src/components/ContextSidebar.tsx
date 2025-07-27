import { useState } from 'react';
import { useCorisaStore } from '../stores/corisaStore';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Plus, 
  FileText, 
  Edit3, 
  Trash2, 
  Sparkles,
  GripVertical,
  MoreVertical,
  Save,
  Download,
  Upload
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { CONTEXT_FILE_TEMPLATES, ContextFileType } from '../types/context';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export default function ContextSidebar() {
  const { 
    contextFiles, 
    selectedContextFile, 
    addContextFile, 
    selectContextFile, 
    deleteContextFile,
    generateContextFileContent,
    exportContextFiles,
    importContextFiles,
    reorderContextFiles
  } = useCorisaStore();

  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleAddFile = (type: ContextFileType) => {
    addContextFile(type);
    setIsAddingFile(false);
  };

  const handleGenerateContent = async (fileId: string) => {
    setIsGenerating(fileId);
    try {
      const file = contextFiles.find(f => f.id === fileId);
      if (file) {
        await generateContextFileContent(fileId, `Generate content for ${file.displayName} based on the project context`);
      }
    } finally {
      setIsGenerating(null);
    }
  };

  const handleExport = () => {
    const content = exportContextFiles();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corisa-context-files.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importContextFiles(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDragStart = (e: React.DragEvent, fileId: string) => {
    e.dataTransfer.setData('text/plain', fileId);
  };

  const handleDragOver = (e: React.DragEvent, fileId: string) => {
    e.preventDefault();
    setDragOverId(fileId);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId !== targetId) {
      const currentOrder = contextFiles.map(f => f.id);
      const draggedIndex = currentOrder.indexOf(draggedId);
      const targetIndex = currentOrder.indexOf(targetId);
      
      const newOrder = [...currentOrder];
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedId);
      
      reorderContextFiles(newOrder);
    }
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDragOverId(null);
  };

  return (
    <TooltipProvider>
      <div className="w-80 bg-card border-r border-border h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Context Files</h2>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAddingFile(!isAddingFile)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add new context file</p>
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
                          accept=".json"
                          onChange={handleImport}
                          className="hidden"
                        />
                      </span>
                    </Button>
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import context files</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleExport}
                    className="h-8 w-8"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export context files</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Add File Dropdown */}
          {isAddingFile && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Add Context File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(CONTEXT_FILE_TEMPLATES).map(([type, template]) => (
                  <Button
                    key={type}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => handleAddFile(type as ContextFileType)}
                  >
                    <span className="mr-2">{template.icon}</span>
                    <div>
                      <div className="font-medium">{template.displayName}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {contextFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No context files yet</p>
              <p className="text-xs">Add files to organize your project context</p>
            </div>
          ) : (
            contextFiles.map((file) => (
              <div
                key={file.id}
                draggable
                onDragStart={(e) => handleDragStart(e, file.id)}
                onDragOver={(e) => handleDragOver(e, file.id)}
                onDrop={(e) => handleDrop(e, file.id)}
                onDragEnd={handleDragEnd}
                className={`relative group cursor-pointer transition-all duration-200 ${
                  dragOverId === file.id ? 'scale-105' : ''
                }`}
              >
                <Card
                  className={`transition-all duration-200 ${
                    selectedContextFile?.id === file.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  } ${file.isDirty ? 'border-orange-500/50' : ''}`}
                  onClick={() => selectContextFile(file.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="mr-2">{CONTEXT_FILE_TEMPLATES[file.type].icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{file.displayName}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {file.description}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.isDirty && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Unsaved changes</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateContent(file.id);
                              }}
                              disabled={isGenerating === file.id}
                            >
                              {isGenerating === file.id ? (
                                <Sparkles className="h-3 w-3 animate-spin" />
                              ) : (
                                <Sparkles className="h-3 w-3" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generate content with AI</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteContextFile(file.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete file</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            {contextFiles.length} context file{contextFiles.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}