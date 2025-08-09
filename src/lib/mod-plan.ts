export type ModCollection = 'models' | 'repositories' | 'services' | 'pages' | 'sections' | 'components' | 'buttons'

export interface ModPlan {
  version: string
  operations: ModOperation[]
}

export type ModOperation =
  | { op: 'upsert_entity'; collection: ModCollection; item: any; guards?: ModGuards }
  | { op: 'update_fields'; collection: ModCollection; id: string; changes: any; guards?: ModGuards }
  | { op: 'remove_entity'; collection: ModCollection; id: string; guards?: ModGuards }
  | { op: 'rename_entity'; collection: ModCollection; oldId: string; newId: string; guards?: ModGuards }
  | { op: 'link_ref'; parentCollection: Exclude<ModCollection, 'models'>; parentId: string; path: string; ref: string; guards?: ModGuards }
  | { op: 'unlink_ref'; parentCollection: Exclude<ModCollection, 'models'>; parentId: string; path: string; ref: string; guards?: ModGuards }
  | { op: 'reorder_refs'; parentCollection: Exclude<ModCollection, 'models'>; parentId: string; path: string; order: string[]; guards?: ModGuards }

export interface ModGuards {
  ifMissing?: boolean
  ifExists?: boolean
  assert?: string[]
}