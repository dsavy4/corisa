import { 
  CorisaSchema, 
  GenerationResult, 
  CodeGenerationResult, 
  PromptAnalysis,
  Page, Section, Component, Service, Repository, Button, Model
} from '../types/corisa';

export class CorisaAIEngine {
  private static instance: CorisaAIEngine;
  
  private constructor() {}
  
  static getInstance(): CorisaAIEngine {
    if (!CorisaAIEngine.instance) {
      CorisaAIEngine.instance = new CorisaAIEngine();
    }
    return CorisaAIEngine.instance;
  }

  async generateYAMLFromPrompt(prompt: string, currentSchema: CorisaSchema): Promise<GenerationResult> {
    try {
      // Step 1: Analyze the prompt
      const analysis = await this.analyzePrompt(prompt);
      
      // Step 2: Generate modifications based on analysis
      const modifications = await this.generateModifications(prompt, analysis, currentSchema);
      
      // Step 3: Validate the modifications
      const validation = await this.validateModifications(modifications, currentSchema);
      
      // Step 4: Prepare result
      const result: GenerationResult = {
        success: validation.valid,
        modifications,
        newEntities: this.extractNewEntities(modifications),
        modifiedEntities: this.extractModifiedEntities(modifications, currentSchema),
        removedEntities: this.extractRemovedEntities(modifications),
        validation,
        explanation: this.generateExplanation(analysis, modifications)
      };
      
      return result;
    } catch (error) {
      return {
        success: false,
        modifications: {},
        newEntities: [],
        modifiedEntities: [],
        removedEntities: [],
        validation: {
          valid: false,
          errors: [{ entity: 'ai_engine', field: 'processing', message: String(error), severity: 'error' }],
          warnings: []
        },
        explanation: 'Failed to process the prompt due to an error.'
      };
    }
  }

  private async analyzePrompt(prompt: string): Promise<PromptAnalysis> {
    const lowerPrompt = prompt.toLowerCase();
    
    // Analyze intent
    let intent: PromptAnalysis['intent'] = 'query';
    if (lowerPrompt.includes('create') || lowerPrompt.includes('add') || lowerPrompt.includes('new')) {
      intent = 'create';
    } else if (lowerPrompt.includes('modify') || lowerPrompt.includes('change') || lowerPrompt.includes('update')) {
      intent = 'modify';
    } else if (lowerPrompt.includes('delete') || lowerPrompt.includes('remove')) {
      intent = 'delete';
    } else if (lowerPrompt.includes('evolve') || lowerPrompt.includes('enhance') || lowerPrompt.includes('improve')) {
      intent = 'evolve';
    }

    // Extract entities
    const entities: string[] = [];
    const entityKeywords = {
      'page': ['page', 'screen', 'view', 'dashboard', 'form', 'list'],
      'section': ['section', 'component', 'widget', 'card', 'table', 'chart'],
      'service': ['service', 'api', 'function', 'logic'],
      'repository': ['repository', 'data', 'database', 'model'],
      'component': ['component', 'ui', 'button', 'input', 'form'],
      'menu': ['menu', 'navigation', 'sidebar'],
      'model': ['model', 'entity', 'data structure']
    };

    for (const [entity, keywords] of Object.entries(entityKeywords)) {
      if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
        entities.push(entity);
      }
    }

    // Extract actions
    const actions: string[] = [];
    const actionKeywords = {
      'authentication': ['login', 'auth', 'user', 'password', 'signin', 'signup'],
      'crud': ['create', 'read', 'update', 'delete', 'crud'],
      'navigation': ['navigate', 'route', 'link', 'menu'],
      'validation': ['validate', 'check', 'verify'],
      'search': ['search', 'filter', 'find'],
      'export': ['export', 'download', 'print']
    };

