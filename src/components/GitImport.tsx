import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { parseGitUrl, fetchGitHubTree, fetchGitHubFile } from '../lib/git'
import { useCorisaStore } from '../stores/corisaStore'

export default function GitImport() {
  const { createNewProject, addInsightFile, updateInsightFile, setCurrentView } = useCorisaStore() as any
  const [url, setUrl] = useState('')
  const [branch, setBranch] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    try {
      setLoading(true)
      setError(null)
      const info = parseGitUrl(url, branch || undefined)
      info.token = token || undefined
      createNewProject(`${info.owner}/${info.repo}`, `Imported from GitHub (${info.branch})`, 'import')
      const tree = await fetchGitHubTree(info)
      // Create a basic insight summarizing repo structure
      addInsightFile('project-overview')
      const files = tree.filter(t => t.type === 'blob').slice(0, 50).map(f => f.path)
      const overviewContent = `# GitHub Import\n\nRepo: ${info.owner}/${info.repo}\nBranch: ${info.branch}\n\nFiles (first 50):\n${files.map(f => '- ' + f).join('\n')}`
      const state = (useCorisaStore.getState() as any)
      const ov = state.insightFiles.find((f: any) => f.type === 'project-overview')
      if (ov) {
        updateInsightFile(ov.id, { content: overviewContent })
      }
      setCurrentView('context')
    } catch (e: any) {
      setError(String(e?.message || e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Import from GitHub</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input placeholder="https://github.com/owner/repo[ /tree/branch ]" value={url} onChange={e => setUrl(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input placeholder="branch (optional)" value={branch} onChange={e => setBranch(e.target.value)} />
          <Input placeholder="token (optional)" value={token} onChange={e => setToken(e.target.value)} />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleImport} disabled={!url || loading}>{loading ? 'Importing...' : 'Import'}</Button>
        </div>
        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
      </CardContent>
    </Card>
  )
}