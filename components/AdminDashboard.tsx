
import React, { useState, useMemo } from 'react';
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
  
  // Filtros de Inventário
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', 
    description: '', 
    category: CATEGORIES[0].id, 
    price: 0, 
    image: '', 
    stock: 0
  });

  // Filtro Dinâmico de Produtos
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, filterCategory]);

  // Estatísticas Rápidas
  const totalSales = orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.total, 0);
  const pendingPayments = orders.filter(o => o.paymentStatus === 'pending_validation').length;
  const lowStockCount = products.filter(p => (p.stock || 0) < 5).length;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      category: formData.category || CATEGORIES[0].id,
      price: Number(formData.price) || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400',
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
    if (confirm('Deseja eliminar este produto do catálogo? Esta acção é irreversível.')) {
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
    alert(`Sucesso! Pagamento validado para a encomenda de ${order.customerName}.`);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Feca Control */}
      <aside className="w-72 bg-[#0F172A] text-white fixed h-full z-50 flex flex-col shadow-2xl">
        <div className="p-10 border-b border-white/5">
          <h2 className="text-2xl font-heading font-black italic tracking-tighter text-amber-500">Feca <span className="text-white">Admin</span></h2>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold mt-2 italic">Sistema de Gestão</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          {[
            { id: 'overview', icon: 'fa-chart-pie', label: 'Dashboard' },
            { id: 'products', icon: 'fa-boxes-stacked', label: 'Produtos', badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: 'bg-amber-500' },
            { id: 'orders', icon: 'fa-truck-fast', label: 'Logística' },
            { id: 'payments', icon: 'fa-file-invoice-dollar', label: 'Finanças', badge: pendingPayments, badgeColor: 'bg-red-500' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id as Tab); setSelectedInvoiceOrder(null); }}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-amber-500 text-[#0F172A] font-black shadow-lg shadow-amber-500/20' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <i className={`fa-solid ${item.icon} w-5`}></i>
                <span className="text-[10px] uppercase tracking-widest font-black">{item.label}</span>
              </div>
              {item.badge ? (
                <span className={`${item.badgeColor} text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black`}>{item.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest">
            <i className="fa-solid fa-power-off"></i> Terminar Gestão
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="ml-72 flex-grow p-12">
        {selectedInvoiceOrder ? (
          <div className="animate-in fade-in">
             <button onClick={() => setSelectedInvoiceOrder(null)} className="mb-8 text-[#0F172A] font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:text-amber-500 transition-colors">
               <i className="fa-solid fa-arrow-left"></i> Voltar ao Painel
             </button>
             <InvoiceView order={selectedInvoiceOrder} />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="animate-in fade-in">
                <h1 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter mb-10">Monitor de <span className="text-amber-500">Operações</span></h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 group hover:border-amber-500 transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Receita Total Confirmada</p>
                    <p className="text-4xl font-heading font-black text-[#0F172A]">{totalSales.toLocaleString('pt-AO')} <span className="text-xs">KZ</span></p>
                  </div>
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 group hover:border-amber-500 transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Pagamentos por Validar</p>
                    <p className="text-4xl font-heading font-black text-amber-500">{pendingPayments}</p>
                  </div>
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 group hover:border-amber-500 transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Stock em Alerta</p>
                    <p className={`text-4xl font-heading font-black ${lowStockCount > 0 ? 'text-red-500' : 'text-green-500'}`}>{lowStockCount}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="animate-in fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                  <h1 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter">Gestão de <span className="text-amber-500">Inventário</span></h1>
                  <button onClick={() => openModal()} className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-xl flex items-center gap-3">
                    <i className="fa-solid fa-plus"></i> Adicionar Produto
                  </button>
                </div>

                {/* Filtros de Inventário */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
                    <input 
                      type="text" 
                      placeholder="Pesquisar por nome..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-2xl pl-14 pr-6 py-4 font-bold text-sm outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-white border border-gray-100 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-amber-500 transition-all appearance-none"
                  >
                    <option value="all">Todas as Categorias</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-8 text-[9px] font-black uppercase tracking-widest text-gray-400">Produto</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-widest text-gray-400">Preço</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-widest text-gray-400">Stock</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Acções</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
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
                             <div className="flex items-center gap-3">
                               <div className={`w-2 h-2 rounded-full ${ (product.stock || 0) < 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${ (product.stock || 0) < 5 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                  {product.stock || 0} unid.
                               </span>
                             </div>
                          </td>
                          <td className="p-8 text-right space-x-4">
                             <button onClick={() => openModal(product)} className="text-gray-300 hover:text-amber-500 transition-all p-2"><i className="fa-solid fa-pen-to-square"></i></button>
                             <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-300 hover:text-red-500 transition-all p-2"><i className="fa-solid fa-trash-can"></i></button>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-20 text-center">
                            <i className="fa-solid fa-box-open text-gray-100 text-6xl mb-6"></i>
                            <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Nenhum produto encontrado na pesquisa.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="animate-in fade-in">
                 <h1 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter mb-10">Gestão de <span className="text-amber-500">Tesouraria</span></h1>
                 <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10 hover:border-amber-500/30 transition-all">
                        <div className="flex items-center gap-8">
                           <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-500'}`}>
                             <i className={`fa-solid ${order.paymentStatus === 'paid' ? 'fa-circle-check' : 'fa-clock'}`}></i>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">DOC: {order.invoiceNumber}</p>
                              <h4 className="text-2xl font-heading font-black text-[#0F172A] uppercase italic leading-tight">{order.customerName}</h4>
                              <p className="text-[10px] font-bold text-gray-500 mt-1 italic">Total: {order.total.toLocaleString('pt-AO')} KZ via {order.paymentMethod.toUpperCase()}</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                          {order.paymentStatus === 'pending_validation' ? (
                            <button onClick={() => handleConfirmPayment(order)} className="bg-green-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] hover:bg-[#0F172A] transition-all shadow-xl">Validar Pagamento</button>
                          ) : (
                            <button onClick={() => setSelectedInvoiceOrder(order)} className="bg-[#0F172A] text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] hover:bg-amber-500 transition-all">Ver Detalhes</button>
                          )}
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Profissional de Produto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0F172A]/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[56px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 my-auto">
            <div className="bg-[#0F172A] p-12 text-center">
              <h2 className="text-3xl font-heading font-black text-white uppercase italic tracking-tighter">
                {editingProduct ? 'Editar' : 'Novo'} <span className="text-amber-500">Produto</span>
              </h2>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Registo Manual de Inventário</p>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-12 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome Comercial</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all" placeholder="Ex: iPhone 15 Pro" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Categoria</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all">
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Preço em KZ</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Stock em Armazém</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">URL da Imagem (HD)</label>
                  <div className="flex gap-4">
                    <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-grow bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all text-xs" placeholder="https://..." />
                    {formData.image && (
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0">
                        <img src={formData.image} className="w-full h-full object-contain" alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Descrição Comercial</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all" placeholder="Destaque as principais qualidades..." />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={closeModal} className="flex-grow bg-gray-100 text-gray-400 py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all">Cancelar</button>
                <button type="submit" className="flex-grow bg-[#0F172A] text-white py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all shadow-xl">
                  {editingProduct ? 'Atualizar Dados' : 'Publicar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
