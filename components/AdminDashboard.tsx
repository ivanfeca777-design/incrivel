
import React, { useState } from 'react';
import { Product, Order } from '../types';
import { CATEGORIES } from '../constants';
import InvoiceView from './InvoiceView';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onLogout: () => void;
}

type Tab = 'overview' | 'products' | 'orders' | 'payments';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, onUpdateProducts, onUpdateOrders, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', 
    description: '', 
    category: CATEGORIES[0].id, 
    price: 0, 
    image: '', 
    stock: 0
  });

  // Estatísticas Rápidas
  const totalSales = orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.total, 0);
  const pendingPayments = orders.filter(o => o.paymentStatus === 'pending_validation').length;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      category: formData.category || CATEGORIES[0].id,
      price: Number(formData.price) || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      stock: Number(formData.stock) || 0,
      rating: editingProduct ? editingProduct.rating : 5,
      reviews: editingProduct ? editingProduct.reviews : 0,
    };

    if (editingProduct) {
      onUpdateProducts(products.map(p => p.id === editingProduct.id ? productToSave : p));
    } else {
      onUpdateProducts([productToSave, ...products]);
    }
    closeModal();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Deseja eliminar este produto do catálogo? Esta acção não pode ser desfeita.')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', category: CATEGORIES[0].id, price: 0, image: '', stock: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleConfirmPayment = (order: Order) => {
    const updatedOrders = orders.map(o => {
      if (o.id === order.id) {
        return { 
          ...o, 
          paymentStatus: 'paid' as const, 
          status: 'processing' as const,
          confirmedAt: new Date().toISOString()
        };
      }
      return o;
    });
    onUpdateOrders(updatedOrders);
    alert(`Sucesso! Pagamento da Encomenda ${order.trackingCode} validado e factura emitida.`);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Administrativa */}
      <aside className="w-72 bg-[#0F172A] text-white fixed h-full z-50 flex flex-col shadow-2xl">
        <div className="p-10 border-b border-white/5">
          <h2 className="text-2xl font-heading font-black italic tracking-tighter text-amber-500">Feca <span className="text-white">Admin</span></h2>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold mt-2 italic">Consola de Gestão</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          {[
            { id: 'overview', icon: 'fa-chart-line', label: 'Visão Geral' },
            { id: 'products', icon: 'fa-box-open', label: 'Catálogo' },
            { id: 'orders', icon: 'fa-truck-ramp-box', label: 'Encomendas' },
            { id: 'payments', icon: 'fa-receipt', label: 'Tesouraria', badge: pendingPayments },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id as Tab); setSelectedInvoiceOrder(null); }}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-amber-500 text-[#0F172A] font-black' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <i className={`fa-solid ${item.icon} w-5`}></i>
                <span className="text-[10px] uppercase tracking-widest font-black">{item.label}</span>
              </div>
              {item.badge ? (
                <span className="bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{item.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest">
            <i className="fa-solid fa-right-from-bracket"></i> Logout Seguro
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo */}
      <main className="ml-72 flex-grow p-12">
        {selectedInvoiceOrder ? (
          <div className="animate-in fade-in">
             <button onClick={() => setSelectedInvoiceOrder(null)} className="mb-8 text-[#0F172A] font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group"><i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Voltar ao Painel</button>
             <InvoiceView order={selectedInvoiceOrder} />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="animate-in fade-in">
                <h1 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter mb-10">Métricas de <span className="text-amber-500">Venda</span></h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 border-l-8 border-l-green-500">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Faturação Total</p>
                    <p className="text-4xl font-heading font-black text-[#0F172A]">{totalSales.toLocaleString('pt-AO')} <span className="text-xs">KZ</span></p>
                  </div>
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 border-l-8 border-l-amber-500">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Aguardando Validação</p>
                    <p className="text-4xl font-heading font-black text-[#0F172A]">{pendingPayments}</p>
                  </div>
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 border-l-8 border-l-[#0F172A]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Produtos Activos</p>
                    <p className="text-4xl font-heading font-black text-[#0F172A]">{products.length}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="animate-in fade-in">
                <div className="flex justify-between items-center mb-10">
                  <h1 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter">Gestão de <span className="text-amber-500">Stock</span></h1>
                  <button onClick={() => openModal()} className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-xl flex items-center gap-3 active:scale-95">
                    <i className="fa-solid fa-plus"></i> Adicionar Produto
                  </button>
                </div>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-8 text-[9px] font-black uppercase tracking-widest text-gray-400">Item</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-widest text-gray-400">Preço Unitário</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-widest text-gray-400">Disponível</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Acções</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="p-8">
                            <div className="flex items-center gap-4">
                              <img src={product.image} className="w-12 h-12 object-contain bg-white rounded-xl border border-gray-100 p-2" alt="" />
                              <div>
                                <p className="font-bold text-[#0F172A] uppercase italic text-sm">{product.name}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{product.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-8 font-black text-[#0F172A]">{product.price.toLocaleString('pt-AO')} KZ</td>
                          <td className="p-8">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${ (product.stock || 0) < 5 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                {product.stock || 0} Unidades
                             </span>
                          </td>
                          <td className="p-8 text-right space-x-4">
                             <button onClick={() => openModal(product)} className="text-gray-300 hover:text-amber-500 transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                             <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-300 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="animate-in fade-in">
                 <h1 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter mb-10">Validação de <span className="text-amber-500">Receitas</span></h1>
                 <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-8">
                           <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-500'}`}>
                             <i className={`fa-solid ${order.paymentStatus === 'paid' ? 'fa-check-double' : 'fa-receipt'}`}></i>
                           </div>
                           <div>
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Doc: {order.invoiceNumber}</span>
                                {order.paymentStatus === 'paid' && <span className="text-[8px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-black uppercase italic">Validado</span>}
                              </div>
                              <h4 className="text-2xl font-heading font-black text-[#0F172A] uppercase italic leading-tight">{order.customerName}</h4>
                              <p className="text-[10px] font-bold text-gray-500 mt-1 italic">Total: {order.total.toLocaleString('pt-AO')} KZ via {order.paymentMethod.toUpperCase()}</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                          {order.paymentStatus === 'pending_validation' ? (
                            <button onClick={() => handleConfirmPayment(order)} className="bg-green-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] hover:bg-[#0F172A] transition-all shadow-xl shadow-green-200">Confirmar Pagamento</button>
                          ) : (
                            <button onClick={() => setSelectedInvoiceOrder(order)} className="bg-[#0F172A] text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] hover:bg-amber-500 transition-all">Visualizar Factura</button>
                          )}
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="text-center py-24 bg-gray-50 rounded-[48px] border-4 border-dashed border-gray-200">
                         <i className="fa-solid fa-folder-open text-gray-200 text-6xl mb-6"></i>
                         <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Sem movimentos financeiros para processar.</p>
                      </div>
                    )}
                 </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Profissional para Adição de Produtos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0F172A]/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[56px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 my-auto">
            <div className="bg-[#0F172A] p-12 text-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h2 className="text-3xl font-heading font-black text-white uppercase italic tracking-tighter relative z-10">
                {editingProduct ? 'Editar' : 'Novo'} <span className="text-amber-500">Produto</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-2 relative z-10">Amazing Inventory System</p>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-12 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome Comercial</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all" placeholder="Ex: iPhone 15 Pro" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Categoria de Venda</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all appearance-none">
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Preço (KZ)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Quantidade Inicial</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">URL da Imagem de Alta Resolução</label>
                  <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all text-xs" placeholder="https://..." />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Breve Descrição para o Cliente</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all" placeholder="Detalhes técnicos e benefícios..." />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={closeModal} className="flex-grow bg-gray-100 text-gray-400 py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all">Descartar</button>
                <button type="submit" className="flex-grow bg-[#0F172A] text-white py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-xl">Publicar Produto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
