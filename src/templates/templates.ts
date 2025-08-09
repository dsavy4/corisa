import { CorisaSchema, Page, Section, Service, Repository, Model } from '@/types/corisa'

export type TemplateId = 'property-management' | 'crm'

export interface TemplateInput {
  description: string
}

export interface TemplateSpec {
  id: TemplateId
  name: string
  summary: string
  generate: (input: TemplateInput, current: CorisaSchema) => Partial<CorisaSchema>
}

function baseMods(entity: string, current: CorisaSchema): Partial<CorisaSchema> {
  const capital = entity.charAt(0).toUpperCase() + entity.slice(1)
  const pages: Page[] = [
    { id: `${entity}_list_page`, title: `${capital} List`, description: `Manage ${entity}s`, route: `/${entity}s`, sections: [`${entity}_list_section`], layout: 'list', metadata: { requiresAuth: true, permissions: [`read_${entity}`], breadcrumbs: [capital + 's'], seo: { title: `${capital} List`, description: `List ${entity}s`, keywords: [entity] } } },
    { id: `${entity}_detail_page`, title: `${capital} Detail`, description: `View ${entity}`, route: `/${entity}s/:id`, sections: [`${entity}_detail_section`], layout: 'default', metadata: { requiresAuth: true, permissions: [`read_${entity}`], breadcrumbs: [capital + 's', 'Detail'], seo: { title: `${capital} Detail`, description: `View ${entity}`, keywords: [entity, 'detail'] } } }
  ]
  const sections: Section[] = [
    { id: `${entity}_list_section`, title: `${capital} Table`, description: `Table of ${entity}s`, type: 'list', components: [], layout: 'vertical', metadata: { responsive: true, collapsible: false, sortable: true, filterable: true, pagination: true } },
    { id: `${entity}_detail_section`, title: `${capital} Info`, description: `${capital} details`, type: 'card', components: [], layout: 'vertical', metadata: { responsive: true, collapsible: false, sortable: false, filterable: false, pagination: false } }
  ]
  const model: Model = {
    id: entity,
    name: capital,
    description: `${capital} model`,
    fields: [
      { name: 'id', type: 'string', required: true, unique: true, validation: { pattern: '^[a-zA-Z0-9-]+$' } },
      { name: 'name', type: 'string', required: true, unique: false, validation: { min: 1, max: 255 } }
    ],
    relationships: [],
    metadata: { timestamps: true, softDelete: true, audit: true }
  }
  const repository: Repository = {
    id: `${entity}_repository`,
    name: `${capital}Repository`,
    description: `Repository for ${entity}`,
    model: entity,
    methods: [
      { name: 'findAll', description: `Find ${entity}s`, type: 'read', parameters: [{ name: 'options', type: 'object', required: false, description: 'Query options' }], returnType: `${capital}[]` },
      { name: 'findById', description: `Find ${entity}`, type: 'read', parameters: [{ name: 'id', type: 'string', required: true, description: 'ID' }], returnType: `${capital}` },
      { name: 'create', description: `Create ${entity}`, type: 'create', parameters: [{ name: 'data', type: `${capital}Data`, required: true, description: 'Data' }], returnType: `${capital}` }
    ],
    metadata: { database: 'postgresql', table: `${entity}s`, indexes: [`idx_${entity}_id`], constraints: [] }
  }
  const service: Service = {
    id: `${entity}_service`, name: `${capital}Service`, description: `Service for ${entity}`, methods: [
      { name: 'getAll', description: `Get ${entity}s`, parameters: [{ name: 'filters', type: 'object', required: false }], returnType: `Promise<${capital}[]>`, async: true },
      { name: 'create', description: `Create ${entity}`, parameters: [{ name: 'data', type: `${capital}Data`, required: true }], returnType: `Promise<${capital}>`, async: true }
    ], dependencies: [`${entity}_repository`], metadata: { version: '1.0.0', author: 'Corisa', documentation: '', testing: true }
  }
  return {
    pages: [...(current.pages || []), ...pages],
    sections: [...(current.sections || []), ...sections],
    models: { ...current.models, [entity]: model },
    repositories: [...(current.repositories || []), repository],
    services: [...(current.services || []), service]
  }
}

export const templates: TemplateSpec[] = [
  {
    id: 'property-management',
    name: 'Property Management',
    summary: 'Properties, Tenants, Leases, Maintenance, Invoices',
    generate: (input, current) => {
      let mods: Partial<CorisaSchema> = {}
      ;['property', 'tenant', 'lease'].forEach(e => { mods = mergeMods(mods, baseMods(e, current)) })
      return mods
    }
  },
  {
    id: 'crm',
    name: 'CRM',
    summary: 'Leads, Contacts, Deals, Pipelines',
    generate: (input, current) => {
      let mods: Partial<CorisaSchema> = {}
      ;['lead', 'contact', 'deal'].forEach(e => { mods = mergeMods(mods, baseMods(e, current)) })
      return mods
    }
  }
]

function mergeMods(a: Partial<CorisaSchema>, b: Partial<CorisaSchema>): Partial<CorisaSchema> {
  return {
    pages: [...(a.pages || []), ...(b.pages || [])],
    sections: [...(a.sections || []), ...(b.sections || [])],
    services: [...(a.services || []), ...(b.services || [])],
    repositories: [...(a.repositories || []), ...(b.repositories || [])],
    components: [...(a.components || []), ...(b.components || [])],
    models: { ...(a.models || {}), ...(b.models || {}) }
  }
}