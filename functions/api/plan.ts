type PagesFunction = (context: { request: Request; env: Record<string, any> }) => Promise<Response>

async function callOpenAI(prompt: string, schemaSummary: any, planSchema: any, apiKey: string) {
  const system = `You are Corisa Planner. Transform user requests into a JSON Mod Plan following the provided JSON Schema strictly. Output ONLY valid JSON. Do not include prose. If unsure, propose minimal safe operations.`
  const user = `User request:\n${prompt}\n\nCurrent schema summary:\n${JSON.stringify(schemaSummary)}\n\nJSON Schema for Mod Plan:\n${JSON.stringify(planSchema)}`

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.2
    })
  })
  if (!resp.ok) throw new Error(`OpenAI error ${resp.status}: ${await resp.text()}`)
  const data = await resp.json()
  const content = data.choices?.[0]?.message?.content
  return JSON.parse(content)
}

async function callWorkersAI(prompt: string, schemaSummary: any, planSchema: any, accountId: string, apiToken: string) {
  const model = '@cf/meta/llama-3-8b-instruct'
  const system = `You are Corisa Planner. Transform user requests into a JSON Mod Plan following the provided JSON Schema strictly. Output ONLY valid JSON. No prose.`
  const user = `User request:\n${prompt}\n\nCurrent schema summary:\n${JSON.stringify(schemaSummary)}\n\nJSON Schema for Mod Plan:\n${JSON.stringify(planSchema)}`
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${encodeURIComponent(model)}`
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  })
  if (!resp.ok) throw new Error(`Workers AI error ${resp.status}: ${await resp.text()}`)
  const data = await resp.json()
  // Workers AI returns result.response for some models; handle common shapes
  const content = data.result?.response || data.result?.output_text || data.result?.choices?.[0]?.message?.content
  return JSON.parse(content)
}

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const { request, env } = context as any
    const body = await request.json()
    const { prompt, schemaSummary, planSchema } = body

    let plan: any = null

    if (env.OPENAI_API_KEY) {
      plan = await callOpenAI(prompt, schemaSummary, planSchema, env.OPENAI_API_KEY)
    } else if (env.CLOUDFLARE_API_TOKEN && env.CLOUDFLARE_ACCOUNT_ID) {
      plan = await callWorkersAI(prompt, schemaSummary, planSchema, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN)
    } else {
      return new Response(JSON.stringify({ error: 'No AI credentials set. Provide OPENAI_API_KEY or CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID.' }), { status: 500 })
    }

    return new Response(JSON.stringify({ plan }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500 })
  }
}