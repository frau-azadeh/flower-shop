export type OrderItem = {
  productName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderRow = {
  id: string;
  status: string;
  fullName: string | null;
  phone: string | null;
  address: string | null;
  note: string | null;
  subTotal: number;
  shippingFee: number;
  grandTotal: number;
  createdAt: string;
  items: OrderItem[];
};

export type Profile = {
  id: string;
  fullName: string | null;
  phone: string | null;
  address: string | null;
};

export type OrdersResponse = { ok: boolean; orders?: OrderRow[] };
