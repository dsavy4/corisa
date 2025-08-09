import Ajv, { ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import { ModPlan } from './mod-plan'
import { CorisaSchema } from '../types/corisa'

export interface PlanValidationResult {
  valid: boolean
  errors: string[]
}

export class SchemaValidator {
  private ajv: Ajv
  private validateModPlanFn: ValidateFunction | null = null

  constructor(private modPlanSchema: object) {
    this.ajv = new Ajv({ allErrors: true, strict: false })
    addFormats(this.ajv)
    this.validateModPlanFn = this.ajv.compile(this.modPlanSchema)
  }

  validateModPlan(plan: unknown): PlanValidationResult {
    if (!this.validateModPlanFn) return { valid: false, errors: ['Validator not initialized'] }
    const ok = this.validateModPlanFn(plan)
    if (ok) return { valid: true, errors: [] }
    const errors = (this.validateModPlanFn.errors || []).map(e => `${e.instancePath || '(root)'} ${e.message}`)
    return { valid: false, errors }
  }

  // Minimal referential checks for current Corisa schema
  checkReferentialIntegrity(schema: CorisaSchema): PlanValidationResult {
    const errors: string[] = []
    // pages.sections must reference existing section ids
    const sectionIds = new Set(schema.sections.map(s => s.id))
    schema.pages.forEach(p => {
      (p.sections || []).forEach(ref => {
        if (!sectionIds.has(ref)) {
          errors.push(`Page ${p.id} references missing section ${ref}`)
        }
      })
    })

    // repositories.model must exist in models map
    const modelIds = new Set(Object.keys(schema.models || {}))
    schema.repositories.forEach(r => {
      if (r.model && !modelIds.has(r.model)) {
        errors.push(`Repository ${r.id} references missing model ${r.model}`)
      }
    })

    return { valid: errors.length === 0, errors }
  }
}