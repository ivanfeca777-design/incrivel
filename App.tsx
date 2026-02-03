
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useParams, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Product, CartItem, Order } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES, STORE_INFO } from './constants';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import GeminiAssistant from './components/GeminiAssistant';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import TrackOrderPage from './components/TrackOrderPage';
import CheckoutPage from './components/CheckoutPage';
import SupportPage from './components/SupportPage';
import UserProfilePage from './components/UserProfilePage';

// --- Componente de Proteção de Rota ---
const AuthGuard: React.FC<{ children: React.ReactNode, userRole: 'admin' | 'user' | null }> = ({ children, userRole }) => {
  const location = useLocation();
  if (!userRole) {
    // Redireciona para login se não houver sessão ativa
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// --- Tela de Boas-Vindas (Portão de Entrada Obrigatório) ---
const WelcomeScreen: React.FC<{ userRole: 'admin' | 'user' | null }> = ({ userRole }) => {
  const navigate = useNavigate();
  
  // Redirecionamento automático se já estiver logado
  useEffect(() => {
    if (userRole) {
      navigate('/home');
    }
  }, [userRole, navigate]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#0F172A] flex items-center justify-center overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 opacity-20 scale-110">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80" 
          className="w-full h-full object-cover" 
          alt="Luxury Background" 
        />
      </div>
      
      {/* Conteúdo Central */}
      <div className="relative z-10 text-center px-4 max-w-lg w-full animate-in fade-in zoom-in duration-1000">
        <div className="mb-10 flex justify-center">
          <div className="w-28 h-28 bg-amber-500 rounded-[36px] flex items-center justify-center shadow-[0_20px_50px_rgba(251,191,36,0.3)] rotate-12 transition-transform hover:rotate-0 duration-500">
            <i className="fa-solid fa-gem text-white text-5xl"></i>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-heading font-black text-white mb-4 uppercase italic tracking-tighter leading-none">
          Amazing <span className="text-amber-500">Shop</span>
        </h1>
        
        <div className="h-1 w-20 bg-amber-500 mx-auto mb-6 rounded-full"></div>
        
        <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-12 italic">
          Onde a Exclusividade Encontra o Estilo • Luanda
        </p>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-white text-[#0F172A] px-12 py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 group"
          >
            <i className="fa-solid fa-right-to-bracket text-lg group-hover:translate-x-1 transition-transform"></i>
            Aceder à Minha Conta
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-transparent border-2 border-white/10 text-white px-12 py-5 rounded-2xl font-heading font-black uppercase tracking-widest text-xs hover:bg-white/5 hover:border-white/30 transition-all flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-user-plus text-lg"></i>
            Tornar-me Membro
          </button>
        </div>
        
        <div className="mt-16 flex justify-center gap-8 opacity-30">
          <i className="fa-brands fa-cc-visa text-white text-2xl"></i>
          <i className="fa-brands fa-cc-mastercard text-white text-2xl"></i>
          <i className="fa-solid fa-shield-halved text-white text-2xl"></i>
        </div>
        
        <p className="mt-10 text-[9px] text-gray-500 uppercase tracking-widest font-black">
          &copy; 2025 Amazing Shop Lda. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

// --- Estrutura Principal da Loja ---
const MainStoreLayout: React.FC<{ products: Product[], cart: CartItem[], orders: Order[], userRole: 'admin' | 'user' | null, onAddToCart: (p: Product) => void, onUpdateQuantity: (id: string, delta: number) => void, onRemoveFromCart: (id: string) => void, onOrderComplete: (order: Order) => void, onUpdateProducts: (p: Product[]) => void, onUpdateOrders: (o: Order[]) => void, onLogout: () => void, clearCart: () => void }> = ({ products, cart, orders, userRole, onAddToCart, onUpdateQuantity, onRemoveFromCart, onOrderComplete, onUpdateProducts, onUpdateOrders, onLogout, clearCart }) => {
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AuthGuard userRole={userRole}>
      <Navbar cartCount={cartCount} />
      <main className="flex-grow">
        <Routes>
          <Route path="/home" element={<HomePage products={products} onAddToCart={onAddToCart} />} />
          <Route path="/products" element={<ProductsPage products={products} onAddToCart={onAddToCart} />} />
          <Route path="/product/:id" element={<ProductDetailPage products={products} onAddToCart={onAddToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} onUpdateQuantity={onUpdateQuantity} onRemove={onRemoveFromCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} onOrderComplete={onOrderComplete} clearCart={clearCart} />} />
          <Route path="/track-order" element={<TrackOrderPage orders={orders} />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/profile" element={<UserProfilePage orders={orders} onLogout={onLogout} />} />
          <Route path="/about" element={<div className="py-32 text-center px-4"><h1 className="text-7xl font-heading font-black mb-10 uppercase italic tracking-tight text-[#0F172A]">Amazing <span className="text-amber-500">Shop</span></h1><p className="text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto italic">Excelência em cada detalhe.</p></div>} />
          
          {/* Dashboard do Gestor */}
          <Route path="/admin" element={
            userRole === 'admin' ? (
              <AdminDashboard 
                products={products} 
                orders={orders} 
                onUpdateProducts={onUpdateProducts} 
                onUpdateOrders={onUpdateOrders}
                onLogout={onLogout} 
              />
            ) : (
              <Navigate to="/home" replace />
            )
          } />
        </Routes>
      </main>
      <Footer />
      <GeminiAssistant />
    </AuthGuard>
  );
};

// --- Páginas de Conteúdo (Simplificadas para o App.tsx) ---
const HomePage: React.FC<{ products: Product[], onAddToCart: (p: Product) => void }> = ({ products, onAddToCart }) => {
  const featured = products.slice(0, 6);
  return (
    <div className="animate-in fade-in duration-700">
      <section className="relative h-[80vh] flex items-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 opacity-40"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover" alt="" /></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-7xl md:text-9xl font-heading font-black text-white mb-8 uppercase italic leading-[0.85] tracking-tighter">Viva o<br/><span className="text-amber-500">Incrível</span></h1>
          <Link to="/products" className="bg-amber-500 text-[#0F172A] px-12 py-6 rounded-2xl font-heading font-black uppercase tracking-widest inline-block hover:bg-white transition-all shadow-2xl">Explorar Coleção</Link>
        </div>
      </section>
      <section className="py-24 max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-heading font-black text-[#0F172A] mb-16 uppercase italic tracking-tight">Destaques <span className="text-amber-500">Premium</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {featured.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
        </div>
      </section>
    </div>
  );
};

// --- Componente Root ---
const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('amazing_shop_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('amazing_shop_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(() => {
    return sessionStorage.getItem('amazing_user_role') as 'admin' | 'user' | null;
  });

  useEffect(() => {
    localStorage.setItem('amazing_shop_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('amazing_shop_orders', JSON.stringify(orders));
  }, [orders]);

  const handleLogin = (role: 'admin' | 'user') => {
    setUserRole(role);
    sessionStorage.setItem('amazing_user_role', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    sessionStorage.removeItem('amazing_user_role');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans selection:bg-amber-200 antialiased">
        <Routes>
          <Route path="/" element={<WelcomeScreen userRole={userRole} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLogin} />} />
          
          <Route path="/*" element={
            <MainStoreLayout 
              products={products}
              cart={cart}
              orders={orders}
              userRole={userRole}
              onAddToCart={addToCart}
              onUpdateQuantity={(id, delta) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i))}
              onRemoveFromCart={(id) => setCart(prev => prev.filter(i => i.id !== id))}
              onOrderComplete={(order) => setOrders(prev => [order, ...prev])}
              onUpdateProducts={setProducts}
              onUpdateOrders={setOrders}
              onLogout={handleLogout}
              clearCart={() => setCart([])}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
};

const ProductsPage: React.FC<{ products: Product[], onAddToCart: (p: Product) => void }> = ({ products, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);
  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10 border-b border-gray-100 pb-12">
        <h1 className="text-5xl font-heading font-black text-[#0F172A] uppercase italic tracking-tight">Catálogo <span className="text-amber-500">2025</span></h1>
        <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-2xl">
          <button onClick={() => setActiveCategory('all')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeCategory === 'all' ? 'bg-[#0F172A] text-white' : 'text-gray-500'}`}>Tudo</button>
          {CATEGORIES.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeCategory === cat.id ? 'bg-[#0F172A] text-white' : 'text-gray-500'}`}>{cat.name}</button>)}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}
      </div>
    </div>
  );
};

const ProductDetailPage: React.FC<{ products: Product[], onAddToCart: (p: Product) => void }> = ({ products, onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const navigate = useNavigate();
  if (!product) return null;
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <button onClick={() => navigate(-1)} className="mb-12 text-[#0F172A] font-black uppercase tracking-widest text-[10px] flex items-center gap-3"><i className="fa-solid fa-arrow-left"></i> Voltar</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-2xl flex items-center justify-center">
          <img src={product.image} className="max-w-full max-h-[500px] object-contain" alt={product.name} />
        </div>
        <div>
          <span className="text-amber-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">{product.category}</span>
          <h1 className="text-6xl font-heading font-black text-[#0F172A] mb-8 uppercase italic leading-none">{product.name}</h1>
          <p className="text-xl text-gray-500 font-medium mb-12 leading-relaxed border-l-4 border-amber-500 pl-8 py-4">{product.description}</p>
          <div className="mt-auto">
            <span className="text-6xl font-heading font-black text-[#0F172A] tracking-tighter">{product.price.toLocaleString('pt-AO')} <span className="text-2xl opacity-20 ml-2 font-bold">KZ</span></span>
            <button onClick={() => onAddToCart(product)} className="w-full mt-12 bg-[#0F172A] text-white py-8 rounded-[24px] font-heading font-black uppercase tracking-widest text-sm hover:bg-amber-500 transition-all shadow-2xl">Adicionar ao Carrinho</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage: React.FC<{ cart: CartItem[], onUpdateQuantity: (id: string, delta: number) => void, onRemove: (id: string) => void }> = ({ cart, onUpdateQuantity, onRemove }) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  if (cart.length === 0) return <div className="py-32 text-center"><h2 className="text-4xl font-heading font-black mb-10 uppercase italic text-[#0F172A]">O seu saco está vazio</h2><Link to="/products" className="bg-[#0F172A] text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest inline-block hover:bg-amber-500 transition-all">Começar Shopping</Link></div>;
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <h1 className="text-6xl font-heading font-black mb-16 uppercase italic text-[#0F172A]">Meu <span className="text-amber-500">Carrinho</span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center">
              <div className="w-32 h-32 bg-gray-50 rounded-2xl p-4 flex-shrink-0"><img src={item.image} className="w-full h-full object-contain" /></div>
              <div className="ml-8 flex-grow">
                <div className="flex justify-between items-start"><h3 className="text-2xl font-heading font-black uppercase italic text-[#0F172A]">{item.name}</h3><button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button></div>
                <div className="flex justify-between items-center mt-8">
                  <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-5 py-3 hover:bg-[#0F172A] hover:text-white transition-colors"><i className="fa-solid fa-minus text-xs"></i></button>
                    <span className="w-10 text-center font-black">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-5 py-3 hover:bg-[#0F172A] hover:text-white transition-colors"><i className="fa-solid fa-plus text-xs"></i></button>
                  </div>
                  <span className="text-2xl font-heading font-black text-[#0F172A]">{(item.price * item.quantity).toLocaleString('pt-AO')} KZ</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#0F172A] p-10 rounded-[40px] text-white shadow-2xl h-fit">
          <h2 className="text-2xl font-heading font-black mb-10 uppercase italic">Resumo</h2>
          <div className="pt-8 border-t border-white/10 flex justify-between items-baseline"><span className="text-lg font-bold text-gray-500 uppercase italic">Total</span><span className="text-4xl font-heading font-black text-amber-500">{(subtotal).toLocaleString('pt-AO')} <span className="text-lg font-bold">KZ</span></span></div>
          <Link to="/checkout" className="block w-full bg-amber-500 text-[#0F172A] text-center py-6 mt-12 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all">Seguir para Pagamento</Link>
        </div>
      </div>
    </div>
  );
};

export default App;
