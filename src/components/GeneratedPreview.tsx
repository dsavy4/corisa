import { useState, useMemo } from 'react'
import { useCorisaStore } from '@/stores/corisaStore'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { SectionList } from '@/generated/ui/SectionList'

function makeMockRows(keys: string[], n = 8) {
  return Array.from({ length: n }).map((_, i) =>
    keys.reduce((acc, k) => ({ ...acc, [k]: `${k}-${i + 1}` }), {})
  )
}

export default function GeneratedPreview() {
  const { schema } = useCorisaStore()
  const [activePageId, setActivePageId] = useState(schema.pages[0]?.id || '')
  const activePage = useMemo(() => schema.pages.find(p => p.id === activePageId) || null, [schema.pages, activePageId])

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-5">
      {/* Sidebar */}
      <div className="border-r border-border p-3 space-y-2 md:col-span-1">
        <div className="text-xs text-muted-foreground mb-2">Pages</div>
        {schema.pages.length === 0 && (
          <div className="text-sm text-muted-foreground">No pages yet</div>
        )}
        {schema.pages.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePageId(p.id)}
            className={`w-full text-left px-3 py-2 rounded border ${activePageId === p.id ? 'border-ring' : 'border-border'} hover:bg-muted/50`}
          >
            <div className="text-sm font-medium">{p.title}</div>
            <div className="text-xs text-muted-foreground">{p.route}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 overflow-auto md:col-span-4">
        {!activePage && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">No page selected</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Select a page from the left to preview.</CardContent>
          </Card>
        )}

        {activePage && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{activePage.title}</div>
                <div className="text-xs text-muted-foreground">{activePage.description}</div>
              </div>
            </div>

            {/* Render sections */}
            <div className="space-y-4">
              {activePage.sections.map(sectionId => {
                const section = schema.sections.find(s => s.id === sectionId)
                if (!section) return null

                if (section.type === 'list') {
                  const columns = ['name', 'id'] as const
                  const colDefs = columns.map(k => ({ key: k as 'name' | 'id', label: k.toUpperCase() }))
                  const items = makeMockRows(['name', 'id']) as Array<{ name: string; id: string }>
                  return (
                    <SectionList<{ name: string; id: string }> key={section.id} title={section.title} items={items} columns={colDefs} onRowClick={() => {}} />
                  )
                }

                return (
                  <Card key={section.id}>
                    <CardHeader>
                      <CardTitle className="text-sm">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">{section.description || 'Placeholder content'}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}