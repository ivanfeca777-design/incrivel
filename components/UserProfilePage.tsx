
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';

interface UserProfilePageProps {
  orders: Order[];
  onLogout: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ orders, onLogout }) => {
  const navigate = useNavigate();
  
  return (
    <div className="py-20 max-w-7xl mx-auto px-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter">Área do <span className="text-amber-500">Cliente</span></h1>
          <p className="text-gray-500 font-medium mt-2">Bem-vindo de volta à sua experiência Amazing.</p>
        </div>
        <button onClick={onLogout} className="bg-red-50 text-red-500 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all">
          Terminar Sessão
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-gray-400">
              <i className="fa-solid fa-user"></i>
            </div>
            <h3 className="text-xl font-heading font-black text-[#0F172A] uppercase italic mb-1">Cliente Amazing</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Membro desde 2025</p>
            
            <div className="mt-10 pt-10 border-t border-gray-50 space-y-4 text-left">
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-star text-amber-500"></i>
                <span className="text-xs font-bold text-gray-600">Pontos: 150 AMZ</span>
              </div>
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-truck text-amber-500"></i>
                <span className="text-xs font-bold text-gray-600">{orders.length} Encomendas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-heading font-black text-[#0F172A] uppercase italic tracking-tight mb-8 border-b-2 border-amber-500/20 pb-4">Histórico de Pedidos</h2>
          
          {orders.length === 0 ? (
            <div className="bg-white p-20 rounded-[40px] border border-gray-100 text-center">
              <i className="fa-solid fa-shopping-bag text-gray-100 text-6xl mb-6"></i>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Ainda não realizou nenhuma compra incrível.</p>
              <button onClick={() => navigate('/products')} className="mt-8 bg-[#0F172A] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px]">Ir às Compras</button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center group gap-6">
                  <div className="flex gap-6 items-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-amber-500 text-xl">
                      <i className="fa-solid fa-box-open"></i>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">#{order.trackingCode}</span>
                      <h4 className="font-heading font-black text-[#0F172A] text-lg uppercase italic">{new Date(order.createdAt).toLocaleDateString('pt-AO')}</h4>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Investimento</p>
                      <p className="font-heading font-black text-lg text-[#0F172A]">{order.total.toLocaleString('pt-AO')} KZ</p>
                    </div>
                    <button onClick={() => navigate(`/track-order?code=${order.trackingCode}`)} className="bg-gray-50 text-[#0F172A] p-4 rounded-xl hover:bg-amber-500 hover:text-white transition-all">
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
