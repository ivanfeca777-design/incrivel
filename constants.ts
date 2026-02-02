
import { Product, Category } from './types';

export const STORE_INFO = {
  name: 'Amazing Shop',
  email: 'ivanfeca777@gmail.com',
  phone: '921179574',
  whatsapp: '+244921179574',
  address: 'Rua do Comércio, 123, Luanda, Angola',
  banking: [
    { bank: 'BAI', iban: 'AO06 0040 0000 7777 8888 1015 6', holder: 'Amazing Shop Lda' },
    { bank: 'BFA', iban: 'AO06 0006 0000 1111 2222 3014 5', holder: 'Amazing Shop Lda' }
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
  // --- GAMING & ELETRÓNICOS ---
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

  // --- MOCHILAS & ESTILO ---
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
  },
  {
    id: 'f2',
    name: 'Mochila Executiva Premium em Pele',
    description: 'Elegância e funcionalidade para o profissional moderno. Compartimento acolchoado para laptop.',
    price: 85000,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    reviews: 15,
    stock: 6
  },

  // --- MATERIAL ELÉTRICO ---
  {
    id: 'el1',
    name: 'Quadro Elétrico Hager 24 Módulos',
    description: 'A solução definitiva em proteção residencial. Robustez e facilidade de montagem Hager.',
    price: 95000,
    category: 'electrical',
    image: 'https://images.unsplash.com/photo-1558002038-1037906d9927?q=80&w=1000&auto=format&fit=crop',
    rating: 5.0,
    reviews: 22,
    stock: 10
  },
  {
    id: 'el2',
    name: 'Disjuntor Hager 1P+N 16A',
    description: 'Proteção magnetotérmica de alta precisão. O padrão ouro em instalações elétricas.',
    price: 4500,
    category: 'electrical',
    image: 'https://images.unsplash.com/photo-1626242342936-48bc087f59f9?q=80&w=1000&auto=format&fit=crop',
    rating: 5.0,
    reviews: 156,
    stock: 100
  },

  // --- MAQUINARIA ---
  {
    id: 'ma1',
    name: 'Prensa Térmica 8 em 1 para Sublimação',
    description: 'Crie o seu negócio. Personalize t-shirts, canecas, bonés e muito mais com alta precisão.',
    price: 385000,
    category: 'machinery',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=1000&auto=format&fit=crop',
    rating: 4.7,
    reviews: 18,
    stock: 4
  },

  // --- LIFESTYLE ---
  {
    id: 'li1',
    name: 'Bicicleta Vintage Classic Edition',
    description: 'Estilo retro com mecânica moderna. Perfeita para passeios na Marginal de Luanda.',
    price: 185000,
    category: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    reviews: 29,
    stock: 5
  }
];
