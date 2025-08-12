import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { uploadImageToPrintify, createProduct } from '../../lib/printify';

// Publishes a previously generated image to Printify and returns a productId
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { imageUrl } = req.body || {};
  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ error: 'imageUrl is required' });
  }
  try {
    const imageId = await uploadImageToPrintify(path.basename(imageUrl), imageUrl);
    const productId = await createProduct(imageId);
    return res.status(200).json({ productId });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}