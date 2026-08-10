export type UserRole = 'customer' | 'admin';
export type ProductStatus = 'published' | 'draft' | 'archived';
export type OrderStatus = 
  | 'pending_payment'
  | 'payment_approved'
  | 'payment_rejected'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
  display_order?: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price_modifier: number;
  stock: number;
}

export interface ProductSpecifications {
  material?: string;
  glazing?: string;
  frame_width?: string;
  frame_depth?: string;
  hardware?: string;
  origin?: string;
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number | null;
  sku: string;
  stock: number;
  status: ProductStatus;
  category_id?: string | null;
  images: string[];
  variants?: ProductVariant[];
  specifications?: ProductSpecifications;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CartCustomConfig {
  width?: number;
  height?: number;
  finish?: string;
  matting?: string;
  photoUrl?: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  custom_config?: CartCustomConfig;
  product?: Product;
}

export interface Cart {
  id: string;
  user_id?: string | null;
  session_id?: string | null;
  items: CartItem[];
}

export interface ShippingAddress {
  full_name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  custom_config?: CartCustomConfig;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  payment_proof_url?: string | null;
  payment_notes?: string | null;
  carrier_name?: string | null;
  tracking_number?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image_url: string;
  link_url?: string | null;
  button_text?: string;
  display_order: number;
  is_active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  expires_at?: string | null;
  is_active: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string | null;
  user_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface SiteSettings {
  store_name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  operating_hours: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  shipping_fee: number;
  free_shipping_threshold: number;
  tax_rate_percent: number;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  upi_id: string;
  account_holder: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id?: string | null;
  admin_name: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  details?: Record<string, any>;
  created_at: string;
}
