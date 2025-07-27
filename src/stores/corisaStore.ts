import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  CorisaSchema, 
  ChatMessage, 
  GenerationResult, 
  CodeGenerationResult,
  SchemaSummary,
  YAMLEditorState
} from '../types/corisa';
import { 
  ContextFile, 
  ProjectContext, 
  ContextFileType,
  CONTEXT_FILE_TEMPLATES 
} from '../types/context';
import { generateYAMLFromPrompt, generateCodeFromSchema } from '../lib/ai-engine';

interface CorisaStore {
  // State
  schema: CorisaSchema;
  chatHistory: ChatMessage[];
  currentView: 'chat' | 'yaml' | 'code' | 'preview' | 'context';
  isLoading: boolean;
  error: string | null;
  yamlEditor: YAMLEditorState;
  
  // New Context Management
  currentProject: ProjectContext | null;
  contextFiles: ContextFile[];
  selectedContextFile: ContextFile | null;
  isProjectLoaded: boolean;

  // Actions
  initializeSchema: () => void;
  updateSchema: (schema: CorisaSchema) => void;
  processPrompt: (prompt: string) => Promise<void>;
  generateCode: (request: any) => Promise<CodeGenerationResult>;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setCurrentView: (view: 'chat' | 'yaml' | 'code' | 'preview' | 'context') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateYAMLEditor: (content: string) => void;
  validateYAML: (content: string) => boolean;
  applyYAMLChanges: (content: string) => void;
  getSchemaSummary: () => SchemaSummary;
  exportSchema: () => string;
  importSchema: (yamlContent: string) => void;
  resetSchema: () => void;

  // Context File Actions
  createNewProject: (name: string, description: string, source: 'import' | 'new') => void;
  importProject: (files: FileList) => Promise<void>;
  addContextFile: (type: ContextFileType, name?: string) => void;
  updateContextFile: (id: string, updates: Partial<ContextFile>) => void;
  deleteContextFile: (id: string) => void;
  selectContextFile: (id: string) => void;
  reorderContextFiles: (fileIds: string[]) => void;
  generateContextFileContent: (fileId: string, prompt: string) => Promise<void>;
  exportContextFiles: () => string;
  importContextFiles: (content: string) => void;
  getContextForAI: () => string;
}

const createInitialSchema = (): CorisaSchema => ({
  app: {
    name: "Corisa AI Application",
    version: "1.0.0",
    description: "AI-generated application using Corisa platform",
    metadata: {
      author: "Corisa AI",
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: ["ai-generated", "corisa"],
      complexity: "simple"
    }
  },
  menus: [],
  pages: [],
  sections: [],
  components: [],
  buttons: [],
  services: [],
  repositories: [],
  models: {},
  ai_agent: {
    capabilities: [
      "yaml_generation",
      "code_generation", 
      "schema_evolution",
      "pattern_recognition",
      "validation"
    ],
    patterns: [
      {
        name: "CRUD Operations",
        description: "Create, Read, Update, Delete operations for entities",
        examples: ["Create user management", "Add product CRUD"],
        implementation: "Generates pages, services, repositories, and models"
      },
      {
        name: "Authentication",
        description: "User authentication and authorization",
        examples: ["Add login system", "Implement user registration"],
        implementation: "Generates auth pages, services, and components"
      }
    ],
    constraints: [
      {
        type: "security",
        rule: "All user data must be validated",
        severity: "high"
      },
      {
        type: "performance",
        rule: "Database queries must be optimized",
        severity: "medium"
      }
    ],
    metadata: {
      version: "1.0.0",
      lastTraining: new Date().toISOString(),
      accuracy: 0.95,
      confidence: 0.9
    }
  }
});

