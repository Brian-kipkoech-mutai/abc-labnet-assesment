// Run with: node supabase/seed-images.cjs
const { createClient } = require("@supabase/supabase-js")

const client = createClient(
  "https://owlsblsqaegrhwcvufvd.supabase.co",
  "sb_publishable_XrV1LH8LBYcRb-knUerWHA_1AcmVvPn"
)

const ITEM_IMAGES = [
  // From the original design template
  { sku: "VG-3301", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJdxlv0pI0gwyygcSOmgjZqlvq2V4a4GE9Bnx7kffblLF3yGLAlFZ8jxdvlCMYl92ixmo9K3tzSQe5Jcm9OPbYK0EW0JAQI32FD9ldYSW-JC11H1z0xGHnY1x5SHk2_v5wDzUlYx5eotnUe6Ph3-dVdcmiXJAOyU2Fr55N3anMvWZMS3DGgqDoBOrfRDLcuzw3pmtyVsUHI99EjJAWNv9XbPcdXzTlBcaZZlORE3sBl2nXPuqF3-gdZQ4mGkFpWREoUw_acXNBMpg" },
  { sku: "FR-7721", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxSVg5Jbt_5QSD7syDBLlJExGv1eOvz9AfZaNNM1Yx6jSQwI9k_uue8YMOR1ZQVXSmxJvI7STqwIv2Kp4uNcu5WhVcOotcpf8PCk3wR-xyUCogi6ziQTrZ0AQW6g80ZE8_0bcYDmhq3NIPa1oNlAU2yG0a5r60KnR0w-yPelxPrLmUnR1LyfYb9TWynSQqX9m-YsfABQkmuW0W2xGo45DQ9tfxBNPQxZOA2tPDMTwruTz6LW6bnT2M5tgawC3XVk4KaUR5i_s-0UU" },
  { sku: "VG-4412", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtjnIXyxQwnN6MMNN4MZhORF3YxL4HA9Sc-Sa5sBqNqFpNf9ngA4zbezJvXExuWvxElaZAQlAj_4o_449B6DZ9MhzCtNTc3zdbWwUrb8l52lI0E5aZrAggcFuqUDMsIyZQjjjicRq8aWB7IrkcFKFiCBxbX8c07AkSAETKLWwP2ArZh9SN3XTWbr2_feJkWkIMSEo5wEubomazzgfAXW7IpoR_hnIVX_W7TS7YBLphaw3_YIJIqUXyeictDCzgwUVr3mppQm-1LOI" },
  { sku: "VG-5503", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuApwHWy2Xy5tVvTjsNjAKgfhORtRvB_ShQL17A9ckwNWrAGDF_Awtyp-w-E5GwqS6IlsGs9l7a9zFfCjxAGD868QaIoyzKRXFKRfRpwS06jJTP9vXRnXmApbGHisbSYpmC1UY_lVpV-vcQTkLuhcGOVJatmXJzWdZVubkblZiLP3ELj7-k7f6qt1435CLB4GkJ8M7DTT7-5Cx4axHQm5tRYZ8uwRE63W9-EEGFB06Q1v9DakZr92cykvc853lllPFt11fznnbxTHWY" },
  // Unsplash stock photos for the remaining 9
  { sku: "VG-8820", image_url: "https://plus.unsplash.com/premium_photo-1701699257548-8261a687236f?auto=format&fit=crop&w=200&q=80" },
  { sku: "DY-4491", image_url: "https://plus.unsplash.com/premium_photo-1694481100261-ab16523c4093?auto=format&fit=crop&w=200&q=80" },
  { sku: "BK-1022", image_url: "https://plus.unsplash.com/premium_photo-1664640733898-d5c3f71f44e1?auto=format&fit=crop&w=200&q=80" },
  { sku: "DY-8812", image_url: "https://plus.unsplash.com/premium_photo-1691939610797-aba18030c15f?auto=format&fit=crop&w=200&q=80" },
  { sku: "BK-3311", image_url: "https://plus.unsplash.com/premium_photo-1673111979369-0222c7314b82?auto=format&fit=crop&w=200&q=80" },
  { sku: "BV-2201", image_url: "https://plus.unsplash.com/premium_photo-1675237625695-710b9a6c3f2e?auto=format&fit=crop&w=200&q=80" },
  { sku: "VG-6614", image_url: "https://plus.unsplash.com/premium_photo-1725902075652-837a57b4f4d9?auto=format&fit=crop&w=200&q=80" },
  { sku: "DY-3322", image_url: "https://plus.unsplash.com/premium_photo-1674482019268-7d55dc027bf2?auto=format&fit=crop&w=200&q=80" },
  { sku: "BK-4400", image_url: "https://plus.unsplash.com/premium_photo-1677686707023-9ac1e4f75a87?auto=format&fit=crop&w=200&q=80" },
]

const bySkuMap = Object.fromEntries(ITEM_IMAGES.map((i) => [i.sku, i.image_url]))

const TX_IMAGES = {
  "Organic Red Peppers": bySkuMap["VG-3301"],
  "Honey Crisp Apples":  bySkuMap["FR-7721"],
  "Fresh Broccoli Bulk": bySkuMap["VG-4412"],
  "Organic Carrots":     bySkuMap["VG-5503"],
  "Baby Spinach 250g":   bySkuMap["VG-8820"],
  "Whole Milk 1L":       bySkuMap["DY-4491"],
  "Artisan Sourdough":   bySkuMap["BK-1022"],
  "Cheddar Cheese 200g": bySkuMap["DY-8812"],
  "Whole Wheat Bread":   bySkuMap["BK-3311"],
  "Orange Juice 1L":     bySkuMap["BV-2201"],
  "Roma Tomatoes":       bySkuMap["VG-6614"],
  "Greek Yogurt 500g":   bySkuMap["DY-3322"],
  "Baguette":            bySkuMap["BK-4400"],
}

async function run() {
  const { error: signInError } = await client.auth.signInWithPassword({
    email: "admin@abclabnet.com",
    password: "ABCLabNet@2026",
  })
  if (signInError) return console.error("Sign in failed:", signInError.message)

  console.log("Updating inventory_items…")
  for (const { sku, image_url } of ITEM_IMAGES) {
    const { error } = await client.from("inventory_items").update({ image_url }).eq("sku", sku)
    console.log(error ? `  ✗ ${sku}: ${error.message}` : `  ✓ ${sku}`)
  }

  console.log("\nUpdating transactions…")
  for (const [item_name, item_image] of Object.entries(TX_IMAGES)) {
    const { error } = await client.from("transactions").update({ item_image }).eq("item_name", item_name)
    console.log(error ? `  ✗ "${item_name}": ${error.message}` : `  ✓ "${item_name}"`)
  }

  console.log("\nDone.")
}

run()
