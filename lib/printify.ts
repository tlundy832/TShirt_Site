// ---------- lib/printify.ts ----------------------------------
import fetch from 'node-fetch';

const BASE = 'https://api.printify.com/v1';
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
  'User-Agent': 'ai‑tshirt‑prototype/1.0',
});

export async function uploadImageToPrintify(fileName: string, imageUrl: string) {
  const res = await fetch(`${BASE}/uploads/images.json`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ file_name: fileName, url: imageUrl }),
  });
  if (!res.ok) throw new Error(`Upload failed ${await res.text()}`);
  return (await res.json()).id as string; // image_id
}

export async function createProduct(imageId: string) {
  const {
    PRINTIFY_SHOP_ID: shopId,
    PRINTIFY_BLUEPRINT_ID: blueprintId,
    PRINTIFY_PROVIDER_ID: providerId,
    PRINTIFY_VARIANT_ID: variantId,
  } = process.env as Record<string, string>;

  const body = {
    title: 'Custom AI Tee',
    blueprint_id: Number(blueprintId),
    print_provider_id: Number(providerId),
    variants: [
      {
        id: Number(variantId),
        price: 2200, // price in cents shown to customer
      },
    ],
    print_areas: {
      front: [
        {
          x: 0,
          y: 0,
          scale: 1,
          angle: 0,
          image_id: imageId,
        },
      ],
    },
    description: 'A unique tee featuring your AI‑transformed photo.',
    publish: true,
  };

  const res = await fetch(`${BASE}/shops/${shopId}/products.json`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Product create failed ${await res.text()}`);
  return (await res.json()).id as string; // product_id
}

export async function createOrder(productId: string, variantId: number, address: any) {
  const { PRINTIFY_SHOP_ID: shopId } = process.env as Record<string, string>;
  const orderBody = {
    line_items: [
      {
        product_id: productId,
        variant_id: variantId,
        quantity: 1,
      },
    ],
    shipping_method: 1, // flat rate (change if needed)
    send_shipping_notification: true,
    address_to: address,
  };
  const res = await fetch(`${BASE}/shops/${shopId}/orders.json`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(orderBody),
  });
  if (!res.ok) throw new Error(`Order failed ${await res.text()}`);
  return await res.json();
}