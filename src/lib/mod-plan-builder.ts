import { CorisaSchema, Page, Section, Service, Repository, Component, Button, Model } from '../types/corisa'
import { ModPlan, ModOperation } from './mod-plan'

export function buildPlanFromModifications(mods: Partial<CorisaSchema>, current: CorisaSchema): ModPlan {
  const operations: ModOperation[] = []

  if (mods.models) {
    for (const [id, model] of Object.entries(mods.models)) {
      operations.push({ op: 'upsert_entity', collection: 'models', item: { ...model, id } })
    }
  }
  if (mods.repositories) {
    mods.repositories.forEach((r) => operations.push({ op: 'upsert_entity', collection: 'repositories', item: r }))
  }
  if (mods.services) {
    mods.services.forEach((s) => operations.push({ op: 'upsert_entity', collection: 'services', item: s }))
  }
  if (mods.sections) {
    mods.sections.forEach((s) => operations.push({ op: 'upsert_entity', collection: 'sections', item: s }))
  }
  if (mods.pages) {
    mods.pages.forEach((p) => operations.push({ op: 'upsert_entity', collection: 'pages', item: p }))
  }
  if (mods.components) {
    mods.components.forEach((c) => operations.push({ op: 'upsert_entity', collection: 'components', item: c }))
  }
  if (mods.buttons) {
    mods.buttons.forEach((b) => operations.push({ op: 'upsert_entity', collection: 'buttons', item: b }))
  }

  return { version: '1.0', operations }
}