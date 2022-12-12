// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../utils/client'
import { postDetailQuery } from '../../utils/queries';
import { uuid } from 'uuidv4'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { userId, postId } = req.body

    
    const data =  await client
      .patch(postId)
      .setIfMissing({ views: [] })
      .insert('after', 'views[-1]', [
        {
          _ref: userId,
          _key: uuid(),
        }
      ])
      .commit()

    res.status(200).json(data)
  }
}
