import { ExaminerPayload, ExaminerResult } from './types'

export async function callExaminer(payload: ExaminerPayload): Promise<ExaminerResult> {
  const apiUrl = process.env.IELTS_EXAMINER_API_URL
  const apiSecret = process.env.IELTS_EXAMINER_API_SECRET

  if (!apiUrl || !apiSecret) {
    throw new Error('Examiner environment variables (URL/SECRET) are not configured')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000)

  try {
    const response = await fetch(`${apiUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Examiner-Secret': apiSecret,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[EXAMINER_CLIENT_ERROR]', response.status, errorText)
      throw new Error(`Examiner error: ${response.status}`)
    }

    const data = await response.json() as ExaminerResult
    
    if (!data.success || !data.result) {
      throw new Error('Invalid examiner response: result missing or unsuccessful')
    }

    return data
  } catch (error: unknown) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Examiner API request timed out after 60s')
    }
    throw error
  }
}
