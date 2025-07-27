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
import { generateYAMLFromPrompt, generateCodeFromSchema } from '../lib/ai-engine';

interface CorisaStore {
  // State
  schema: CorisaSchema;
  chatHistory: ChatMessage[];
  currentView: 'chat' | 'yaml' | 'code' | 'preview';
  isLoading: boolean;
  error: string | null;
  yamlEditor: YAMLEditorState;

  // Actions
  initializeSchema: () => void;
  updateSchema: (schema: CorisaSchema) => void;
  processPrompt: (prompt: string) => Promise<void>;
  generateCode: (request: any) => Promise<CodeGenerationResult>;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setCurrentView: (view: 'chat' | 'yaml' | 'code' | 'preview') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateYAMLEditor: (content: string) => void;
  validateYAML: (content: string) => boolean;
  applyYAMLChanges: (content: string) => void;
  getSchemaSummary: () => SchemaSummary;
  exportSchema: () => string;
  importSchema: (yamlContent: string) => void;
  resetSchema: () => void;
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
                  analysis: result.validation,
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
            setError(error.message);
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

        setCurrentView: (view: 'chat' | 'yaml' | 'code' | 'preview') => {
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
                errors: [error.message]
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
            set({ error: 'Failed to import schema: ' + error.message });
          }
        },

        resetSchema: () => {
          set({ 
            schema: createInitialSchema(),
            chatHistory: [],
            error: null
          });
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