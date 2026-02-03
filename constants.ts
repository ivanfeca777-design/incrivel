
import { Product, Category } from './types';

export const STORE_INFO = {
  name: 'Amazing Shop',
  legalName: 'Feca Shop Lda',
  nif: '5000777123',
  email: 'ivanfeca777@gmail.com',
  phone: '921179574',
  whatsapp: '+244921179574',
  address: 'Rua do Comércio, 123, Luanda, Angola',
  banking: [
    { bank: 'BAI', iban: 'AO06 0040 0000 7777 8888 1015 6', holder: 'Feca Shop Lda' },
    { bank: 'BFA', iban: 'AO06 0006 0000 1111 2222 3014 5', holder: 'Feca Shop Lda' }
  ]
};

export const CATEGORIES: Category[] = [
  { id: 'electronics', name: 'Eletrónicos & Gaming', icon: 'fa-gamepad' },
  { id: 'fashion', name: 'Mochilas & Estilo', icon: 'fa-bag-shopping' },
  { id: 'electrical', name: 'Material Elétrico', icon: 'fa-bolt' },
  { id: 'machinery', name: 'Maquinaria & Escritório', icon: 'fa-print' },
  { id: 'lifestyle', name: 'Lifestyle & Desporto', icon: 'fa-bicycle' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'g1',
    name: 'Consola PlayStation 5 Digital Edition',
    description: 'A nova fronteira do gaming. SSD de ultra-alta velocidade, feedback háptico e áudio 3D.',
    price: 485000,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop',
    rating: 5.0,
    reviews: 450,
    stock: 5
  },
  {
    id: 'g2',
    name: 'Auscultadores Sony WH-1000XM5',
    description: 'O melhor cancelamento de ruído do mercado com qualidade de som líder na indústria.',
    price: 295000,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    reviews: 128,
    stock: 12
  },
  {
    id: 'e20',
    name: 'iPhone 15 Pro Max 256GB Titanio',
    description: 'Design robusto e leve em titânio de qualidade aeroespacial com o novo botão de Ação.',
    price: 1250000,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000&auto=format&fit=crop',
    rating: 5.0,
    reviews: 82,
    stock: 3
  },
  {
    id: 'f1',
    name: 'Mochila Urbana Anti-Roubo Pro',
    description: 'Design minimalista com fechos ocultos e material resistente a cortes. Ideal para Luanda.',
    price: 45000,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    reviews: 34,
    stock: 20
  }
];
