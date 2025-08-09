import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetClose } from './ui/sheet'
import { Button } from './ui/button'
import { useState } from 'react'
import { useCorisaStore } from '../stores/corisaStore'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export default function ModPlanDrawer() {
  const { applyModPlan } = useCorisaStore()
  const [open, setOpen] = useState(false)
  const [planText, setPlanText] = useState<string>('')
  const [report, setReport] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const onApply = () => {
    try {
      const plan = JSON.parse(planText)
      const res = applyModPlan(plan)
      setReport(res.report)
      if (res.success) setOpen(false)
      if (!res.success) setError('Plan failed to apply')
    } catch (e: any) {
      setError(String(e?.message || e))
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="fixed bottom-4 right-4">
        <Button variant="default" onClick={() => setOpen(true)}>Review Mod Plan</Button>
      </div>
      <SheetContent>
        <SheetHeader>
          <div className="text-lg font-medium">Review AI Mod Plan</div>
        </SheetHeader>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-140px)]">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Plan JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={planText}
                onChange={(e) => setPlanText(e.target.value)}
                className="w-full h-48 bg-background border border-input rounded-md p-2 text-sm"
                placeholder='{"version":"1.0","operations":[...]}'
              />
            </CardContent>
          </Card>

          {report && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Apply Report</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(report, null, 2)}</pre>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          )}
        </div>
        <SheetFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onApply}>Apply Plan</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}