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
  InsightFile, 
  ProjectInsights, 
  InsightFileType,
  INSIGHT_TEMPLATES,
  AIInsightReference,
  AIGenerationContext
} from '../types/insights';
import { generateYAMLFromPrompt, generateCodeFromSchema } from '../lib/ai-engine';
import modPlanSchema from '../../schema/mod-plan.schema.json';
import { SchemaValidator } from '../lib/schema-validator';
import { buildPlanFromModifications } from '../lib/mod-plan-builder';
import { applyModPlan } from '../lib/op-applier';

interface CorisaStore {
  // State
  schema: CorisaSchema;
  chatHistory: ChatMessage[];
  currentView: 'landing' | 'chat' | 'yaml' | 'code' | 'preview' | 'context' | 'memory';
  isLoading: boolean;
  error: string | null;
  yamlEditor: YAMLEditorState;
  
  // Insight Management
  currentProject: ProjectInsights | null;
  insightFiles: InsightFile[];
  selectedInsightFile: InsightFile | null;
  isProjectLoaded: boolean;
  aiGenerationContext: AIGenerationContext | null;

  // Actions
  initializeSchema: () => void;
  updateSchema: (schema: CorisaSchema) => void;
  processPrompt: (prompt: string) => Promise<void>;
  generateCode: (request: any) => Promise<CodeGenerationResult>;
  applyModPlan: (plan: any) => { success: boolean; report: any };
  applyModifications: (mods: Partial<CorisaSchema>) => { success: boolean; report: any };
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setCurrentView: (view: 'landing' | 'chat' | 'yaml' | 'code' | 'preview' | 'context' | 'memory') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateYAMLEditor: (content: string) => void;
  validateYAML: (content: string) => boolean;
  applyYAMLChanges: (content: string) => void;
  getSchemaSummary: () => SchemaSummary;
  exportSchema: () => string;
  importSchema: (yamlContent: string) => void;
  resetSchema: () => void;

  // Insight File Actions
  createNewProject: (name: string, description: string, source: 'import' | 'new') => void;
  importProject: (files: FileList) => Promise<void>;
  addInsightFile: (type: InsightFileType, name?: string) => void;
  updateInsightFile: (id: string, updates: Partial<InsightFile>) => void;
  deleteInsightFile: (id: string) => void;
  selectInsightFile: (id: string) => void;
  reorderInsightFiles: (fileIds: string[]) => void;
  generateInsightFileContent: (fileId: string, prompt: string) => Promise<void>;
  exportInsightFiles: () => string;
  importInsightFiles: (content: string) => void;
  getInsightsForAI: () => string;
  analyzeAIContext: (prompt: string) => AIGenerationContext;
  quickStartFromPrompt: (prompt: string) => Promise<void>;
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

        // Insight Management
        currentProject: null,
        insightFiles: [],
        selectedInsightFile: null,
        isProjectLoaded: false,
        aiGenerationContext: null,

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
          const { schema, addChatMessage, setLoading, setError, updateSchema, analyzeAIContext, applyModifications } = get();
          
