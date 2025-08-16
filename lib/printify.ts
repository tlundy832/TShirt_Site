import fetch from 'node-fetch';

const BASE = 'https://api.printify.com/v1';
const headers = () => ({
  Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
  'Content-Type': 'application/json', // required for JSON posts
});

// --- existing uploadImageToPrintify can stay as-is ---

// Catalog helpers
async function fetchBlueprintVariants(blueprintId: number, printProviderId: number) {
  const url =
    `${BASE}/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json?show-out-of-stock=1`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Fetch variants failed ${await res.text()}`);
  return await res.json();
}

function pickVariantIds(catalogVariants: any, limit = 6): number[] {
  const list: any[] = Array.isArray(catalogVariants?.data)
    ? catalogVariants.data
    : Array.isArray(catalogVariants?.variants)
    ? catalogVariants.variants
    : Array.isArray(catalogVariants)
    ? catalogVariants
    : [];

  if (!list.length) return [];
  // Prefer common sizes/colors if titles are present; otherwise just take the first few
  const preferred = list.filter(
    (v) => /black/i.test(v?.title || '') && /(S|M|L|XL)([^a-z]|$)/i.test(v?.title || '')
  );
  const chosen = (preferred.length ? preferred : list).slice(0, limit);
  return chosen.map((v) => Number(v.id)).filter(Boolean);
}

// ✅ NEW: build product with print_areas + placeholders
export async function createProduct(imageId: string) {
  const shopId = process.env.PRINTIFY_SHOP_ID;
  const blueprintId = Number(process.env.PRINTIFY_BLUEPRINT_ID || 0);
  const printProviderId = Number(process.env.PRINTIFY_PRINT_PROVIDER_ID || 0);

  if (!shopId) throw new Error('Missing PRINTIFY_SHOP_ID');
  if (!blueprintId || !printProviderId)
    throw new Error('Missing PRINTIFY_BLUEPRINT_ID or PRINTIFY_PRINT_PROVIDER_ID');

  // 1) Get variants for this blueprint/provider
  const variantsJson = await fetchBlueprintVariants(blueprintId, printProviderId);
  const variantIds = pickVariantIds(variantsJson);
  if (!variantIds.length) throw new Error('No variants found for selected blueprint/provider');

  // 2) Build the product body: FRONT placeholder centered at 0.5/0.5, scale 1.0
  const body = {
    title: 'AI Pet Tee',
    description: 'Your uploaded pet photo transformed into unique AI artwork.',
    blueprint_id: blueprintId,
    print_provider_id: printProviderId,
    variants: variantIds.map((id, idx) => ({
      id,
      price: 2500,        // cents
      is_enabled: idx < 4 // enable a few by default
    })),
    print_areas: [
      {
        variant_ids: variantIds,
        placeholders: [
          {
            position: 'front',
            images: [
              { id: imageId, x: 0.5, y: 0.5, scale: 1.0, angle: 0 }
            ]
          }
        ],
        background: '#ffffff'
      }
    ],
    tags: ['pets', 'ai-art', 't-shirt']
  };

  const res = await fetch(`${BASE}/shops/${shopId}/products.json`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Product create failed ${await res.text()}`);
  const json = await res.json();
  return json.id as string;
}