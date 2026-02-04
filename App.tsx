
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
import AdminLoginPage from './components/AdminLoginPage';
import TrackOrderPage from './components/TrackOrderPage';
import CheckoutPage from './components/CheckoutPage';
import SupportPage from './components/SupportPage';
import UserProfilePage from './components/UserProfilePage';

// --- Componente de Proteção de Rota ---
const AuthGuard: React.FC<{ children: React.ReactNode, userRole: 'admin' | 'user' | null }> = ({ children, userRole }) => {
  const location = useLocation();
  if (!userRole) {
    // Redireciona para o portal de entrada se não houver sessão
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// --- Portal de Entrada (Welcome + Login Integrado) ---
const WelcomePortal: React.FC<{ onLoginSuccess: (role: 'admin' | 'user') => void, userRole: 'admin' | 'user' | null }> = ({ onLoginSuccess, userRole }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (userRole === 'admin') navigate('/admin');
    else if (userRole === 'user') navigate('/home');
  }, [userRole, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F172A]">
      {/* Background Imersivo com Camadas */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-40" 
          alt="Premium Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
      </div>

      {/* Conteúdo do Portal */}
      <div className="relative z-10 w-full max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Lado Esquerdo: Mensagem de Boas-Vindas */}
        <div className="hidden lg:block space-y-8 animate-in slide-in-from-left duration-1000">
          <div className="w-24 h-24 bg-amber-500 rounded-[32px] flex items-center justify-center shadow-[0_20px_50px_rgba(251,191,36,0.3)] rotate-6">
            <i className="fa-solid fa-gem text-white text-4xl"></i>
          </div>
          <div>
            <h1 className="text-8xl font-heading font-black text-white uppercase italic tracking-tighter leading-none">
              Amazing <br />
              <span className="text-amber-500">Shop</span>
            </h1>
            <div className="h-2 w-32 bg-amber-500 mt-6 rounded-full"></div>
          </div>
          <p className="text-gray-400 text-xl font-medium italic max-w-md leading-relaxed">
            "Descubra uma curadoria exclusiva onde o design premium encontra a tecnologia de ponta. Bem-vindo ao extraordinário."
          </p>
          <div className="flex items-center gap-6 pt-4">
             <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-[#0F172A]" alt="User" />
               ))}
             </div>
             <p className="text-xs font-black text-white uppercase tracking-widest">+5k Clientes Satisfeitos em Luanda</p>
          </div>
        </div>

        {/* Lado Direito: Formulário de Login */}
        <div className="animate-in zoom-in duration-700 delay-200">
           <LoginPage onLoginSuccess={onLoginSuccess} />
        </div>
      </div>

      {/* Footer do Portal */}
      <div className="absolute bottom-10 left-0 w-full text-center z-10">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.6em] italic">Amazing Shop &copy; 2025 • Luanda, Angola</p>
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
          
          <Route path="/admin" element={
            userRole === 'admin' ? (
              <AdminDashboard 
                products={products} 
                orders={orders} 
                onUpdateProducts={onUpdateProducts} 
                onUpdateOrders={onUpdateOrders}
                onLogout={onLogout} 
              />
            ) : <Navigate to="/home" replace />
          } />
        </Routes>
      </main>
      <Footer />
      <GeminiAssistant />
    </AuthGuard>
  );
};

// Fix: Adding ProductsPage component to resolve missing reference
const ProductsPage: React.FC<{ products: Product[], onAddToCart: (p: Product) => void }> = ({ products, onAddToCart }) => {
  return (
    <div className="py-24 max-w-7xl mx-auto px-4 animate-in fade-in duration-700">
      <h1 className="text-5xl font-heading font-black text-[#0F172A] mb-16 uppercase italic tracking-tighter">Coleção <span className="text-amber-500">Completa</span></h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
      </div>
    </div>
  );
};

