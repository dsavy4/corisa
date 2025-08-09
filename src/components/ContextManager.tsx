import { useState } from 'react'
import { useCorisaStore } from '../stores/corisaStore'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

export default function ContextManager() {
  const { schema, updateSchema } = useCorisaStore()

  // Local Edit State for adding a Page
  const [newPage, setNewPage] = useState({ id: '', title: '', route: '' })
  const [newSection, setNewSection] = useState({ id: '', title: '', type: 'list' })

  const addPage = () => {
    if (!newPage.id || !newPage.title || !newPage.route) return
    updateSchema({
      ...schema,
      pages: [
        ...schema.pages,
        {
          id: newPage.id,
          title: newPage.title,
          description: '',
          route: newPage.route,
          sections: [],
          layout: 'default',
          metadata: {
            requiresAuth: false,
            permissions: [],
            breadcrumbs: [],
            seo: { title: newPage.title, description: '', keywords: [] }
          }
        }
      ]
    })
    setNewPage({ id: '', title: '', route: '' })
  }

  const addSection = () => {
    if (!newSection.id || !newSection.title) return
    updateSchema({
      ...schema,
      sections: [
        ...schema.sections,
        {
          id: newSection.id,
          title: newSection.title,
          description: '',
          type: newSection.type as any,
          components: [],
          layout: 'vertical',
          metadata: { responsive: true, collapsible: false, sortable: false, filterable: false, pagination: false }
        }
      ]
    })
    setNewSection({ id: '', title: '', type: 'list' })
  }

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Models */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Models</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.keys(schema.models || {}).length === 0 && (
            <div className="text-sm text-muted-foreground">No models defined</div>
          )}
          {Object.entries(schema.models || {}).map(([id, model]) => (
            <div key={id} className="flex items-center justify-between border border-border rounded-md p-2">
              <div>
                <div className="text-sm font-medium">{model.name || id}</div>
                <div className="text-xs text-muted-foreground">{id}</div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pages */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {schema.pages.length === 0 && (
              <div className="text-sm text-muted-foreground">No pages yet</div>
            )}
            {schema.pages.map((p) => (
              <div key={p.id} className="border border-border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.id} • {p.route}</div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3">
            <div className="text-sm font-medium mb-2">Add Page</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input placeholder="id" value={newPage.id} onChange={e => setNewPage(s => ({ ...s, id: e.target.value }))} />
              <Input placeholder="title" value={newPage.title} onChange={e => setNewPage(s => ({ ...s, title: e.target.value }))} />
              <Input placeholder="/route" value={newPage.route} onChange={e => setNewPage(s => ({ ...s, route: e.target.value }))} />
            </div>
            <div className="mt-2 flex justify-end">
              <Button size="sm" onClick={addPage}>Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {schema.sections.length === 0 && (
              <div className="text-sm text-muted-foreground">No sections yet</div>
            )}
            {schema.sections.map((s) => (
              <div key={s.id} className="border border-border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.id} • {s.type}</div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3">
            <div className="text-sm font-medium mb-2">Add Section</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input placeholder="id" value={newSection.id} onChange={e => setNewSection(s => ({ ...s, id: e.target.value }))} />
              <Input placeholder="title" value={newSection.title} onChange={e => setNewSection(s => ({ ...s, title: e.target.value }))} />
              <Input placeholder="type (list/form/detail)" value={newSection.type} onChange={e => setNewSection(s => ({ ...s, type: e.target.value }))} />
            </div>
            <div className="mt-2 flex justify-end">
              <Button size="sm" onClick={addSection}>Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}