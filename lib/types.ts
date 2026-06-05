export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  stock_quantity: number
  unit: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  item_name: string
  item_image: string | null
  store_id: string
  amount: number
  status: "COMPLETED" | "PENDING" | "FAILED"
  created_at: string
}

export interface DashboardStats {
  totalSalesToday: number
  stockAlerts: number
  activeOrders: number
  newArrivals: number
}

export interface SalesTrendPoint {
  day: string
  total: number
  heightPercent: number
}

export function getInventoryStatus(qty: number): "IN STOCK" | "LOW STOCK" | "OUT OF STOCK" {
  if (qty === 0) return "OUT OF STOCK"
  if (qty <= 20) return "LOW STOCK"
  return "IN STOCK"
}