// Fix: Adding ProductDetailPage component to resolve missing reference
const ProductDetailPage: React.FC<{ products: Product[], onAddToCart: (p: Product) => void }> = ({ products, onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const navigate = useNavigate();

  if (!product) return <div className="py-40 text-center"><h2 className="text-2xl font-black text-[#0F172A]">Produto não encontrado</h2><button onClick={() => navigate('/products')} className="mt-4 text-amber-500 font-black uppercase tracking-widest text-xs">Voltar à loja</button></div>;

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="bg-white p-12 rounded-[48px] border border-gray-100 shadow-sm aspect-square flex items-center justify-center overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        </div>
        <div className="space-y-8">
          <span className="bg-[#0F172A] text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em]">{product.category}</span>
          <h1 className="text-5xl font-heading font-black text-[#0F172A] uppercase italic leading-tight tracking-tighter">{product.name}</h1>
          <p className="text-gray-500 text-lg leading-relaxed italic">"{product.description}"</p>
          <div className="flex items-center gap-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-gray-100'}`}></i>
              ))}
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.reviews} reviews verificadas</span>
          </div>
          <div className="text-5xl font-heading font-black text-[#0F172A] tracking-tighter">
            {product.price.toLocaleString('pt-AO')} <span className="text-xl">KZ</span>
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="w-full bg-[#0F172A] text-white py-8 rounded-[32px] font-heading font-black uppercase tracking-[0.3em] text-sm hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-2xl active:scale-95"
          >
            Adicionar ao Carrinho <i className="fa-solid fa-cart-plus ml-4"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

// Fix: Adding CartPage component to resolve missing reference
const CartPage: React.FC<{ cart: CartItem[], onUpdateQuantity: (id: string, delta: number) => void, onRemove: (id: string) => void }> = ({ cart, onUpdateQuantity, onRemove }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="py-40 text-center animate-in zoom-in">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl text-gray-300">
          <i className="fa-solid fa-shopping-bag"></i>
        </div>
        <h2 className="text-3xl font-heading font-black text-[#0F172A] uppercase italic mb-4">Carrinho Vazio</h2>
        <p className="text-gray-400 font-medium mb-10 italic">O seu cesto de compras ainda não tem itens extraordinários.</p>
        <button onClick={() => navigate('/products')} className="bg-[#0F172A] text-white px-12 py-6 rounded-2xl font-heading font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all">Começar a Comprar</button>
      </div>
    );
  }

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 animate-in fade-in duration-700">
      <h1 className="text-5xl font-heading font-black text-[#0F172A] mb-16 uppercase italic tracking-tighter">O Seu <span className="text-amber-500">Carrinho</span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-8 group">
              <div className="w-24 h-24 bg-gray-50 rounded-3xl flex-shrink-0 p-4">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-heading font-black text-lg text-[#0F172A] uppercase italic leading-tight mb-2">{item.name}</h3>
                <p className="text-sm font-black text-amber-500">{item.price.toLocaleString('pt-AO')} KZ</p>
              </div>
              <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-2xl">
                <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-[#0F172A] hover:text-amber-500 transition-colors"><i className="fa-solid fa-minus"></i></button>
                <span className="font-black w-4 text-center">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-[#0F172A] hover:text-amber-500 transition-colors"><i className="fa-solid fa-plus"></i></button>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-gray-200 hover:text-red-500 transition-colors p-4"><i className="fa-solid fa-trash-can"></i></button>
            </div>
          ))}
        </div>
        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm h-fit sticky top-32">
          <h2 className="text-2xl font-heading font-black text-[#0F172A] uppercase italic mb-8 border-b border-gray-50 pb-6">Resumo</h2>
          <div className="space-y-4 mb-10">
             <div className="flex justify-between text-[10px] font-black uppercase text-gray-400"><span>Subtotal</span><span>{subtotal.toLocaleString('pt-AO')} KZ</span></div>
             <div className="flex justify-between text-[10px] font-black uppercase text-gray-400"><span>Frete</span><span className="text-amber-600">Calculado no Checkout</span></div>
          </div>
          <div className="border-t-2 border-[#0F172A] pt-6 flex justify-between items-baseline mb-10">
             <span className="font-heading font-black uppercase text-xl italic text-[#0F172A]">Total</span>
             <span className="text-4xl font-heading font-black text-amber-500 leading-none">{subtotal.toLocaleString('pt-AO')} <span className="text-sm">KZ</span></span>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full bg-[#0F172A] text-white py-6 rounded-3xl font-heading font-black uppercase tracking-widest text-xs hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-xl">Prosseguir para Checkout</button>
        </div>
      </div>
    </div>
  );
};

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

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans selection:bg-amber-200 antialiased bg-gray-50">
        <Routes>
          <Route path="/" element={<WelcomePortal onLoginSuccess={handleLogin} userRole={userRole} />} />
          <Route path="/admin-control" element={<AdminLoginPage onLoginSuccess={handleLogin} />} />
          
          <Route path="/*" element={
            <MainStoreLayout 
              products={products}
              cart={cart}
              orders={orders}
              userRole={userRole}
              onAddToCart={(product: Product) => setCart(prev => {
                const existing = prev.find(item => item.id === product.id);
                if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                return [...prev, { ...product, quantity: 1 }];
              })}
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

export default App;
