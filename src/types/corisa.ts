// Core Corisa Schema Types
export interface CorisaApp {
  name: string;
  version: string;
  description: string;
  metadata: AppMetadata;
}

export interface AppMetadata {
  author: string;
  created: string;
  lastModified: string;
  tags: string[];
  complexity: 'simple' | 'medium' | 'complex';
}

export interface Menu {
  id: string;
  label: string;
  icon?: string;
  items: MenuItem[];
  order: number;
  visible: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  pageId: string;
  order: number;
  visible: boolean;
}

export interface Page {
  id: string;
  title: string;
  description: string;
  route: string;
  sections: string[];
  layout: 'default' | 'dashboard' | 'form' | 'list';
  metadata: PageMetadata;
}

export interface PageMetadata {
  requiresAuth: boolean;
  permissions: string[];
  breadcrumbs: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface Section {
  id: string;
  title: string;
  description: string;
  type: 'table' | 'form' | 'card' | 'chart' | 'list' | 'grid';
  components: string[];
  layout: 'vertical' | 'horizontal' | 'grid';
  metadata: SectionMetadata;
}

export interface SectionMetadata {
  responsive: boolean;
  collapsible: boolean;
  sortable: boolean;
  filterable: boolean;
  pagination: boolean;
}

export interface Component {
  id: string;
  name: string;
  type: 'ui' | 'form' | 'data' | 'layout';
  category: string;
  props: ComponentProp[];
  events: ComponentEvent[];
  styles: ComponentStyle;
  metadata: ComponentMetadata;
}

export interface ComponentProp {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  description: string;
}

export interface ComponentEvent {
  name: string;
  description: string;
  payload: any;
}

export interface ComponentStyle {
  className: string;
  variants: Record<string, string>;
  responsive: boolean;
}

export interface ComponentMetadata {
  reusable: boolean;
  testable: boolean;
  accessible: boolean;
  performance: 'low' | 'medium' | 'high';
}

export interface Button {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  icon?: string;
  action: ButtonAction;
  metadata: ButtonMetadata;
}

export interface ButtonAction {
  type: 'navigate' | 'submit' | 'modal' | 'api' | 'function';
  target: string;
  parameters: Record<string, any>;
}

export interface ButtonMetadata {
  loading: boolean;
  disabled: boolean;
  confirmation: boolean;
  analytics: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  methods: ServiceMethod[];
  dependencies: string[];
  metadata: ServiceMetadata;
}

export interface ServiceMethod {
  name: string;
  description: string;
  parameters: ServiceParameter[];
  returnType: string;
  async: boolean;
}

export interface ServiceParameter {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
}

export interface ServiceMetadata {
  version: string;
  author: string;
  documentation: string;
  testing: boolean;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  model: string;
  methods: RepositoryMethod[];
  metadata: RepositoryMetadata;
}

export interface RepositoryMethod {
  name: string;
  description: string;
  type: 'create' | 'read' | 'update' | 'delete' | 'custom';
  parameters: RepositoryParameter[];
  returnType: string;
}

export interface RepositoryParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface RepositoryMetadata {
  database: string;
  table: string;
  indexes: string[];
  constraints: string[];
}

export interface Model {
  id: string;
  name: string;
  description: string;
  fields: ModelField[];
  relationships: ModelRelationship[];
  metadata: ModelMetadata;
}

export interface ModelField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  unique: boolean;
  defaultValue?: any;
  validation: FieldValidation;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string;
}

export interface ModelRelationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  target: string;
  foreignKey: string;
  cascade: boolean;
}

export interface ModelMetadata {
  timestamps: boolean;
  softDelete: boolean;
  audit: boolean;
}

export interface AIAgent {
  capabilities: string[];
  patterns: AIPattern[];
  constraints: AIConstraint[];
  metadata: AIMetadata;
}

export interface AIPattern {
  name: string;
  description: string;
  examples: string[];
  implementation: string;
}

export interface AIConstraint {
  type: 'security' | 'performance' | 'compatibility' | 'business';
  rule: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AIMetadata {
  version: string;
  lastTraining: string;
  accuracy: number;
  confidence: number;
}

// AI Generation Types
export interface PromptAnalysis {
  intent: 'create' | 'modify' | 'delete' | 'query' | 'evolve';
  entities: string[];
  actions: string[];
  context: string;
  confidence: number;
}

export interface GenerationResult {
  success: boolean;
  modifications: Partial<CorisaSchema>;
  newEntities: string[];
  modifiedEntities: string[];
  removedEntities: string[];
  validation: ValidationResult;
  explanation: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  entity: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  entity: string;
  field: string;
  message: string;
  suggestion: string;
}

export interface CodeGenerationResult {
  frontend: CodeFile[];
  backend: CodeFile[];
  database: CodeFile[];
  configuration: CodeFile[];
  documentation: CodeFile[];
}

export interface CodeFile {
  path: string;
  content: string;
  language: string;
  dependencies: string[];
}

// Application State Types
export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    analysis?: PromptAnalysis;
    generation?: GenerationResult;
    codeGeneration?: CodeGenerationResult;
  };
}

export interface SchemaSummary {
  totalPages: number;
  totalSections: number;
  totalComponents: number;
  totalServices: number;
  totalRepositories: number;
  totalModels: number;
  complexity: 'simple' | 'medium' | 'complex';
  lastModified: string;
}

export interface YAMLEditorState {
  content: string;
  isValid: boolean;
  errors: string[];
  lastSaved: Date;
  isDirty: boolean;
}

// Main Schema Interface
export interface CorisaSchema {
  app: CorisaApp;
  menus: Menu[];
  pages: Page[];
  sections: Section[];
  components: Component[];
  buttons: Button[];
  services: Service[];
  repositories: Repository[];
  models: Record<string, Model>;
  ai_agent: AIAgent;
}