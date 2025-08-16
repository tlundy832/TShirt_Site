import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { uploadImageToPrintify, createProduct } from '../../lib/printify';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' },
  },
};

// Publishes a previously generated image to Printify and returns a productId
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { imageUrl } = req.body || {};
  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ error: 'imageUrl is required' });
  }
  try {
    let imageId: string;

    if (imageUrl.startsWith('data:')) {
      // data URL → extract mime and buffer, optionally recompress, upload via JSON { file_name, contents }
      const match = imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!match) return res.status(400).json({ error: 'Invalid data URL' });
      let mime = match[1];
      const b64 = match[2];
      let buffer = Buffer.from(b64, 'base64');

      // Optional size/cost saver: if PNG and no transparency needed, recompress to JPEG
      if (mime === 'image/png') {
        try {
          const pngMeta = await sharp(buffer).metadata();
          const hasAlpha = Boolean(pngMeta.hasAlpha);
          if (!hasAlpha) {
            buffer = await sharp(buffer).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
            mime = 'image/jpeg';
          }
        } catch {}
      }

      const ext = mime.split('/')[1] || 'png';
      const uploadRes = await fetch('https://api.printify.com/v1/uploads/images.json', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_name: `art.${ext}`, contents: buffer.toString('base64') }),
      });
      if (!uploadRes.ok) {
        const msg = await uploadRes.text();
        throw new Error(`Upload failed ${msg}`);
      }
      const uploaded = await uploadRes.json();
      imageId = uploaded.id as string;
    } else {
      // http(s) URL → let Printify fetch it from the web
      const fileName = path.basename(new URL(imageUrl).pathname) || 'art.jpg';
      imageId = await uploadImageToPrintify(fileName, imageUrl);
    }

    const productId = await createProduct(imageId);
    return res.status(200).json({ productId });
  } catch (e: any) {
    console.error('[create-printify] error:', e);
    return res.status(500).json({ error: e.message });
  }
}