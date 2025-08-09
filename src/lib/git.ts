export interface GitRepoInfo {
  provider: 'github'
  owner: string
  repo: string
  branch: string
  token?: string
}

export function parseGitUrl(url: string, branch?: string): GitRepoInfo {
  // Supports: https://github.com/owner/repo, optional /tree/<branch>
  const github = url.match(/https?:\/\/github\.com\/(.*?)\/(.*?)(?:$|\/.+)?/i)
  if (github) {
    const owner = github[1]
    const repo = github[2].replace(/\.git$/, '')
    let inferredBranch = branch || 'main'
    const branchMatch = url.match(/\/tree\/([^\/]+)/)
    if (branchMatch) inferredBranch = branchMatch[1]
    return { provider: 'github', owner, repo, branch: inferredBranch }
  }
  throw new Error('Unsupported git provider or invalid URL')
}

async function gh<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: token ? { Authorization: `token ${token}` } : {}
  })
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

export async function fetchGitHubTree(info: GitRepoInfo): Promise<Array<{ path: string; type: 'blob' | 'tree' }>> {
  const ref = encodeURIComponent(info.branch)
  const data = await gh<any>(`/repos/${info.owner}/${info.repo}/git/trees/${ref}?recursive=1`, info.token)
  return (data.tree || []).map((n: any) => ({ path: n.path as string, type: n.type as 'blob' | 'tree' }))
}

export async function fetchGitHubFile(info: GitRepoInfo, filePath: string): Promise<string | null> {
  try {
    const ref = encodeURIComponent(info.branch)
    const data = await gh<any>(`/repos/${info.owner}/${info.repo}/contents/${encodeURIComponent(filePath)}?ref=${ref}`, info.token)
    if (data && data.content && data.encoding === 'base64') {
      return atob(data.content.replace(/\n/g, ''))
    }
    if (data && data.download_url) {
      const res = await fetch(data.download_url, { headers: info.token ? { Authorization: `token ${info.token}` } : {} })
      return await res.text()
    }
    return null
  } catch {
    return null
  }
}