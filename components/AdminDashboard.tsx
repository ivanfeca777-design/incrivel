
import React, { useState, useRef } from 'react';
import { Product, Order } from '../types';
import { CATEGORIES, STORE_INFO } from '../constants';
import InvoiceView from './InvoiceView';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onLogout: () => void;
}

type Tab = 'overview' | 'products' | 'orders' | 'payments' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, onUpdateProducts, onUpdateOrders, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', description: '', category: CATEGORIES[0].id, price: 0, image: '', stock: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats
  const totalSales = orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.total, 0);
  const pendingPayments = orders.filter(o => o.paymentStatus === 'pending_validation').length;

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
    
    // Simulação de alerta de email
    alert(`Pagamento Confirmado! Factura ${order.invoiceNumber} gerada e enviada para ${order.customerEmail}`);
  };

  const handleRejectPayment = (orderId: string) => {
    if (confirm('Tem certeza que deseja rejeitar este pagamento?')) {
      onUpdateOrders(orders.map(o => o.id === orderId ? { ...o, paymentStatus: 'rejected' as const } : o));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F172A] text-white fixed h-full z-50 flex flex-col">
        <div className="p-10 border-b border-white/5">
          <h2 className="text-2xl font-heading font-black italic tracking-tighter text-amber-500">Feca <span className="text-white">Admin</span></h2>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold mt-2">Fiscal & Operações</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          {[
            { id: 'overview', icon: 'fa-chart-pie', label: 'Visão Geral' },
            { id: 'products', icon: 'fa-boxes-stacked', label: 'Inventário' },
            { id: 'orders', icon: 'fa-truck-fast', label: 'Logística' },
            { id: 'payments', icon: 'fa-file-invoice-dollar', label: 'Tesouraria', badge: pendingPayments },
            { id: 'settings', icon: 'fa-gears', label: 'Ajustes' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id as Tab); setSelectedInvoiceOrder(null); }}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-amber-500 text-[#0F172A] font-black' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <i className={`fa-solid ${item.icon} w-5`}></i>
                <span className="text-[11px] uppercase tracking-widest font-black">{item.label}</span>
              </div>
              {item.badge ? (
                <span className="bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">{item.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest">
            <i className="fa-solid fa-power-off"></i> Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="ml-72 flex-grow p-12">
        {selectedInvoiceOrder ? (
          <div className="animate-in fade-in">
             <button onClick={() => setSelectedInvoiceOrder(null)} className="mb-8 text-[#0F172A] font-black uppercase tracking-widest text-[10px] flex items-center gap-2"><i className="fa-solid fa-arrow-left"></i> Voltar Tesouraria</button>
             <InvoiceView order={selectedInvoiceOrder} />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="animate-in fade-in">
                <h1 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter mb-10">Estado do <span className="text-amber-500">Negócio</span></h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Receita Confirmada</p>
                    <p className="text-4xl font-heading font-black text-green-600">{totalSales.toLocaleString('pt-AO')} <span className="text-xs">KZ</span></p>
                  </div>
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Pagamentos Pendentes</p>
                    <p className="text-4xl font-heading font-black text-amber-500">{pendingPayments}</p>
                  </div>
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Facturas Emitidas</p>
                    <p className="text-4xl font-heading font-black text-[#0F172A]">{orders.filter(o => o.paymentStatus === 'paid').length}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="animate-in fade-in">
                 <h1 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter mb-10">Validação de <span className="text-amber-500">Facturação</span></h1>
                 <div className="space-y-6">
                    {orders.filter(o => o.paymentStatus !== 'unpaid').map(order => (
                      <div key={order.id} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-8">
                           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                             <i className={`fa-solid ${order.paymentStatus === 'paid' ? 'fa-file-invoice' : 'fa-clock'}`}></i>
                           </div>
                           <div>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-gray-400 uppercase">#{order.invoiceNumber}</span>
                                {order.paymentStatus === 'paid' && <span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase italic">Pago</span>}
                              </div>
                              <h4 className="text-2xl font-heading font-black text-[#0F172A] uppercase italic">{order.customerName}</h4>
                              <p className="text-[10px] font-bold text-gray-500 mt-1">Via {order.paymentMethod.toUpperCase()} • {order.total.toLocaleString('pt-AO')} KZ</p>
                           </div>
                        </div>

                        <div className="flex gap-4">
                          {order.paymentStatus === 'pending_validation' ? (
                            <>
                              <button 
                                onClick={() => handleConfirmPayment(order)}
                                className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-green-600 transition-all shadow-lg"
                              >
                                Confirmar Pagamento
                              </button>
                              <button 
                                onClick={() => handleRejectPayment(order.id)}
                                className="bg-red-50 text-red-500 px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-red-500 hover:text-white transition-all"
                              >
                                Rejeitar
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => setSelectedInvoiceOrder(order)}
                              className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-amber-500 hover:text-[#0F172A] transition-all"
                            >
                              Ver Factura Oficial
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {orders.filter(o => o.paymentStatus !== 'unpaid').length === 0 && (
                      <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Sem movimentos financeiros para validar.</p>
                      </div>
                    )}
                 </div>
              </div>
            )}
            
            {/* Outras abas mantidas... */}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
