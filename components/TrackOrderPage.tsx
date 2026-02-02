
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Order } from '../types';

interface TrackOrderPageProps {
  orders: Order[];
}

const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ orders }) => {
  const [trackingCode, setTrackingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const searchLocation = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(searchLocation.search);
    const code = params.get('code');
    if (code) {
      setTrackingCode(code);
      handleTrackByCode(code);
    }
  }, [searchLocation, orders]);

  const handleTrackByCode = (code: string) => {
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      const found = orders.find(o => o.trackingCode.toUpperCase() === code.toUpperCase());
      if (found) {
        setOrderData(found);
      } else {
        setError('Código de rastreio não encontrado. Verifique se digitou corretamente.');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    handleTrackByCode(trackingCode);
  };

  const getStatusSteps = (status: Order['status']) => {
    const steps = [
      { label: 'Pedido Recebido', key: 'pending' },
      { label: 'Em Processamento', key: 'processing' },
      { label: 'Enviado', key: 'shipped' },
      { label: 'Entregue', key: 'delivered' }
    ];
    
    const currentIndex = steps.findIndex(s => s.key === status);
    return steps.map((s, i) => ({
      ...s,
      completed: i <= currentIndex,
      active: i === currentIndex
    }));
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-heading font-black text-[#0F172A] mb-6 uppercase italic tracking-tighter">Rastreamento <span className="text-amber-500">GPS</span></h1>
        <p className="text-gray-500 font-medium text-lg italic">Consulte o estado da sua jornada incrível.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleTrack} className="flex gap-4 mb-12">
          <input 
            type="text"
            placeholder="Ex: AMZ-1234-X"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            className="flex-grow bg-white border-2 border-gray-100 rounded-3xl px-8 py-6 font-black text-xl text-[#0F172A] focus:border-amber-500 outline-none transition-all uppercase placeholder:text-gray-200"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-[#0F172A] text-white px-10 rounded-3xl font-heading font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl disabled:opacity-50"
          >
            {isLoading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Buscar'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-600 p-8 rounded-[32px] border border-red-100 flex items-center gap-6 animate-in zoom-in">
            <i className="fa-solid fa-circle-exclamation text-3xl"></i>
            <p className="font-bold">{error}</p>
          </div>
        )}

        {orderData && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Status Header */}
            <div className="bg-[#0F172A] p-12 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]">Encomenda #{orderData.trackingCode}</span>
                    <h2 className="text-4xl font-heading font-black italic mt-2 uppercase">
                      {orderData.status === 'pending' && 'Aguardando'}
                      {orderData.status === 'processing' && 'Processando'}
                      {orderData.status === 'shipped' && 'Em Trânsito'}
                      {orderData.status === 'delivered' && 'Entregue'}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data do Pedido</p>
                    <p className="text-xl font-heading font-black text-amber-500">{new Date(orderData.createdAt).toLocaleDateString('pt-AO')}</p>
                  </div>
                </div>

                {/* Timeline Visual */}
                <div className="relative pt-10 pb-6">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2"></div>
                  <div className="relative flex justify-between">
                    {getStatusSteps(orderData.status).map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-4 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${step.completed ? 'bg-amber-500 border-[#0F172A]' : 'bg-[#0F172A] border-white/10'}`}>
                          {step.completed && <i className="fa-solid fa-check text-[10px] text-[#0F172A]"></i>}
                        </div>
                        <div className="text-center w-24">
                          <p className={`text-[9px] font-black uppercase tracking-tighter ${step.active ? 'text-amber-500' : 'text-gray-400'}`}>{step.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                <h3 className="font-heading font-black text-xl uppercase italic tracking-tight text-[#0F172A] mb-8">Informação de Entrega</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <i className="fa-solid fa-user text-amber-500 mt-1"></i>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destinatário</p>
                      <p className="font-bold text-[#0F172A]">{orderData.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <i className="fa-solid fa-location-dot text-amber-500 mt-1"></i>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Endereço (GPS)</p>
                      <p className="font-bold text-[#0F172A] text-sm">{orderData.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <i className="fa-solid fa-wallet text-amber-500 mt-1"></i>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pagamento</p>
                      <p className="font-bold text-[#0F172A] uppercase text-xs">{orderData.paymentMethod === 'express' ? 'Multicaixa Express' : 'Transferência Bancária'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                <h3 className="font-heading font-black text-xl uppercase italic tracking-tight text-[#0F172A] mb-8">Itens Comprados</h3>
                <div className="space-y-4">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <span className="text-sm font-bold text-[#0F172A]">{item.quantity}x {item.name}</span>
                      <span className="text-xs font-black text-gray-400">{(item.price * item.quantity).toLocaleString('pt-AO')} KZ</span>
                    </div>
                  ))}
                  <div className="pt-6 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-400">
                      <span>FRETE</span>
                      <span>{orderData.shipping.toLocaleString('pt-AO')} KZ</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-heading font-black uppercase text-[#0F172A]">Total Pago</span>
                      <span className="text-2xl font-heading font-black text-amber-500">
                        {orderData.total.toLocaleString('pt-AO')} KZ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-20">
        <button onClick={() => navigate('/home')} className="text-[#0F172A] font-black uppercase tracking-widest text-[10px] hover:text-amber-500 transition-colors">
          <i className="fa-solid fa-arrow-left-long mr-3"></i> Voltar para a Loja
        </button>
      </div>
    </div>
  );
};

export default TrackOrderPage;