export const useCorisaStore = create<CorisaStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        schema: createInitialSchema(),
        chatHistory: [],
        currentView: 'chat',
        isLoading: false,
        error: null,
        yamlEditor: {
          content: '',
          isValid: true,
          errors: [],
          lastSaved: new Date(),
          isDirty: false
        },

        // New Context Management
        currentProject: null,
        contextFiles: [],
        selectedContextFile: null,
        isProjectLoaded: false,

        // Actions
        initializeSchema: () => {
          set({ schema: createInitialSchema() });
        },

        updateSchema: (schema: CorisaSchema) => {
          set({ 
            schema: {
              ...schema,
              app: {
                ...schema.app,
                metadata: {
                  ...schema.app.metadata,
                  lastModified: new Date().toISOString()
                }
              }
            }
          });
        },

        processPrompt: async (prompt: string) => {
          const { schema, addChatMessage, setLoading, setError, updateSchema } = get();
          
          try {
            setLoading(true);
            setError(null);

            // Add user message to chat
            addChatMessage({
              type: 'user',
              content: prompt
            });

            // Process prompt with AI engine
            const result = await generateYAMLFromPrompt(prompt, schema);
            
            if (result.success) {
              // Merge modifications with current schema
              const updatedSchema = mergeSchemaModifications(schema, result.modifications);
              updateSchema(updatedSchema);
              
              // Add AI response to chat
              addChatMessage({
                type: 'ai',
                content: result.explanation,
                metadata: {
                  generation: result
                }
              });
            } else {
              setError('Failed to process prompt: ' + result.explanation);
              addChatMessage({
                type: 'ai',
                content: 'Sorry, I encountered an error while processing your request. Please try again.'
              });
            }
          } catch (error) {
            setError(String(error));
            addChatMessage({
              type: 'ai',
              content: 'An unexpected error occurred. Please try again.'
            });
          } finally {
            setLoading(false);
          }
        },

        generateCode: async (request: any) => {
          const { schema } = get();
          return await generateCodeFromSchema(schema, request);
        },

        addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
          const newMessage: ChatMessage = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date()
          };
          
          set(state => ({
            chatHistory: [...state.chatHistory, newMessage]
          }));
        },

        setCurrentView: (view: 'chat' | 'yaml' | 'code' | 'preview' | 'context') => {
          set({ currentView: view });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        updateYAMLEditor: (content: string) => {
          const isValid = validateYAMLContent(content);
          set(state => ({
            yamlEditor: {
              ...state.yamlEditor,
              content,
              isValid,
              isDirty: true
            }
          }));
        },

        validateYAML: (content: string) => {
          return validateYAMLContent(content);
        },

        applyYAMLChanges: (content: string) => {
          try {
            const parsedSchema = JSON.parse(content);
            const { updateSchema } = get();
            updateSchema(parsedSchema);
            
            set(state => ({
              yamlEditor: {
                ...state.yamlEditor,
                content,
                isValid: true,
                errors: [],
                lastSaved: new Date(),
                isDirty: false
              }
            }));
          } catch (error) {
            set(state => ({
              yamlEditor: {
                ...state.yamlEditor,
                isValid: false,
                errors: [String(error)]
              }
            }));
          }
        },

        getSchemaSummary: () => {
          const { schema } = get();
          return {
            totalPages: schema.pages.length,
            totalSections: schema.sections.length,
            totalComponents: schema.components.length,
            totalServices: schema.services.length,
            totalRepositories: schema.repositories.length,
            totalModels: Object.keys(schema.models).length,
            complexity: schema.app.metadata.complexity,
            lastModified: schema.app.metadata.lastModified
          };
        },

        exportSchema: () => {
          const { schema } = get();
          return JSON.stringify(schema, null, 2);
        },

        importSchema: (yamlContent: string) => {
          try {
            const parsedSchema = JSON.parse(yamlContent);
            const { updateSchema } = get();
            updateSchema(parsedSchema);
          } catch (error) {
            set({ error: 'Failed to import schema: ' + String(error) });
          }
        },

        resetSchema: () => {
          set({ 
            schema: createInitialSchema(),
            chatHistory: [],
            error: null
          });
        },

        // Context File Actions
        createNewProject: (name: string, description: string, source: 'import' | 'new') => {
          const newProject: ProjectContext = {
            id: Date.now().toString(),
            name,
            description,
            files: [],
            createdAt: new Date(),
            lastModified: new Date(),
            metadata: {
              source,
              tags: []
            }
          };
          set({ 
            currentProject: newProject,
            contextFiles: [],
            selectedContextFile: null,
            isProjectLoaded: true
          });
        },

        importProject: async (files: FileList) => {
          const reader = new FileReader();
          reader.onload = async (event) => {
            if (event.target?.result) {
              try {
                const parsedContextFiles = JSON.parse(event.target.result as string);
                set({ 
                  contextFiles: parsedContextFiles,
                  selectedContextFile: parsedContextFiles[0] || null,
                  isProjectLoaded: true
                });
              } catch (error) {
                set({ error: 'Failed to import project: ' + String(error) });
              }
            }
          };
          reader.readAsText(files[0]);
        },

        addContextFile: (type: ContextFileType, name?: string) => {
          const template = CONTEXT_FILE_TEMPLATES[type];
          const newFile: ContextFile = {
            id: Date.now().toString(),
            type,
            name: name || template.displayName,
            displayName: template.displayName,
            description: template.description,
            content: template.defaultContent,
            order: get().contextFiles.length,
            lastModified: new Date(),
            isDirty: false
          };
          set(state => ({ 
            contextFiles: [...state.contextFiles, newFile],
            selectedContextFile: newFile
          }));
        },

        updateContextFile: (id: string, updates: Partial<ContextFile>) => {
          set(state => ({
            contextFiles: state.contextFiles.map(file => 
              file.id === id ? { ...file, ...updates, lastModified: new Date(), isDirty: true } : file
            )
          }));
          if (get().selectedContextFile?.id === id) {
            set(state => ({
              selectedContextFile: state.selectedContextFile ? 
                { ...state.selectedContextFile, ...updates, lastModified: new Date(), isDirty: true } : null
            }));
          }
        },

        deleteContextFile: (id: string) => {
          set(state => ({
            contextFiles: state.contextFiles.filter(file => file.id !== id),
            selectedContextFile: state.selectedContextFile?.id === id ? null : state.selectedContextFile
          }));
        },

        selectContextFile: (id: string) => {
          const file = get().contextFiles.find(file => file.id === id);
          set({ selectedContextFile: file || null });
        },

        reorderContextFiles: (fileIds: string[]) => {
          set(state => ({
            contextFiles: state.contextFiles.map((file, index) => ({
              ...file,
              order: fileIds.indexOf(file.id)
            })).sort((a, b) => a.order - b.order)
          }));
        },

        generateContextFileContent: async (fileId: string, prompt: string) => {
          const file = get().contextFiles.find(f => f.id === fileId);
          if (!file) return;

          try {
            set({ isLoading: true });
            const result = await generateYAMLFromPrompt(prompt, get().schema);
            
            if (result.success) {
              set(state => ({
                contextFiles: state.contextFiles.map(f => 
                  f.id === fileId ? { ...f, content: result.explanation, lastModified: new Date(), isDirty: true } : f
                )
              }));
              
              if (get().selectedContextFile?.id === fileId) {
                set(state => ({
                  selectedContextFile: state.selectedContextFile ? 
                    { ...state.selectedContextFile, content: result.explanation, lastModified: new Date(), isDirty: true } : null
                }));
              }
            } else {
              set({ error: 'Failed to generate content: ' + result.explanation });
            }
          } catch (error) {
            set({ error: 'Failed to generate content: ' + String(error) });
          } finally {
            set({ isLoading: false });
          }
        },

        exportContextFiles: () => {
          const { contextFiles } = get();
          return JSON.stringify(contextFiles, null, 2);
        },

        importContextFiles: (content: string) => {
          try {
            const parsedContextFiles = JSON.parse(content);
            set({ 
              contextFiles: parsedContextFiles,
              selectedContextFile: parsedContextFiles[0] || null,
              isProjectLoaded: true
            });
          } catch (error) {
            set({ error: 'Failed to import context files: ' + String(error) });
          }
        },

        getContextForAI: () => {
          const { contextFiles } = get();
          if (contextFiles.length === 0) return '';

          const context = contextFiles.map(file => ({
            name: file.displayName,
            description: file.description,
            content: file.content
          }));
          return JSON.stringify(context, null, 2);
        }
      }),
      { 
        name: 'corisa-store',
        partialize: (state) => ({
          schema: state.schema,
          chatHistory: state.chatHistory,
          currentView: state.currentView
        })
      }
    )
  )
);

// Helper functions
function mergeSchemaModifications(currentSchema: CorisaSchema, modifications: Partial<CorisaSchema>): CorisaSchema {
  return {
    ...currentSchema,
    ...modifications,
    pages: [...(currentSchema.pages || []), ...(modifications.pages || [])],
    sections: [...(currentSchema.sections || []), ...(modifications.sections || [])],
    components: [...(currentSchema.components || []), ...(modifications.components || [])],
    services: [...(currentSchema.services || []), ...(modifications.services || [])],
    repositories: [...(currentSchema.repositories || []), ...(modifications.repositories || [])],
    models: { ...currentSchema.models, ...(modifications.models || {}) }
  };
}

function validateYAMLContent(content: string): boolean {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}