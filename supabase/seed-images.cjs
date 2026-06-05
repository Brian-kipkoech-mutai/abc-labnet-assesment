// Run with: node supabase/seed-images.js
const { createClient } = require("@supabase/supabase-js")

const client = createClient(
  "https://owlsblsqaegrhwcvufvd.supabase.co",
  "sb_publishable_XrV1LH8LBYcRb-knUerWHA_1AcmVvPn"
)

const ITEM_IMAGES = [
  {
    sku: "VG-3301",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJdxlv0pI0gwyygcSOmgjZqlvq2V4a4GE9Bnx7kffblLF3yGLAlFZ8jxdvlCMYl92ixmo9K3tzSQe5Jcm9OPbYK0EW0JAQI32FD9ldYSW-JC11H1z0xGHnY1x5SHk2_v5wDzUlYx5eotnUe6Ph3-dVdcmiXJAOyU2Fr55N3anMvWZMS3DGgqDoBOrfRDLcuzw3pmtyVsUHI99EjJAWNv9XbPcdXzTlBcaZZlORE3sBl2nXPuqF3-gdZQ4mGkFpWREoUw_acXNBMpg",
  },
  {
    sku: "FR-7721",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCxSVg5Jbt_5QSD7syDBLlJExGv1eOvz9AfZaNNM1Yx6jSQwI9k_uue8YMOR1ZQVXSmxJvI7STqwIv2Kp4uNcu5WhVcOotcpf8PCk3wR-xyUCogi6ziQTrZ0AQW6g80ZE8_0bcYDmhq3NIPa1oNlAU2yG0a5r60KnR0w-yPelxPrLmUnR1LyfYb9TWynSQqX9m-YsfABQkmuW0W2xGo45DQ9tfxBNPQxZOA2tPDMTwruTz6LW6bnT2M5tgawC3XVk4KaUR5i_s-0UU",
  },
  {
    sku: "VG-4412",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtjnIXyxQwnN6MMNN4MZhORF3YxL4HA9Sc-Sa5sBqNqFpNf9ngA4zbezJvXExuWvxElaZAQlAj_4o_449B6DZ9MhzCtNTc3zdbWwUrb8l52lI0E5aZrAggcFuqUDMsIyZQjjjicRq8aWB7IrkcFKFiCBxbX8c07AkSAETKLWwP2ArZh9SN3XTWbr2_feJkWkIMSEo5wEubomazzgfAXW7IpoR_hnIVX_W7TS7YBLphaw3_YIJIqUXyeictDCzgwUVr3mppQm-1LOI",
  },
  {
    sku: "VG-5503",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApwHWy2Xy5tVvTjsNjAKgfhORtRvB_ShQL17A9ckwNWrAGDF_Awtyp-w-E5GwqS6IlsGs9l7a9zFfCjxAGD868QaIoyzKRXFKRfRpwS06jJTP9vXRnXmApbGHisbSYpmC1UY_lVpV-vcQTkLuhcGOVJatmXJzWdZVubkblZiLP3ELj7-k7f6qt1435CLB4GkJ8M7DTT7-5Cx4axHQm5tRYZ8uwRE63W9-EEGFB06Q1v9DakZr92cykvc853lllPFt11fznnbxTHWY",
  },
]

// Map item names → image URLs for transactions
const TX_IMAGES = {
  "Organic Red Peppers": ITEM_IMAGES[0].image_url,
  "Honey Crisp Apples": ITEM_IMAGES[1].image_url,
  "Fresh Broccoli Bulk": ITEM_IMAGES[2].image_url,
  "Organic Carrots": ITEM_IMAGES[3].image_url,
}

async function run() {
  const { error: signInError } = await client.auth.signInWithPassword({
    email: "admin@abclabnet.com",
    password: "ABCLabNet@2026",
  })
  if (signInError) return console.error("Sign in failed:", signInError.message)

  // Update inventory_items
  for (const { sku, image_url } of ITEM_IMAGES) {
    const { error } = await client
      .from("inventory_items")
      .update({ image_url })
      .eq("sku", sku)
    console.log(error ? `✗ ${sku}: ${error.message}` : `✓ inventory ${sku}`)
  }

  // Update transactions
  for (const [item_name, item_image] of Object.entries(TX_IMAGES)) {
    const { error } = await client
      .from("transactions")
      .update({ item_image })
      .eq("item_name", item_name)
    console.log(error ? `✗ tx ${item_name}: ${error.message}` : `✓ transactions "${item_name}"`)
  }

  console.log("\nDone.")
}

run()
