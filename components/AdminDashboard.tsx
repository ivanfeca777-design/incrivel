
import React, { useState, useEffect, useRef } from 'react';
import { Product, Order } from '../types';
import { CATEGORIES, STORE_INFO } from '../constants';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onUpdateProducts: (products: Product[]) => void;
  onLogout: () => void;
}

type Tab = 'overview' | 'products' | 'orders' | 'reports' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, onUpdateProducts, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [editableProducts, setEditableProducts] = useState<Product[]>(products);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', description: '', category: CATEGORIES[0].id, price: 0, image: '', stock: 0, rating: 5.0, reviews: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setEditableProducts(products);
  }, [products]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Envie apenas imagens.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setNewProduct(prev => ({ ...prev, image: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remover produto definitivamente?')) {
      const updated = editableProducts.filter(p => p.id !== id);
      setEditableProducts(updated);
      onUpdateProducts(updated);
    }
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      alert('Preencha os campos obrigatórios.');
      return;
    }
    const productToAdd: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name!,
      description: newProduct.description || 'Sem descrição.',
      category: newProduct.category!,
      price: Number(newProduct.price),
      image: newProduct.image!,
      rating: 5,
      reviews: 0,
      stock: Number(newProduct.stock) || 0
    };
    const updated = [productToAdd, ...editableProducts];
    setEditableProducts(updated);
    onUpdateProducts(updated);
    setIsAddModalOpen(false);
    setNewProduct({ name: '', description: '', category: CATEGORIES[0].id, price: 0, image: '', stock: 0 });
  };

  const totalValue = editableProducts.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Administrativa */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-50">
        <div className="p-8 border-b border-white/5 text-center">
          <h2 className="font-heading font-black text-xl uppercase italic tracking-tighter text-amber-500">BackOffice</h2>
          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1 italic">Amazing Shop Global</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'overview' ? 'bg-amber-500 text-[#0F172A] font-bold shadow-xl shadow-amber-500/10' : 'hover:bg-white/5 text-gray-400'}`}>
            <i className="fa-solid fa-chart-line w-5"></i>
            <span className="text-[11px] uppercase tracking-widest font-black">Dash</span>
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'products' ? 'bg-amber-500 text-[#0F172A] font-bold shadow-xl shadow-amber-500/10' : 'hover:bg-white/5 text-gray-400'}`}>
            <i className="fa-solid fa-boxes-stacked w-5"></i>
            <span className="text-[11px] uppercase tracking-widest font-black">Stock</span>
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-amber-500 text-[#0F172A] font-bold shadow-xl shadow-amber-500/10' : 'hover:bg-white/5 text-gray-400'}`}>
            <i className="fa-solid fa-truck-fast w-5"></i>
            <span className="text-[11px] uppercase tracking-widest font-black">Pedidos</span>
          </button>
          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'reports' ? 'bg-amber-500 text-[#0F172A] font-bold shadow-xl shadow-amber-500/10' : 'hover:bg-white/5 text-gray-400'}`}>
            <i className="fa-solid fa-file-invoice-dollar w-5"></i>
            <span className="text-[11px] uppercase tracking-widest font-black">Vendas</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest">
            <i className="fa-solid fa-power-off"></i> Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-grow p-12 overflow-y-auto">
        
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter mb-10">Monitor de <span className="text-amber-500">Performance</span></h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total de Vendas</p>
                <p className="text-4xl font-heading font-black text-[#0F172A]">{totalSales.toLocaleString('pt-AO')} <span className="text-xs">KZ</span></p>
              </div>
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pedidos em Aberto</p>
                <p className="text-4xl font-heading font-black text-[#0F172A]">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Artigos no Catálogo</p>
                <p className="text-4xl font-heading font-black text-[#0F172A]">{editableProducts.length}</p>
              </div>
            </div>
            
            <div className="bg-[#0F172A] rounded-[48px] p-12 text-white flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-2xl uppercase italic tracking-tighter mb-2">Sistema Operacional</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Todos os serviços estão activos</p>
              </div>
              <div className="flex gap-4">
                 <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase">GPS ATIVO</span>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h1 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter mb-10">Pedidos <span className="text-amber-500">& Logística</span></h1>
             
             <div className="space-y-6">
                {orders.length === 0 ? (
                  <p className="text-center py-20 text-gray-400 italic">Nenhum pedido registado ainda.</p>
                ) : orders.map(order => (
                  <div key={order.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center group gap-8">
                    <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-amber-500 text-2xl">
                        <i className="fa-solid fa-box"></i>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">#{order.trackingCode}</span>
                        <h4 className="font-heading font-black text-lg text-[#0F172A]">{order.customerName}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                          <i className="fa-solid fa-location-dot mr-1"></i> {order.address}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-10">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="font-heading font-black text-xl text-[#0F172A]">{order.total.toLocaleString('pt-AO')} KZ</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Mantenha as outras tabs existentes de forma simplificada */}
        {activeTab === 'products' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter">Stock <span className="text-amber-500">Actual</span></h1>
              <button onClick={() => setIsAddModalOpen(true)} className="px-8 py-4 bg-amber-500 text-[#0F172A] rounded-2xl font-heading font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-transform"><i className="fa-solid fa-plus mr-2"></i> Novo Item</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {editableProducts.map(p => (
                <div key={p.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all relative">
                  <div className="aspect-square p-10 bg-white flex items-center justify-center overflow-hidden">
                    <img src={p.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-8 bg-gray-50/50 border-t border-gray-50">
                    <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-[10px] block mb-2">{p.category}</span>
                    <h4 className="font-heading font-black text-lg uppercase italic tracking-tight text-[#0F172A] line-clamp-1">{p.name}</h4>
                    <div className="mt-4 flex items-end justify-between">
                      <p className="text-xl font-black text-[#0F172A]">{p.price.toLocaleString('pt-AO')} KZ</p>
                      <button onClick={() => handleDelete(p.id)} className="w-10 h-10 bg-white shadow-lg rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL ADICIONAR PRODUTO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-[#0F172A]/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden my-10 animate-in zoom-in duration-300">
            <div className="bg-[#0F172A] p-10 flex justify-between items-center text-white">
              <h2 className="font-heading font-black uppercase italic tracking-tighter text-3xl">Novos <span className="text-amber-500">Stocks</span></h2>
              <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center"><i className="fa-solid fa-xmark text-2xl"></i></button>
            </div>
            <form onSubmit={handleAddNewProduct} className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }} onClick={() => fileInputRef.current?.click()} className={`flex flex-col items-center justify-center rounded-[40px] border-4 border-dashed p-10 min-h-[450px] cursor-pointer transition-all ${isDragging ? 'border-amber-500 bg-amber-50' : 'border-gray-100 bg-gray-50'}`}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
                {newProduct.image ? <img src={newProduct.image} className="w-full h-full object-contain" /> : <div className="text-center"><i className="fa-solid fa-camera text-4xl text-amber-500 mb-6"></i><p className="font-heading font-black uppercase italic tracking-tight text-xl text-[#0F172A]">Carregar Foto</p></div>}
              </div>
              <div className="flex flex-col space-y-6">
                <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-heading font-black text-lg focus:border-amber-500 outline-none" placeholder="Identificação do Produto" />
                <div className="grid grid-cols-2 gap-6">
                  <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-black text-xl outline-none focus:border-amber-500" placeholder="Preço (KZ)" />
                  <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-black text-xl outline-none focus:border-amber-500" placeholder="Stock" />
                </div>
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500">
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} rows={3} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-medium outline-none focus:border-amber-500" placeholder="Descrição rápida..." />
                <button type="submit" className="bg-[#0F172A] text-white py-6 rounded-2xl font-heading font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all shadow-xl shadow-[#0F172A]/10 mt-auto">Confirmar Artigo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
