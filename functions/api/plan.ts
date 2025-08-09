type PagesFunction = (context: { request: Request; env: Record<string, any> }) => Promise<Response>

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const { request, env } = context as any
    const body = await request.json()
    const { prompt, schemaSummary, planSchema } = body

    const apiKey = env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set' }), { status: 500 })
    }

    const system = `You are Corisa Planner. Transform user requests into a JSON Mod Plan following the provided JSON Schema strictly. Output ONLY valid JSON. Do not include prose. If unsure, propose minimal safe operations.`

    const user = `User request:\n${prompt}\n\nCurrent schema summary:\n${schemaSummary}\n\nJSON Schema for Mod Plan:\n${JSON.stringify(planSchema)}`

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

    if (!resp.ok) {
      const text = await resp.text()
      return new Response(JSON.stringify({ error: `OpenAI error ${resp.status}: ${text}` }), { status: 500 })
    }

    const data = await resp.json()
    const content = data.choices?.[0]?.message?.content
    let plan
    try {
      plan = JSON.parse(content)
    } catch (e) {
      return new Response(JSON.stringify({ error: 'LLM did not return valid JSON' }), { status: 500 })
    }

    return new Response(JSON.stringify({ plan }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500 })
  }
}