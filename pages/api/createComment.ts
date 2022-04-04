// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client'

type Data = {
  name: string
}

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
}

const client = sanityClient(config)

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // pulling the four varibles from res body
  const { _id, name, email, comment } = JSON.parse(req.body)

  //try block to catch any issues going on

  //the reference below will relate it to another entire object

  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment,
    })
  } catch (err) {
    //return 500 status message
    return res.status(500).json({ message: `Failed to submit comment`, err })
  }
  console.log('Comment successfully submitted')

  res.status(200).json({ message: 'comment successfully submitted' })
}
