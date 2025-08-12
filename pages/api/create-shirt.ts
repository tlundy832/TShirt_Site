import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import OpenAI from 'openai';
import { toFile } from 'openai/uploads';
import fs from 'fs';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

// NOTE: Requires openai SDK v4+. If you see method errors, run: npm i openai@latest
// Generates the AI image and returns { imageUrl }. Does NOT call Printify.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw err;
      // Robustly pick the first uploaded file regardless of field key or array shape
const incoming = files as unknown as Record<string, formidable.File | formidable.File[]>;
const fileCandidates = Object.values(incoming).flatMap((v) => Array.isArray(v) ? v : [v]).filter(Boolean) as formidable.File[];
const file = fileCandidates[0];
if (!file?.filepath) {
  console.error('[create-shirt] No file found. Keys:', Object.keys(incoming));
  throw new Error('No file uploaded');
}

      // Read selected style from the client (see pages/index.tsx: form.append('style', style))
      const rawStyle = (Array.isArray(fields.style) ? fields.style[0] : fields.style) as string | undefined;
      const style = (rawStyle || 'De-age').trim();

      // Map UI styles -> rich prompts
      const STYLE_PROMPTS: Record<string, string> = {
        'De-age': 'Transform the pet in this photo into a younger version (kitten or puppy) while preserving identity-specific details: breed characteristics, fur color and markings, eye color, and accessories like collars or tags. Keep the original pose, camera angle, lighting, and background. Use juvenile proportions (slightly larger head and eyes, smaller body and paws), softer fluffier fur, and gentle lighting. Output should look photorealistic and faithful to the original pet.',
        'Cartoonify': 'Render the pet as a warm, hand-drawn animation-style illustration with soft painterly shading, clean gentle line work, and a whimsical atmosphere. Use nature-inspired colors and cozy lighting. Do not reference or mention any brands or studios. Preserve the pet’s identity: same breed cues, fur colors/markings, collar, pose, and overall composition.',
        'Halloween': 'Dress the pet in a Halloween costume that best suits its appearance and personality (e.g., pumpkin outfit, little vampire cape, bat wings, or witch hat). Integrate the costume naturally while keeping the pet’s face, markings, fur color, collar, pose, lighting, and background unchanged. The result should look like a real photo with a well-fitted costume.'
      };
      const prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS['De-age'];

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      console.log('[create-shirt] style:', style);

      // Read raw file bytes and normalize to PNG so the SDK sends a supported mimetype
      const raw = await fs.promises.readFile(file.filepath as string);
      const pngBuffer = await sharp(raw).png({ quality: 90 }).toBuffer();
      const imageFile = await toFile(pngBuffer, "upload.png", { type: "image/png" });

      const generation = await openai.images.edit({
        model: 'gpt-image-1',
        prompt,
        image: imageFile,
        size: '1024x1024',
      });

      const b64 = generation.data[0].b64_json!;
      const imageUrl = `data:image/png;base64,${b64}`;
      return res.status(200).json({ imageUrl, usedStyle: style });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  });
}