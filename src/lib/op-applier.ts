import { CorisaSchema, Page, Section, Service, Repository, Component, Button, Model } from '../types/corisa'
import { ModPlan, ModOperation, ModCollection } from './mod-plan'

export interface ApplyReport {
  applied: number
  warnings: string[]
  errors: string[]
}

export function applyModPlan(base: CorisaSchema, plan: ModPlan): { schema: CorisaSchema; report: ApplyReport } {
  const schema: CorisaSchema = structuredClone(base)
  const report: ApplyReport = { applied: 0, warnings: [], errors: [] }

  for (const op of plan.operations) {
    try {
      switch (op.op) {
        case 'upsert_entity':
          upsert(schema, op.collection, op.item)
          report.applied++
          break
        case 'update_fields':
          updateFields(schema, op.collection, op.id, op.changes)
          report.applied++
          break
        case 'remove_entity':
          removeEntity(schema, op.collection, op.id, report)
          report.applied++
          break
        case 'rename_entity':
          renameEntity(schema, op.collection, op.oldId, op.newId)
          report.applied++
          break
        case 'link_ref':
          linkRef(schema, op.parentCollection, op.parentId, op.path, op.ref)
          report.applied++
          break
        case 'unlink_ref':
          unlinkRef(schema, op.parentCollection, op.parentId, op.path, op.ref)
          report.applied++
          break
        case 'reorder_refs':
          reorderRefs(schema, op.parentCollection, op.parentId, op.path, op.order)
          report.applied++
          break
      }
    } catch (e: any) {
      report.errors.push(String(e?.message || e))
    }
  }

  return { schema, report }
}

function upsert(schema: CorisaSchema, collection: ModCollection, item: any) {
  if (!item?.id) throw new Error(`Upsert requires item.id for ${collection}`)
  if (collection === 'models') {
    schema.models[item.id] = item as Model
    return
  }
  const arr = getArray(schema, collection)
  const idx = arr.findIndex((x: any) => x.id === item.id)
  if (idx >= 0) arr[idx] = { ...arr[idx], ...item }
  else arr.push(item)
}

function updateFields(schema: CorisaSchema, collection: ModCollection, id: string, changes: any) {
  if (collection === 'models') {
    const existing = schema.models[id]
    if (!existing) throw new Error(`Model ${id} not found`)
    schema.models[id] = { ...existing, ...changes }
    return
  }
  const arr = getArray(schema, collection)
  const idx = arr.findIndex((x: any) => x.id === id)
  if (idx < 0) throw new Error(`${collection} ${id} not found`)
  arr[idx] = deepMerge(arr[idx], changes)
}

function removeEntity(schema: CorisaSchema, collection: ModCollection, id: string, report: ApplyReport) {
  if (collection === 'models') {
    // Check repositories referencing model
    const used = schema.repositories.some(r => r.model === id)
    if (used) throw new Error(`Cannot remove model ${id}; still referenced by repositories`)
    delete schema.models[id]
    return
  }
  const arr = getArray(schema, collection)
  const idx = arr.findIndex((x: any) => x.id === id)
  if (idx < 0) throw new Error(`${collection} ${id} not found`)

  // Prevent removing a section referenced by pages
  if (collection === 'sections') {
    const referenced = schema.pages.some(p => (p.sections || []).includes(id))
    if (referenced) throw new Error(`Cannot remove section ${id}; referenced by a page`)
  }

  arr.splice(idx, 1)
}

function renameEntity(schema: CorisaSchema, collection: ModCollection, oldId: string, newId: string) {
  if (collection === 'models') {
    const model = schema.models[oldId]
    if (!model) throw new Error(`Model ${oldId} not found`)
    delete schema.models[oldId]
    schema.models[newId] = { ...model, id: newId }
    // Rewrite references
    schema.repositories = schema.repositories.map(r => (r.model === oldId ? { ...r, model: newId } : r))
    return
  }

  const arr = getArray(schema, collection)
  const idx = arr.findIndex((x: any) => x.id === oldId)
  if (idx < 0) throw new Error(`${collection} ${oldId} not found`)
  arr[idx] = { ...arr[idx], id: newId }

  // Rewrite references
  if (collection === 'sections') {
    schema.pages = schema.pages.map(p => ({ ...p, sections: (p.sections || []).map(s => (s === oldId ? newId : s)) }))
  }
}

function linkRef(schema: CorisaSchema, parentCollection: Exclude<ModCollection, 'models'>, parentId: string, path: string, ref: string) {
  const parentArr = getArray(schema, parentCollection)
  const parentIdx = parentArr.findIndex((x: any) => x.id === parentId)
  if (parentIdx < 0) throw new Error(`${parentCollection} ${parentId} not found`)
  const parent = parentArr[parentIdx]

  // Only support pages.sections[] path for now
  if (parentCollection === 'pages' && path === 'sections') {
    const list = Array.isArray(parent.sections) ? parent.sections : []
    if (!list.includes(ref)) list.push(ref)
    parentArr[parentIdx] = { ...parent, sections: list }
    return
  }
  throw new Error(`Unsupported link_ref path ${parentCollection}.${path}`)
}

function unlinkRef(schema: CorisaSchema, parentCollection: Exclude<ModCollection, 'models'>, parentId: string, path: string, ref: string) {
  const parentArr = getArray(schema, parentCollection)
  const parentIdx = parentArr.findIndex((x: any) => x.id === parentId)
  if (parentIdx < 0) throw new Error(`${parentCollection} ${parentId} not found`)
  const parent = parentArr[parentIdx]

  if (parentCollection === 'pages' && path === 'sections') {
    const list = (parent.sections || []).filter((x: string) => x !== ref)
    parentArr[parentIdx] = { ...parent, sections: list }
    return
  }
  throw new Error(`Unsupported unlink_ref path ${parentCollection}.${path}`)
}

function reorderRefs(schema: CorisaSchema, parentCollection: Exclude<ModCollection, 'models'>, parentId: string, path: string, order: string[]) {
  const parentArr = getArray(schema, parentCollection)
  const parentIdx = parentArr.findIndex((x: any) => x.id === parentId)
  if (parentIdx < 0) throw new Error(`${parentCollection} ${parentId} not found`)
  const parent = parentArr[parentIdx]
  if (parentCollection === 'pages' && path === 'sections') {
    const existing = new Set(parent.sections || [])
    const filtered = order.filter(id => existing.has(id))
    parentArr[parentIdx] = { ...parent, sections: filtered }
    return
  }
  throw new Error(`Unsupported reorder_refs path ${parentCollection}.${path}`)
}

function getArray(schema: CorisaSchema, collection: ModCollection): any[] {
  switch (collection) {
    case 'repositories':
      return schema.repositories
    case 'services':
      return schema.services
    case 'pages':
      return schema.pages
    case 'sections':
      return schema.sections
    case 'components':
      return schema.components
    case 'buttons':
      return schema.buttons
    default:
      throw new Error(`Collection ${collection} is not an array in CorisaSchema`)
  }
}

function deepMerge<T>(target: T, source: Partial<T>): T {
  const out: any = Array.isArray(target) ? [...(target as any)] : { ...(target as any) }
  Object.entries(source as any).forEach(([k, v]) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = deepMerge((out[k] ?? {}) as any, v as any)
    } else {
      out[k] = v
    }
  })
  return out as T
}