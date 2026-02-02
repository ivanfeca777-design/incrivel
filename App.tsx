
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useParams, Link, useNavigate, Navigate } from 'react-router-dom';
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

// --- Tela de Boas-Vindas ---
const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[200] bg-[#0F172A] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover" alt="" />
      </div>
      <div className="relative z-10 text-center px-4 animate-in fade-in zoom-in duration-1000">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-amber-500 rounded-[32px] flex items-center justify-center shadow-2xl shadow-amber-500/20 rotate-12">
            <i className="fa-solid fa-shopping-bag text-white text-4xl"></i>
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-heading font-black text-white mb-4 uppercase italic tracking-tighter">
          Amazing <span className="text-amber-500">Shop</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-[0.5em] text-xs mb-12">A Excelência do Comércio em Angola</p>
        <button 
          onClick={() => navigate('/home')}
          className="bg-white text-[#0F172A] px-12 py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-2xl active:scale-95"
        >
          Entrar na Experiência
        </button>
      </div>
    </div>
  );
};

// --- Páginas de Conteúdo ---
const HomePage: React.FC<{ products: Product[], onAddToCart: (p: Product) => void }> = ({ products, onAddToCart }) => {
  const featuredProducts = products.slice(0, 12);
  return (
    <div className="animate-in fade-in duration-700">
      <section className="relative min-h-[600px] flex items-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 mb-8 rounded-full bg-amber-500 text-[#0F172A] font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl">Angola Premium Selection</div>
            <h1 className="text-6xl md:text-8xl font-heading font-black text-white mb-8 leading-[0.85] tracking-tight uppercase italic">Eleve o seu <br/><span className="text-amber-500 underline decoration-white/20">Quotidiano</span></h1>
            <Link to="/products" className="bg-amber-500 hover:bg-white text-[#0F172A] px-12 py-6 rounded-2xl font-heading font-black transition-all shadow-2xl text-center uppercase tracking-wider text-sm inline-block">Explorar Coleção</Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-[#0F172A] tracking-tight uppercase italic">Os mais <span className="text-amber-500">Desejados</span></h2>
            <Link to="/products" className="text-[#0F172A] font-extrabold hover:text-amber-600 text-[11px] uppercase tracking-[0.3em] flex items-center group transition-colors pb-1 border-b-2 border-amber-500/20">Ver Catálogo <i className="fa-solid fa-arrow-right-long ml-3 group-hover:translate-x-2 transition-transform"></i></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductsPage: React.FC<{ products: Product[], onAddToCart: (p: Product) => void }> = ({ products, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const filteredProducts = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);
  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10 border-b border-gray-100 pb-12">
        <h1 className="text-5xl font-heading font-black text-[#0F172A] tracking-tight uppercase italic">Coleção <span className="text-amber-500">2025</span></h1>
        <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-[22px] border border-gray-200">
          <button onClick={() => setActiveCategory('all')} className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeCategory === 'all' ? 'bg-[#0F172A] text-white' : 'text-gray-500'}`}>Tudo</button>
          {CATEGORIES.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeCategory === cat.id ? 'bg-[#0F172A] text-white' : 'text-gray-500'}`}>{cat.name}</button>)}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}
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
      <button onClick={() => navigate(-1)} className="mb-12 text-[#0F172A] font-bold uppercase tracking-widest text-[10px] flex items-center gap-3"><i className="fa-solid fa-arrow-left-long"></i> Voltar</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="rounded-[48px] overflow-hidden bg-white border border-gray-100 aspect-square shadow-2xl p-12 flex items-center justify-center">
          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
        </div>
        <div className="flex flex-col py-6">
          <span className="text-amber-600 font-bold uppercase tracking-[0.4em] text-[11px] mb-6">{product.category}</span>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-[#0F172A] mb-8 uppercase italic tracking-tight leading-[0.9]">{product.name}</h1>
          <p className="text-xl text-gray-500 font-medium mb-12 leading-relaxed border-l-4 border-amber-500 pl-10 py-6">{product.description}</p>
          <div className="mt-auto pt-12">
            <span className="text-6xl font-heading font-black text-[#0F172A] tracking-tight">{product.price.toLocaleString('pt-AO')} <span className="text-2xl ml-2 opacity-30">KZ</span></span>
            <button onClick={() => onAddToCart(product)} className="w-full mt-12 bg-[#0F172A] text-white py-8 rounded-[24px] font-heading font-black uppercase tracking-[0.2em] text-sm hover:bg-amber-500 transition-all shadow-2xl">Adicionar ao Carrinho</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage: React.FC<{ cart: CartItem[], onUpdateQuantity: (id: string, delta: number) => void, onRemove: (id: string) => void }> = ({ cart, onUpdateQuantity, onRemove }) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  if (cart.length === 0) return <div className="py-24 text-center"><h2 className="text-4xl font-heading font-black mb-8 uppercase italic tracking-tight text-[#0F172A]">O seu saco está vazio</h2><Link to="/products" className="bg-[#0F172A] text-white px-12 py-6 rounded-2xl font-heading font-black uppercase tracking-widest text-sm inline-block">Começar Shopping</Link></div>;
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <h1 className="text-6xl font-heading font-black mb-16 tracking-tight uppercase italic text-[#0F172A]">Meu <span className="text-amber-500">Carrinho</span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-8 rounded-[40px] flex flex-col sm:flex-row items-center shadow-sm border border-gray-100 group">
              <div className="w-40 h-40 flex-shrink-0 bg-white border border-gray-50 rounded-3xl p-4"><img src={item.image} className="w-full h-full object-contain" /></div>
              <div className="mt-6 sm:mt-0 sm:ml-10 flex-grow w-full">
                <div className="flex justify-between"><h3 className="text-2xl font-heading font-black text-[#0F172A] uppercase italic tracking-tight">{item.name}</h3><button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-all text-xl"><i className="fa-solid fa-xmark"></i></button></div>
                <div className="flex justify-between items-center mt-10">
                  <div className="flex items-center border-2 border-gray-100 rounded-2xl bg-gray-50">
                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-5 py-3 hover:bg-[#0F172A] hover:text-white transition-all"><i className="fa-solid fa-minus text-xs"></i></button>
                    <span className="w-12 text-center font-heading font-black text-lg">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-5 py-3 hover:bg-[#0F172A] hover:text-white transition-all"><i className="fa-solid fa-plus text-xs"></i></button>
                  </div>
                  <span className="text-3xl font-heading font-black text-[#0F172A] tracking-tight">{(item.price * item.quantity).toLocaleString('pt-AO')} KZ</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#0F172A] p-10 rounded-[48px] text-white shadow-2xl h-fit">
          <h2 className="text-2xl font-heading font-black mb-10 uppercase italic tracking-tight">Resumo</h2>
          <div className="pt-6 border-t border-white/10 flex justify-between items-end"><span className="text-xl font-heading font-black italic">Subtotal</span><span className="text-2xl font-heading font-black">{(subtotal).toLocaleString('pt-AO')} KZ</span></div>
          <p className="text-[10px] text-gray-500 uppercase mt-4">* Frete será calculado com GPS no próximo passo.</p>
          <Link to="/checkout" className="block w-full bg-amber-500 text-[#0F172A] text-center py-6 mt-12 rounded-[22px] font-heading font-black uppercase tracking-widest text-sm hover:bg-white transition-all">Seguir para Pagamento</Link>
        </div>
      </div>
    </div>
  );
};

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

  const updateProducts = (newProducts: Product[]) => setProducts(newProducts);
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const updateQuantity = (id: string, delta: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleOrderComplete = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const handleLogin = (role: 'admin' | 'user') => {
    setUserRole(role);
    sessionStorage.setItem('amazing_user_role', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    sessionStorage.removeItem('amazing_user_role');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans selection:bg-amber-200 antialiased">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/*" element={
            <>
              <Navbar cartCount={cartCount} />
              <main className="flex-grow">
                <Routes>
                  <Route path="/home" element={<HomePage products={products} onAddToCart={addToCart} />} />
                  <Route path="/products" element={<ProductsPage products={products} onAddToCart={addToCart} />} />
                  <Route path="/product/:id" element={<ProductDetailPage products={products} onAddToCart={addToCart} />} />
                  <Route path="/cart" element={<CartPage cart={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />} />
                  <Route path="/checkout" element={<CheckoutPage cart={cart} onOrderComplete={handleOrderComplete} clearCart={() => setCart([])} />} />
                  <Route path="/track-order" element={<TrackOrderPage orders={orders} />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/login" element={<LoginPage onLoginSuccess={handleLogin} />} />
                  
                  {/* Área Protegida do Gestor (Evaristo) */}
                  <Route path="/admin" element={
                    userRole === 'admin' ? (
                      <AdminDashboard products={products} orders={orders} onUpdateProducts={updateProducts} onLogout={handleLogout} />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } />

                  {/* Área Protegida do Cliente (Normal) */}
                  <Route path="/profile" element={
                    userRole === 'user' ? (
                      <UserProfilePage orders={orders} onLogout={handleLogout} />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } />

                  <Route path="/about" element={<div className="py-32 text-center px-4"><h1 className="text-7xl font-heading font-black mb-10 uppercase italic tracking-tight text-[#0F172A]">Amazing <span className="text-amber-500">Shop</span></h1><p className="text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto italic">Onde a inovação encontra a tradição Angolana.</p></div>} />
                </Routes>
              </main>
              <Footer />
              <GeminiAssistant />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
