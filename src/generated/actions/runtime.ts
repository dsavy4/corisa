import { resolveTemplate, ExprContext } from '../../lib/expression'

export type Action =
  | { type: 'call_service'; target: string; input?: Record<string, any>; onSuccess?: Action[]; onError?: Action[] }
  | { type: 'navigate'; target: string }
  | { type: 'mutate_state'; input: Record<string, any> }
  | { type: 'show_toast'; input: { message: string; variant?: 'success' | 'error' } }

export interface ActionEnv {
  callService: (target: string, input?: any) => Promise<any>
  navigate: (path: string) => void
  setState: (key: string, value: any) => void
  toast: (message: string, variant?: 'success' | 'error') => void
  getContext: () => ExprContext
}

export async function runActions(actions: Action[], env: ActionEnv) {
  for (const action of actions) {
    await runAction(action, env)
  }
}

async function runAction(action: Action, env: ActionEnv) {
  const ctx = env.getContext()
  switch (action.type) {
    case 'call_service': {
      const input = Object.fromEntries(Object.entries(action.input || {}).map(([k, v]) => [k, typeof v === 'string' ? resolveTemplate(v, ctx) : v]))
      try {
        const res = await env.callService(action.target, input)
        if (action.onSuccess) await runActions(action.onSuccess, env)
        return res
      } catch (e) {
        if (action.onError) await runActions(action.onError, env)
        throw e
      }
    }
    case 'navigate': {
      const path = resolveTemplate(action.target, ctx)
      env.navigate(path)
      return
    }
    case 'mutate_state': {
      Object.entries(action.input || {}).forEach(([k, v]) => env.setState(k, v))
      return
    }
    case 'show_toast': {
      env.toast(action.input.message, action.input.variant)
      return
    }
  }
}