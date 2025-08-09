export type ExprContext = {
  form?: Record<string, any>
  row?: Record<string, any>
  state?: Record<string, any>
  params?: Record<string, any>
  query?: Record<string, any>
}

// Resolves tokens like {form.name}, {row.id}, {state.key}
export function resolveTemplate(input: string, ctx: ExprContext): string {
  return input.replace(/\{([^}]+)\}/g, (_, token) => String(resolveToken(token.trim(), ctx) ?? ''))
}

function resolveToken(token: string, ctx: ExprContext): any {
  const [scope, ...pathParts] = token.split('.')
  const path = pathParts.join('.')
  const source =
    scope === 'form' ? ctx.form :
    scope === 'row' ? ctx.row :
    scope === 'state' ? ctx.state :
    scope === 'params' ? ctx.params :
    scope === 'query' ? ctx.query : undefined
  if (!source) return undefined
  return getByPath(source, path)
}

function getByPath(obj: Record<string, any>, path: string): any {
  if (!path) return obj
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}