    for (const [action, keywords] of Object.entries(actionKeywords)) {
      if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
        actions.push(action);
      }
    }

    return {
      intent,
      entities,
      actions,
      context: this.extractContext(prompt),
      confidence: this.calculateConfidence(prompt, entities, actions)
    };
  }

  private async generateModifications(
    prompt: string, 
    analysis: PromptAnalysis, 
    currentSchema: CorisaSchema
  ): Promise<Partial<CorisaSchema>> {
    let modifications: Partial<CorisaSchema> = {};

    if (analysis.intent === 'create') {
      modifications = this.generateModificationsForNew(prompt, analysis, currentSchema);
    } else if (analysis.intent === 'modify' || analysis.intent === 'evolve') {
      modifications = this.generateModificationsForExisting(prompt, currentSchema);
    }

    return modifications;
  }

  private generateModificationsForNew(
    prompt: string, 
    analysis: PromptAnalysis, 
    currentSchema: CorisaSchema
  ): Partial<CorisaSchema> {
    const modifications: Partial<CorisaSchema> = {};

    // Handle authentication requests
    if (analysis.actions.includes('authentication')) {
      const authPages = this.generateAuthPages();
      const authSections: Section[] = [
        {
          id: 'login_form_section',
          title: 'Login Form',
          description: 'User login form',
          type: 'form',
          components: [],
          layout: 'vertical',
          metadata: { responsive: true, collapsible: false, sortable: false, filterable: false, pagination: false }
        },
        {
          id: 'register_form_section',
          title: 'Register Form',
          description: 'User registration form',
          type: 'form',
          components: [],
          layout: 'vertical',
          metadata: { responsive: true, collapsible: false, sortable: false, filterable: false, pagination: false }
        }
      ];
      modifications.pages = [
        ...(currentSchema.pages || []),
        ...authPages
      ];
      modifications.sections = [
        ...(currentSchema.sections || []),
        ...authSections
      ];
      modifications.services = [
        ...(currentSchema.services || []),
        this.generateAuthService()
      ];
      modifications.components = [
        ...(currentSchema.components || []),
        ...this.generateAuthComponents()
      ];
    }

    // Handle CRUD operations
    if (analysis.actions.includes('crud')) {
      const entityName = this.extractEntityName(prompt);
      if (entityName) {
        const pages = this.generateCRUDPages(entityName);
        const listSectionId = `${entityName}_list_section`;
        const detailSectionId = `${entityName}_detail_section`;
        const sections: Section[] = [
          {
            id: listSectionId,
            title: `${entityName} List`,
            description: `List ${entityName}s`,
            type: 'list',
            components: [],
            layout: 'vertical',
            metadata: { responsive: true, collapsible: false, sortable: true, filterable: true, pagination: true }
          },
          {
            id: detailSectionId,
            title: `${entityName} Detail`,
            description: `Detail view for ${entityName}`,
            type: 'card',
            components: [],
            layout: 'vertical',
            metadata: { responsive: true, collapsible: false, sortable: false, filterable: false, pagination: false }
          }
        ];
        modifications.pages = [
          ...(currentSchema.pages || []),
          ...pages
        ];
        modifications.sections = [
          ...(currentSchema.sections || []),
          ...sections
        ];
        modifications.services = [
          ...(currentSchema.services || []),
          this.generateCRUDService(entityName)
        ];
        modifications.repositories = [
          ...(currentSchema.repositories || []),
          this.generateCRUDRepository(entityName)
        ];
        modifications.models = {
          ...currentSchema.models,
          [entityName]: this.generateModel(entityName)
        };
      }
    }

    return modifications;
  }

  private generateModificationsForExisting(prompt: string, currentSchema: CorisaSchema): Partial<CorisaSchema> {
    const modifications: Partial<CorisaSchema> = {};

    // Analyze existing structure and suggest improvements
    if (prompt.toLowerCase().includes('dashboard')) {
      modifications.pages = currentSchema.pages.map(page => {
        if (page.id === 'dashboard_page') {
          return {
            ...page,
            sections: [...page.sections, 'analytics_section', 'recent_activity_section']
          };
        }
        return page;
      });
    }

    return modifications;
  }

  private generateAuthPages(): Page[] {
    return [
      {
        id: 'login_page',
        title: 'Login',
        description: 'User authentication page',
        route: '/login',
        sections: ['login_form_section'],
        layout: 'form',
        metadata: {
          requiresAuth: false,
          permissions: [],
          breadcrumbs: ['Login'],
          seo: {
            title: 'Login',
            description: 'Sign in to your account',
            keywords: ['login', 'authentication', 'signin']
          }
        }
      },
      {
        id: 'register_page',
        title: 'Register',
        description: 'User registration page',
        route: '/register',
        sections: ['register_form_section'],
        layout: 'form',
        metadata: {
          requiresAuth: false,
          permissions: [],
          breadcrumbs: ['Register'],
          seo: {
            title: 'Register',
            description: 'Create a new account',
            keywords: ['register', 'signup', 'create account']
          }
        }
      }
    ];
  }

  private generateAuthService(): Service {
    return {
      id: 'auth_service',
      name: 'AuthenticationService',
      description: 'Handles user authentication and authorization',
      methods: [
        {
          name: 'login',
          description: 'Authenticate user with credentials',
          parameters: [
            { name: 'email', type: 'string', required: true },
            { name: 'password', type: 'string', required: true }
          ],
          returnType: 'Promise<AuthResult>',
          async: true
        },
        {
          name: 'register',
          description: 'Register new user',
          parameters: [
            { name: 'userData', type: 'UserData', required: true }
          ],
          returnType: 'Promise<User>',
          async: true
        },
        {
          name: 'logout',
          description: 'Logout current user',
          parameters: [],
          returnType: 'Promise<void>',
          async: true
        }
      ],
      dependencies: ['user_repository'],
      metadata: {
        version: '1.0.0',
        author: 'Corisa AI',
        documentation: 'Authentication service for user management',
        testing: true
      }
    };
  }

  private generateAuthComponents(): Component[] {
    return [
      {
        id: 'login_form',
        name: 'LoginForm',
        type: 'form',
        category: 'authentication',
        props: [
          { name: 'onSubmit', type: 'object', required: true, description: 'Form submission handler' },
          { name: 'loading', type: 'boolean', required: false, defaultValue: false, description: 'Loading state' }
        ],
        events: [
          { name: 'submit', description: 'Form submitted', payload: { email: 'string', password: 'string' } }
        ],
        styles: {
          className: 'login-form',
          variants: { size: 'sm', theme: 'dark' },
          responsive: true
        },
        metadata: {
          reusable: true,
          testable: true,
          accessible: true,
          performance: 'high'
        }
      }
    ];
  }

  private generateCRUDPages(entityName: string): Page[] {
    const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    return [
      {
        id: `${entityName}_list_page`,
        title: `${capitalizedEntity} List`,
        description: `List of all ${entityName}s`,
        route: `/${entityName}s`,
        sections: [`${entityName}_list_section`],
        layout: 'list',
        metadata: {
          requiresAuth: true,
          permissions: [`read_${entityName}`],
          breadcrumbs: [capitalizedEntity + 's'],
          seo: {
            title: `${capitalizedEntity} List`,
            description: `Manage ${entityName}s`,
            keywords: [entityName, 'list', 'manage']
          }
        }
      },
      {
        id: `${entityName}_detail_page`,
        title: `${capitalizedEntity} Detail`,
        description: `View ${entityName} details`,
        route: `/${entityName}s/:id`,
        sections: [`${entityName}_detail_section`],
        layout: 'default',
        metadata: {
          requiresAuth: true,
          permissions: [`read_${entityName}`],
          breadcrumbs: [capitalizedEntity + 's', 'Detail'],
          seo: {
            title: `${capitalizedEntity} Detail`,
            description: `View ${entityName} information`,
            keywords: [entityName, 'detail', 'view']
          }
        }
      }
    ];
  }

  private generateCRUDService(entityName: string): Service {
    const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    return {
      id: `${entityName}_service`,
      name: `${capitalizedEntity}Service`,
      description: `Service for managing ${entityName}s`,
      methods: [
        {
          name: 'getAll',
          description: `Get all ${entityName}s`,
          parameters: [
            { name: 'filters', type: 'object', required: false },
            { name: 'pagination', type: 'object', required: false }
          ],
          returnType: `Promise<${capitalizedEntity}[]>`,
          async: true
        },
        {
          name: 'getById',
          description: `Get ${entityName} by ID`,
          parameters: [
            { name: 'id', type: 'string', required: true }
          ],
          returnType: `Promise<${capitalizedEntity}>`,
          async: true
        },
        {
          name: 'create',
          description: `Create new ${entityName}`,
          parameters: [
            { name: 'data', type: `${capitalizedEntity}Data`, required: true }
          ],
          returnType: `Promise<${capitalizedEntity}>`,
          async: true
        },
        {
          name: 'update',
          description: `Update ${entityName}`,
          parameters: [
            { name: 'id', type: 'string', required: true },
            { name: 'data', type: `${capitalizedEntity}Data`, required: true }
          ],
          returnType: `Promise<${capitalizedEntity}>`,
          async: true
        },
        {
          name: 'delete',
          description: `Delete ${entityName}`,
          parameters: [
            { name: 'id', type: 'string', required: true }
          ],
          returnType: 'Promise<void>',
          async: true
        }
      ],
      dependencies: [`${entityName}_repository`],
      metadata: {
        version: '1.0.0',
        author: 'Corisa AI',
        documentation: `Service for ${entityName} management`,
        testing: true
      }
    };
  }

  private generateCRUDRepository(entityName: string): Repository {
    const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    return {
      id: `${entityName}_repository`,
      name: `${capitalizedEntity}Repository`,
      description: `Repository for ${entityName} data operations`,
      model: entityName,
      methods: [
        {
          name: 'findAll',
          description: `Find all ${entityName}s`,
          type: 'read',
          parameters: [
            { name: 'options', type: 'object', required: false, description: 'Query options' }
          ],
          returnType: `${capitalizedEntity}[]`
        },
        {
          name: 'findById',
          description: `Find ${entityName} by ID`,
          type: 'read',
          parameters: [
            { name: 'id', type: 'string', required: true, description: 'Entity ID' }
          ],
          returnType: `${capitalizedEntity}`
        },
        {
          name: 'create',
          description: `Create new ${entityName}`,
          type: 'create',
          parameters: [
            { name: 'data', type: `${capitalizedEntity}Data`, required: true, description: 'Entity data' }
          ],
          returnType: `${capitalizedEntity}`
        },
        {
          name: 'update',
          description: `Update ${entityName}`,
          type: 'update',
          parameters: [
            { name: 'id', type: 'string', required: true, description: 'Entity ID' },
            { name: 'data', type: `${capitalizedEntity}Data`, required: true, description: 'Update data' }
          ],
          returnType: `${capitalizedEntity}`
        },
        {
          name: 'delete',
          description: `Delete ${entityName}`,
          type: 'delete',
          parameters: [
            { name: 'id', type: 'string', required: true, description: 'Entity ID' }
          ],
          returnType: 'void'
        }
      ],
      metadata: {
        database: 'postgresql',
        table: entityName + 's',
        indexes: [`idx_${entityName}_id`, `idx_${entityName}_created_at`],
        constraints: [`fk_${entityName}_user_id`]
      }
    };
  }

  private generateModel(entityName: string): Model {
    const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    return {
      id: entityName,
      name: capitalizedEntity,
      description: `${capitalizedEntity} data model`,
      fields: [
        {
          name: 'id',
          type: 'string',
          required: true,
          unique: true,
          validation: { pattern: '^[a-zA-Z0-9-]+$' }
        },
        {
          name: 'name',
          type: 'string',
          required: true,
          unique: false,
          validation: { min: 1, max: 255 }
        },
        {
          name: 'description',
          type: 'string',
          required: false,
          unique: false,
          validation: { max: 1000 }
        },
        {
          name: 'createdAt',
          type: 'date',
          required: true,
          unique: false,
          validation: {}
        },
        {
          name: 'updatedAt',
          type: 'date',
          required: true,
          unique: false,
          validation: {}
        }
      ],
      relationships: [
        {
          type: 'one-to-many',
          target: 'user',
          foreignKey: 'userId',
          cascade: false
        }
      ],
      metadata: {
        timestamps: true,
        softDelete: true,
        audit: true
      }
    };
  }

  private extractEntityName(prompt: string): string | null {
    const words = prompt.toLowerCase().split(' ');
    const entityKeywords = ['user', 'project', 'task', 'product', 'order', 'customer', 'item'];
    
    for (const word of words) {
      if (entityKeywords.includes(word)) {
        return word;
      }
    }
    
    return null;
  }

  private extractContext(prompt: string): string {
    // Extract relevant context from the prompt
    const contextKeywords = ['dashboard', 'admin', 'user', 'public', 'private', 'mobile', 'desktop'];
    const foundContext = contextKeywords.filter(keyword => prompt.toLowerCase().includes(keyword));
    return foundContext.join(', ') || 'general';
  }

  private calculateConfidence(prompt: string, entities: string[], actions: string[]): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on entity detection
    confidence += entities.length * 0.1;
    
    // Increase confidence based on action detection
    confidence += actions.length * 0.1;
    
    // Increase confidence for longer, more specific prompts
    if (prompt.length > 50) confidence += 0.1;
    if (prompt.length > 100) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private extractNewEntities(modifications: Partial<CorisaSchema>): string[] {
    const newEntities: string[] = [];
    
    if (modifications.pages) {
      newEntities.push(...modifications.pages.map(p => p.id));
    }
    if (modifications.services) {
      newEntities.push(...modifications.services.map(s => s.id));
    }
    if (modifications.repositories) {
      newEntities.push(...modifications.repositories.map(r => r.id));
    }
    if (modifications.models) {
      newEntities.push(...Object.keys(modifications.models));
    }
    
    return newEntities;
  }

  private extractModifiedEntities(modifications: Partial<CorisaSchema>, currentSchema: CorisaSchema): string[] {
    // This would compare modifications with current schema
    // For now, return empty array
    return [];
  }

  private extractRemovedEntities(modifications: Partial<CorisaSchema>): string[] {
    // This would identify entities that are being removed
    // For now, return empty array
    return [];
  }

  private async validateModifications(modifications: Partial<CorisaSchema>, currentSchema: CorisaSchema): Promise<any> {
    const errors: any[] = [];
    const warnings: any[] = [];
    
    // Basic validation
    if (modifications.pages) {
      for (const page of modifications.pages) {
        if (!page.id || !page.title) {
          errors.push({
            entity: 'page',
            field: page.id || 'unknown',
            message: 'Page must have id and title',
            severity: 'error'
          });
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private generateExplanation(analysis: PromptAnalysis, modifications: Partial<CorisaSchema>): string {
    const newEntities = this.extractNewEntities(modifications);
    const summary = `Intent: ${analysis.intent}. Entities: ${analysis.entities.join(', ') || 'none'}. Actions: ${analysis.actions.join(', ') || 'none'}.`;
    return `${summary} Created/updated: ${newEntities.join(', ') || 'none'}.`;
  }
}

export class CorisaCodeGenerator {
  static async generateCodeFromSchema(schema: CorisaSchema, request: any): Promise<CodeGenerationResult> {
    return {
      frontend: this.generateFrontendCode(schema),
      backend: this.generateBackendCode(schema),
      database: this.generateDatabaseCode(schema),
      configuration: this.generateConfigurationCode(schema),
      documentation: this.generateDocumentationCode(schema)
    };
  }

  private static generateFrontendCode(schema: CorisaSchema): any[] {
    // Generate React/Next.js components
    return [
      {
        path: 'src/components/App.tsx',
        content: `// Generated by Corisa AI\nimport React from 'react';\n// App component code here`,
        language: 'typescript',
        dependencies: ['react', 'next']
      }
    ];
  }

  private static generateBackendCode(schema: CorisaSchema): any[] {
    // Generate backend API code
    return [
      {
        path: 'src/api/index.ts',
        content: `// Generated by Corisa AI\n// API routes code here`,
        language: 'typescript',
        dependencies: ['express', 'cors']
      }
    ];
  }

  private static generateDatabaseCode(schema: CorisaSchema): any[] {
    // Generate database schema
    return [
      {
        path: 'database/schema.sql',
        content: `-- Generated by Corisa AI\n-- Database schema here`,
        language: 'sql',
        dependencies: []
      }
    ];
  }

  private static generateConfigurationCode(schema: CorisaSchema): any[] {
    return [
      {
        path: 'config/app.config.ts',
        content: `// Generated by Corisa AI\n// Configuration code here`,
        language: 'typescript',
        dependencies: []
      }
    ];
  }

  private static generateDocumentationCode(schema: CorisaSchema): any[] {
    return [
      {
        path: 'docs/README.md',
        content: `# Generated by Corisa AI\n\n## Application Documentation\n\nThis application was generated using Corisa AI.`,
        language: 'markdown',
        dependencies: []
      }
    ];
  }
}

// Export convenience functions
export const generateYAMLFromPrompt = async (prompt: string, schema: CorisaSchema): Promise<GenerationResult> => {
  const engine = CorisaAIEngine.getInstance();
  return engine.generateYAMLFromPrompt(prompt, schema);
};

export const generateCodeFromSchema = async (schema: CorisaSchema, request: any): Promise<CodeGenerationResult> => {
  return CorisaCodeGenerator.generateCodeFromSchema(schema, request);
};