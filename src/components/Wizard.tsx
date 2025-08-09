import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { templates, TemplateId } from '@/templates/templates'
import { useCorisaStore } from '@/stores/corisaStore'
import modPlanSchema from '../../schema/mod-plan.schema.json'

export default function Wizard() {
  const { schema, applyModPlan, applyModifications, setCurrentView } = useCorisaStore() as any
  const [step, setStep] = useState(1)
  const [templateId, setTemplateId] = useState<TemplateId>('property-management')
  const [description, setDescription] = useState('')
  const [planJson, setPlanJson] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const selected = templates.find(t => t.id === templateId)!

  const generatePlan = async () => {
    setLoading(true)
    setError(null)
    try {
      const schemaSummary = {
        pages: schema.pages.map((p: any) => ({ id: p.id, route: p.route, sections: p.sections.length })),
        sections: schema.sections.length,
        services: schema.services.length,
        repositories: schema.repositories.length,
        models: Object.keys(schema.models)
      }
      const resp = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${selected.name}: ${description}`, schemaSummary, planSchema: modPlanSchema })
      })
      if (!resp.ok) throw new Error(await resp.text())
      const data = await resp.json()
      setPlanJson(JSON.stringify(data.plan, null, 2))
      setStep(3)
    } catch (e: any) {
      setError('Planner failed, using template fallback')
      // Fallback to deterministic template
      const mods = selected.generate({ description }, schema)
      const res = applyModifications(mods)
      if (!res.success) setError('Failed to apply template fallback')
      else setStep(4)
    } finally {
      setLoading(false)
    }
  }

  const applyPlan = () => {
    try {
      const plan = JSON.parse(planJson)
      const res = applyModPlan(plan)
      if (!res.success) setError('Failed to apply plan')
      else setStep(4)
    } catch {
      setError('Plan JSON invalid')
    }
  }

  const gotoPreview = () => setCurrentView('preview')

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Corisa Launchpad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {templates.map(t => (
                  <button key={t.id} onClick={() => setTemplateId(t.id)} className={`border rounded p-3 text-left ${templateId === t.id ? 'border-ring' : 'border-border'}`}>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.summary}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your app goals and features" rows={4} />
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={generatePlan} disabled={!description || loading}>{loading ? 'Generating...' : 'Generate Plan'}</Button>
              </div>
              {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <Textarea value={planJson} onChange={e => setPlanJson(e.target.value)} rows={12} />
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={applyPlan}>Apply Plan</Button>
              </div>
              {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <div className="text-sm">Plan applied successfully.</div>
              <div className="flex justify-end">
                <Button onClick={gotoPreview}>Go to Preview</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}