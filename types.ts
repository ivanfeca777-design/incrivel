
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  trackingCode: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
