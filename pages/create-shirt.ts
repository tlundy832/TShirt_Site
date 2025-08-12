// ---------- pages/api/create-shirt.ts ------------------------
import type { NextApiRequest, NextApiResponse } from 'next';
import { uploadImageToPrintify, createProduct } from '../../lib/printify';
import { createReadStream } from 'fs';
import path from 'path';
import formidable from 'formidable';
import { Configuration, OpenAI } from 'openai';

export const config = {
  api: {
    bodyParser: false, // we use formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw err;
      const file = files.file as formidable.File;

      // 1️⃣ Generate a stylized image via OpenAI (or any provider) using the uploaded photo as the prompt.
      const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
      const openai = new OpenAIApi(configuration);

      // NOTE: Replace with your desired prompt / style logic
      const generation = await openai.images.generate({
        model: 'dall-e-3',
        prompt: 'Turn this photo into a vibrant pop‑art illustration',
        n: 1,
        size: '1024x1024',
        referenced_image_ids: [file.filepath], // experimental, adjust to provider’s SDK
      });

      const imageUrl = generation.data[0].url!;

      // 2️⃣ Upload generated image to Printify Media Library
      const imageId = await uploadImageToPrintify(path.basename(imageUrl), imageUrl);

      // 3️⃣ Create a product (publishes it so it’s purchasable)
      const productId = await createProduct(imageId);

      // 4️⃣ Return created product so front‑end can direct user to checkout page
      return res.status(200).json({ productId });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  });
}