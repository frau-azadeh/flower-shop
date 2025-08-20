// مدل جدول‌ها – ساده و مطابق ستون‌هایی که در Supabase ساخته‌ای
export type OrderStatus =
  | "pending" // ثبت شده، در انتظار بررسی
  | "processing" // در حال پردازش
  | "shipped" // ارسال شد
  | "delivered" // تحویل شد
  | "cancelled"; // لغو شد

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  stock: number;
  coverUrl: string;
  category: string;
  active: boolean;
  createdAt: string; // timestamptz → string
}

export interface OrderRow {
  id: string;
  userId: string;
  status: OrderStatus;
  fullName: string;
  phone: string;
  address: string;
  note: string | null;
  subTotal: number;
  shippingFee: number;
  grandTotal: number;
  createdAt: string;
}

export interface OrderItemRow {
  id: string;
  orderId: string;
  productId: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;

  // فیلدهای Snapshot از محصول
  productName: string;
  productSlug: string;
  productCategory: string;
  createdAt: string;
}
