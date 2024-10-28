import { NextApiRequest, NextApiResponse } from 'next'
export default async function createMessage(req: NextApiRequest, res: NextApiResponse) {
  const { messages } = req.body;
  const apiKey = process.env.OPEN_AI_API_KEY;
  const url = process.env.OPEN_AI_API;
  const body = JSON.stringify({
    messages,
    model: 'gpt-3.5-turbo',
    stream: false
  })

  try {
    //@ts-ignore
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body
    })
    const data = await response.json()
    res.status(200).json({ data })
  } catch (error) {
    //@ts-ignore
    res.status(500).json({ error: error.message })
  }
}
