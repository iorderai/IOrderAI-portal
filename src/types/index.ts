export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DeliverySettings {
  selfDeliveryRadius: number;  // 商户自配送半径（英里）
  uberMaxRadius: number;       // Uber 最大配送半径（固定 10 英里）
  coordinates: Coordinates;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  deliveryMode: 'uber' | 'self' | 'hybrid';
  status: 'active' | 'paused' | 'terminated';
  joinDate: string;
  deliverySettings?: DeliverySettings;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tips: number;
  total: number;
  paymentMethod: 'card' | 'cash';
  paymentStatus: 'paid' | 'pending' | 'failed';
  deliveryAddress?: string;
  status: 'pending' | 'completed' | 'cancelled';
  cancelReason?: string;
  createdAt: string;
}

export interface FinanceStats {
  orderCount: number;
  totalAmount: number;
  deliveryFee: number;
  platformFee: number;
  settlementAmount: number;
  settledAmount: number;
  pendingAmount: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: 'ach';
  bankAccount: string;
}

export interface User {
  id: string;
  username: string;
  restaurantId: string;
}

export type DateRange = 'today' | 'week' | 'month' | 'custom';
