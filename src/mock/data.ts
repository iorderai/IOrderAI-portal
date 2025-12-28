import type { Restaurant, Order, PaymentRecord, FinanceStats, BankAccount, WithdrawalRequest, WithdrawalBalance } from '../types';

export const mockRestaurant: Restaurant = {
  id: 'rest_001',
  name: 'Golden Dragon Chinese Restaurant',
  address: '1234 Main Street, San Francisco, CA 94102',
  phone: '(415) 555-0123',
  deliveryMode: 'hybrid',
  status: 'active',
  joinDate: '2024-06-15',
  deliverySettings: {
    selfDeliveryRadius: 3,
    uberMaxRadius: 10,
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
};

export const mockOrders: Order[] = [
  {
    id: 'ORD-20241226-001',
    customerPhone: '(415) 555-1234',
    orderType: 'delivery',
    items: [
      { id: '1', name: 'Kung Pao Chicken', quantity: 2, price: 15.99 },
      { id: '2', name: 'Fried Rice', quantity: 1, price: 12.99 },
      { id: '3', name: 'Spring Rolls', quantity: 2, price: 6.99 },
    ],
    subtotal: 58.95,
    deliveryFee: 5.99,
    tax: 5.31,
    tips: 8.00,
    total: 78.25,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryAddress: '567 Oak Avenue, Apt 2B, San Francisco, CA 94103',
    status: 'pending',
    createdAt: '2024-12-26T10:30:00Z',
  },
  {
    id: 'ORD-20241226-002',
    customerPhone: '(415) 555-5678',
    orderType: 'pickup',
    items: [
      { id: '4', name: 'General Tso Chicken', quantity: 1, price: 14.99 },
      { id: '5', name: 'Hot and Sour Soup', quantity: 2, price: 5.99 },
    ],
    subtotal: 26.97,
    deliveryFee: 0,
    tax: 2.43,
    tips: 0,
    total: 29.40,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    status: 'pending',
    createdAt: '2024-12-26T11:15:00Z',
  },
  {
    id: 'ORD-20241225-003',
    customerPhone: '(415) 555-9012',
    orderType: 'delivery',
    items: [
      { id: '6', name: 'Sweet and Sour Pork', quantity: 1, price: 16.99 },
      { id: '7', name: 'Chow Mein', quantity: 1, price: 13.99 },
      { id: '8', name: 'Egg Drop Soup', quantity: 1, price: 4.99 },
    ],
    subtotal: 35.97,
    deliveryFee: 4.99,
    tax: 3.24,
    tips: 6.00,
    total: 50.20,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryAddress: '789 Pine Street, San Francisco, CA 94108',
    status: 'completed',
    createdAt: '2024-12-25T18:45:00Z',
  },
  {
    id: 'ORD-20241225-004',
    customerPhone: '(415) 555-3456',
    orderType: 'pickup',
    items: [
      { id: '9', name: 'Beef with Broccoli', quantity: 2, price: 15.99 },
    ],
    subtotal: 31.98,
    deliveryFee: 0,
    tax: 2.88,
    tips: 5.00,
    total: 39.86,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'completed',
    createdAt: '2024-12-25T12:30:00Z',
  },
  {
    id: 'ORD-20241224-005',
    customerPhone: '(415) 555-7890',
    orderType: 'delivery',
    items: [
      { id: '10', name: 'Mongolian Beef', quantity: 1, price: 17.99 },
      { id: '11', name: 'Vegetable Fried Rice', quantity: 1, price: 11.99 },
    ],
    subtotal: 29.98,
    deliveryFee: 5.99,
    tax: 2.70,
    tips: 5.00,
    total: 43.67,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryAddress: '321 Cedar Lane, San Francisco, CA 94110',
    status: 'completed',
    createdAt: '2024-12-24T19:00:00Z',
  },
  {
    id: 'ORD-20241224-006',
    customerPhone: '(415) 555-2345',
    orderType: 'delivery',
    items: [
      { id: '12', name: 'Orange Chicken', quantity: 1, price: 14.99 },
    ],
    subtotal: 14.99,
    deliveryFee: 5.99,
    tax: 1.35,
    tips: 3.00,
    total: 25.33,
    paymentMethod: 'card',
    paymentStatus: 'failed',
    deliveryAddress: '456 Elm Street, San Francisco, CA 94112',
    status: 'cancelled',
    cancelReason: 'Payment failed',
    createdAt: '2024-12-24T13:20:00Z',
  },
];

export const mockPaymentRecords: PaymentRecord[] = [
  {
    id: 'PAY-001',
    date: '2024-12-20',
    amount: 2456.78,
    status: 'completed',
    method: 'ach',
    bankAccount: '****4567',
  },
  {
    id: 'PAY-002',
    date: '2024-12-13',
    amount: 1823.45,
    status: 'completed',
    method: 'ach',
    bankAccount: '****4567',
  },
  {
    id: 'PAY-003',
    date: '2024-12-06',
    amount: 2134.90,
    status: 'completed',
    method: 'ach',
    bankAccount: '****4567',
  },
  {
    id: 'PAY-004',
    date: '2024-11-29',
    amount: 1967.32,
    status: 'completed',
    method: 'ach',
    bankAccount: '****4567',
  },
];

export const getFinanceStats = (period: 'today' | 'week' | 'month'): FinanceStats => {
  const stats: Record<string, FinanceStats> = {
    today: {
      orderCount: 12,
      totalAmount: 458.90,
      deliveryFee: 35.94,
      platformFee: 22.95,
      settlementAmount: 400.01,
      settledAmount: 0,
      pendingAmount: 400.01,
    },
    week: {
      orderCount: 87,
      totalAmount: 3245.67,
      deliveryFee: 245.78,
      platformFee: 162.28,
      settlementAmount: 2837.61,
      settledAmount: 2456.78,
      pendingAmount: 380.83,
    },
    month: {
      orderCount: 342,
      totalAmount: 12567.89,
      deliveryFee: 956.34,
      platformFee: 628.39,
      settlementAmount: 10983.16,
      settledAmount: 8382.45,
      pendingAmount: 2600.71,
    },
  };
  return stats[period];
};

export const mockDailyStats = [
  { date: '12/20', orders: 45, amount: 1678.90 },
  { date: '12/21', orders: 52, amount: 1923.45 },
  { date: '12/22', orders: 38, amount: 1456.78 },
  { date: '12/23', orders: 61, amount: 2234.56 },
  { date: '12/24', orders: 73, amount: 2789.12 },
  { date: '12/25', orders: 28, amount: 1045.67 },
  { date: '12/26', orders: 12, amount: 458.90 },
];

// 银行账户 Mock 数据
export const mockBankAccounts: BankAccount[] = [
  {
    id: 'bank_001',
    bankName: 'Chase Bank',
    accountType: 'checking',
    accountNumber: '****4567',
    routingNumber: '****1234',
    isDefault: true,
    createdAt: '2024-06-15T00:00:00Z',
  },
  {
    id: 'bank_002',
    bankName: 'Bank of America',
    accountType: 'savings',
    accountNumber: '****8901',
    routingNumber: '****5678',
    isDefault: false,
    createdAt: '2024-08-20T00:00:00Z',
  },
];

// 提现余额 Mock 数据
export const mockWithdrawalBalance: WithdrawalBalance = {
  availableAmount: 2600.71,    // 与 pendingAmount 对应
  frozenAmount: 458.90,        // 今日订单金额暂时冻结
  processingAmount: 500.00,    // 有一笔提现处理中
  totalWithdrawn: 15678.45,    // 历史累计提现
  minimumWithdrawal: 50.00,    // 最低提现 $50
  withdrawalFeeRate: 0,        // 免手续费
};

// 提现记录 Mock 数据
export const mockWithdrawalRecords: WithdrawalRequest[] = [
  {
    id: 'WD-20241226-001',
    amount: 500.00,
    fee: 0,
    actualAmount: 500.00,
    bankAccountId: 'bank_001',
    bankAccountInfo: 'Chase ****4567',
    status: 'processing',
    createdAt: '2024-12-26T09:00:00Z',
    processedAt: '2024-12-26T10:30:00Z',
  },
  {
    id: 'WD-20241220-001',
    amount: 2000.00,
    fee: 0,
    actualAmount: 2000.00,
    bankAccountId: 'bank_001',
    bankAccountInfo: 'Chase ****4567',
    status: 'completed',
    createdAt: '2024-12-20T14:00:00Z',
    processedAt: '2024-12-20T15:00:00Z',
    completedAt: '2024-12-21T10:00:00Z',
  },
  {
    id: 'WD-20241215-001',
    amount: 1500.00,
    fee: 0,
    actualAmount: 1500.00,
    bankAccountId: 'bank_001',
    bankAccountInfo: 'Chase ****4567',
    status: 'completed',
    createdAt: '2024-12-15T11:00:00Z',
    processedAt: '2024-12-15T12:00:00Z',
    completedAt: '2024-12-16T09:00:00Z',
  },
  {
    id: 'WD-20241210-001',
    amount: 800.00,
    fee: 0,
    actualAmount: 800.00,
    bankAccountId: 'bank_002',
    bankAccountInfo: 'Bank of America ****8901',
    status: 'failed',
    failReason: 'Bank account verification failed',
    createdAt: '2024-12-10T16:00:00Z',
    processedAt: '2024-12-10T17:00:00Z',
  },
  {
    id: 'WD-20241205-001',
    amount: 1200.00,
    fee: 0,
    actualAmount: 1200.00,
    bankAccountId: 'bank_001',
    bankAccountInfo: 'Chase ****4567',
    status: 'completed',
    createdAt: '2024-12-05T10:00:00Z',
    processedAt: '2024-12-05T11:00:00Z',
    completedAt: '2024-12-06T08:00:00Z',
  },
];