          try {
            setLoading(true);
            setError(null);

            // Analyze AI context for transparency
            const aiContext = analyzeAIContext(prompt);

            // Add user message to chat
            addChatMessage({
              type: 'user',
              content: prompt
            });

            // Process prompt with AI engine
            const result = await generateYAMLFromPrompt(prompt, schema);
            
            if (result.success) {
              // Build and apply a plan from modifications for safety
              const applyRes = applyModifications(result.modifications);
              if (!applyRes.success) {
                const details = applyRes.report?.errors ? String(applyRes.report.errors.join('; ')) : 'Unknown error';
                setError('Failed to apply plan: ' + details);
              }

              // Add AI response to chat with context
              addChatMessage({
                type: 'ai',
                content: result.explanation,
                metadata: {
                  generation: result
                },
                aiContext: {
                  referencedInsights: aiContext.referencedInsights,
                  missingInsights: aiContext.missingInsights,
                  contextSummary: aiContext.contextSummary
                }
              });
            } else {
              setError('Failed to process prompt: ' + result.explanation);
              addChatMessage({
                type: 'ai',
                content: 'Sorry, I encountered an error while processing your request. Please try again.',
                aiContext: {
                  referencedInsights: aiContext.referencedInsights,
                  missingInsights: aiContext.missingInsights,
                  contextSummary: aiContext.contextSummary
                }
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

        applyModPlan: (plan: any) => {
          try {
            const validator = new SchemaValidator(modPlanSchema as any);
            const valid = validator.validateModPlan(plan);
            if (!valid.valid) {
              return { success: false, report: { errors: valid.errors } };
            }
            const { schema, report } = applyModPlan(get().schema, plan);
            // Fix-up: auto-create placeholder sections for any missing references
            const sectionIds = new Set(schema.sections.map(s => s.id));
            const placeholders: any[] = [];
            schema.pages.forEach(p => {
              (p.sections || []).forEach(ref => {
                if (!sectionIds.has(ref)) {
                  sectionIds.add(ref);
                  placeholders.push({
                    id: ref,
                    title: ref.replace(/_/g, ' '),
                    description: 'Auto-created placeholder section',
                    type: 'card',
                    components: [],
                    layout: 'vertical',
                    metadata: { responsive: true, collapsible: false, sortable: false, filterable: false, pagination: false }
                  });
                }
              });
            });
            if (placeholders.length > 0) {
              schema.sections = [...schema.sections, ...placeholders];
            }
            const referential = validator.checkReferentialIntegrity(schema);
            if (!referential.valid) {
              return { success: false, report: { errors: referential.errors } };
            }
            get().updateSchema(schema);
            return { success: true, report };
          } catch (e: any) {
            return { success: false, report: { errors: [String(e?.message || e)] } };
          }
        },

        applyModifications: (mods: Partial<CorisaSchema>) => {
          const plan = buildPlanFromModifications(mods, get().schema);
          return get().applyModPlan(plan);
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

        setCurrentView: (view: 'landing' | 'chat' | 'yaml' | 'code' | 'preview' | 'context' | 'memory') => {
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

        // Insight File Actions
        createNewProject: (name: string, description: string, source: 'import' | 'new') => {
          const newProject: ProjectInsights = {
            id: Date.now().toString(),
            name,
            description,
            files: [],
            createdAt: new Date(),
            lastModified: new Date(),
            metadata: {
              source,
              tags: [],
              aiContext: ''
            }
          };
          set({ 
            currentProject: newProject,
            insightFiles: [],
            selectedInsightFile: null,
            isProjectLoaded: true
          });
        },

        importProject: async (files: FileList) => {
          const reader = new FileReader();
          reader.onload = async (event) => {
            if (event.target?.result) {
              try {
                const parsedInsightFiles = JSON.parse(event.target.result as string);
                set({ 
                  insightFiles: parsedInsightFiles,
                  selectedInsightFile: parsedInsightFiles[0] || null,
                  isProjectLoaded: true
                });
              } catch (error) {
                set({ error: 'Failed to import project: ' + String(error) });
              }
            }
          };
          reader.readAsText(files[0]);
        },

        addInsightFile: (type: InsightFileType, name?: string) => {
          const template = INSIGHT_TEMPLATES[type];
          const newFile: InsightFile = {
            id: Date.now().toString(),
            type,
            name: name || template.displayName,
            displayName: template.displayName,
            description: template.description,
            content: template.defaultContent,
            order: get().insightFiles.length,
            lastModified: new Date(),
            isDirty: false,
            metadata: {
              category: template.category,
              priority: template.priority,
              tags: template.suggestedTags,
              relatedFiles: []
            },
            aiReferences: []
          };
          set(state => ({ 
            insightFiles: [...state.insightFiles, newFile],
            selectedInsightFile: newFile
          }));
        },

        updateInsightFile: (id: string, updates: Partial<InsightFile>) => {
          set(state => ({
            insightFiles: state.insightFiles.map(file => 
              file.id === id ? { ...file, ...updates, lastModified: new Date(), isDirty: true } : file
            )
          }));
          if (get().selectedInsightFile?.id === id) {
            set(state => ({
              selectedInsightFile: state.selectedInsightFile ? 
                { ...state.selectedInsightFile, ...updates, lastModified: new Date(), isDirty: true } : null
            }));
          }
        },

        deleteInsightFile: (id: string) => {
          set(state => ({
            insightFiles: state.insightFiles.filter(file => file.id !== id),
            selectedInsightFile: state.selectedInsightFile?.id === id ? null : state.selectedInsightFile
          }));
        },

        selectInsightFile: (id: string) => {
          const file = get().insightFiles.find(file => file.id === id);
          set({ selectedInsightFile: file || null });
        },

        reorderInsightFiles: (fileIds: string[]) => {
          set(state => ({
            insightFiles: state.insightFiles.map((file, index) => ({
              ...file,
              order: fileIds.indexOf(file.id)
            })).sort((a, b) => a.order - b.order)
          }));
        },

        generateInsightFileContent: async (fileId: string, prompt: string) => {
          const file = get().insightFiles.find(f => f.id === fileId);
          if (!file) return;

          try {
            set({ isLoading: true });
            const result = await generateYAMLFromPrompt(prompt, get().schema);
            
            if (result.success) {
              set(state => ({
                insightFiles: state.insightFiles.map(f => 
                  f.id === fileId ? { ...f, content: result.explanation, lastModified: new Date(), isDirty: true } : f
                )
              }));
              
              if (get().selectedInsightFile?.id === fileId) {
                set(state => ({
                  selectedInsightFile: state.selectedInsightFile ? 
                    { ...state.selectedInsightFile, content: result.explanation, lastModified: new Date(), isDirty: true } : null
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

        exportInsightFiles: () => {
          const { insightFiles } = get();
          return JSON.stringify(insightFiles, null, 2);
        },

        importInsightFiles: (content: string) => {
          try {
            const parsedInsightFiles = JSON.parse(content);
            set({ 
              insightFiles: parsedInsightFiles,
              selectedInsightFile: parsedInsightFiles[0] || null,
              isProjectLoaded: true
            });
          } catch (error) {
            set({ error: 'Failed to import insight files: ' + String(error) });
          }
        },

        getInsightsForAI: () => {
          const { insightFiles } = get();
          if (insightFiles.length === 0) return '';

          const context = insightFiles.map(file => ({
            name: file.displayName,
            description: file.description,
            content: file.content,
            category: file.metadata.category,
            priority: file.metadata.priority
          }));
          return JSON.stringify(context, null, 2);
        },

        analyzeAIContext: (prompt: string) => {
          const { insightFiles } = get();
          const referencedInsights: AIInsightReference[] = [];
          const missingInsights: string[] = [];

          // Simple keyword matching to find relevant insights
          const promptLower = prompt.toLowerCase();
          
          insightFiles.forEach(file => {
            const contentLower = file.content.toLowerCase();
            const nameLower = file.displayName.toLowerCase();
            
            // Check if insight is relevant based on content and name
            const relevance = 
              contentLower.includes(promptLower) || 
              nameLower.includes(promptLower) ? 'high' :
              contentLower.includes(promptLower.split(' ')[0]) ? 'medium' : 'low';
            
            if (relevance !== 'low') {
              referencedInsights.push({
                insightId: file.id,
                insightName: file.displayName,
                relevance,
                context: `Relevant content from ${file.displayName}`
              });
            }
          });

          // Suggest missing insights based on prompt
          if (promptLower.includes('login') || promptLower.includes('auth')) {
            if (!insightFiles.find(f => f.type === 'features-spec')) {
              missingInsights.push('Features Specification');
            }
          }
          if (promptLower.includes('api') || promptLower.includes('endpoint')) {
            if (!insightFiles.find(f => f.type === 'api-specification')) {
              missingInsights.push('API Specification');
            }
          }

          const contextSummary = referencedInsights.length > 0 
            ? `Using ${referencedInsights.length} insight files for context`
            : 'No relevant insights found';

          const aiContext: AIGenerationContext = {
            referencedInsights,
            missingInsights,
            contextSummary
          };

          set({ aiGenerationContext: aiContext });
          return aiContext;
        },

        // NEW: Quick start from a single prompt
        quickStartFromPrompt: async (prompt: string) => {
          const { isProjectLoaded, createNewProject, addInsightFile, generateInsightFileContent, setCurrentView, processPrompt } = get();

          // Ensure a project exists
          if (!isProjectLoaded) {
            createNewProject('New Project', prompt.slice(0, 2000), 'new');
          }

          // Seed essential insight files if missing
          const requiredTypes: InsightFileType[] = ['project-overview', 'features-spec', 'current-progress'];
          const existing = get().insightFiles;

          for (const type of requiredTypes) {
            if (!existing.find(f => f.type === type)) {
              addInsightFile(type);
            }
          }

          // Generate content for key insights using the prompt
          const refreshed = get().insightFiles;
          const overview = refreshed.find(f => f.type === 'project-overview');
          const features = refreshed.find(f => f.type === 'features-spec');

          if (overview) {
            await generateInsightFileContent(overview.id, `Create a clear Project Overview using this description: ${prompt}`);
          }
          if (features) {
            await generateInsightFileContent(features.id, `List features and user stories based on: ${prompt}`);
          }

          // Switch to chat and kick off AI planning for schema/code
          setCurrentView('chat');
          await processPrompt(prompt);
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