
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Order } from '../types';
import { STORE_INFO } from '../constants';

interface CheckoutPageProps {
  cart: CartItem[];
  onOrderComplete: (order: Order) => void;
  clearCart: () => void;
}

// Coordenadas do Centro de Distribuição (Mutamba, Luanda)
const DC_LOCATION = { lat: -8.8147, lng: 13.2306 };

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onOrderComplete, clearCart }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'express'
  });
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [shippingCost, setShippingCost] = useState(5000);
  const [distance, setDistance] = useState<number | null>(null);
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost;

  // Cálculo de distância via Haversine
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Raio da Terra em KM
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const dist = calculateDistance(DC_LOCATION.lat, DC_LOCATION.lng, latitude, longitude);
        
        // Cálculo de frete: Base 2500 + 250 por KM
        let calculatedShipping = 2500 + (dist * 250);
        
        // Regras de negócio Luanda
        if (calculatedShipping < 3500) calculatedShipping = 3500;
        if (calculatedShipping > 15000) calculatedShipping = 15000;

        setLocation({ lat: latitude, lng: longitude });
        setDistance(dist);
        setShippingCost(Math.round(calculatedShipping / 50) * 50); // Arredondar para múltiplos de 50
        setFormData(prev => ({ 
          ...prev, 
          address: `Localização GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Detetado a ${dist.toFixed(1)}km do armazém central)` 
        }));
        setIsLocating(false);
      }, (error) => {
        console.error("Erro ao obter GPS:", error);
        alert("Não foi possível obter sua localização exata. O frete padrão de 5000 KZ será aplicado.");
        setIsLocating(false);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trackingCode = `AMZ-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      trackingCode,
      items: [...cart],
      subtotal,
      shipping: shippingCost,
      total,
      status: 'pending',
      paymentMethod: formData.paymentMethod,
      customerName: formData.name,
      customerPhone: formData.phone,
      address: formData.address,
      location: location || undefined,
      createdAt: new Date().toISOString()
    };

    onOrderComplete(newOrder);
    clearCart();
    navigate(`/track-order?code=${trackingCode}`);
  };

  if (cart.length === 0) return (
    <div className="py-32 text-center">
      <h2 className="text-3xl font-heading font-black mb-6 italic uppercase">Carrinho Vazio</h2>
      <button onClick={() => navigate('/products')} className="bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Voltar às compras</button>
    </div>
  );

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 animate-in fade-in duration-700">
      <h1 className="text-5xl font-heading font-black mb-16 uppercase italic tracking-tighter text-[#0F172A]">Finalizar <span className="text-amber-500">Compra</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Secção 1: Identificação */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm transition-all hover:border-amber-200">
              <h3 className="text-xl font-heading font-black mb-8 uppercase italic flex items-center gap-4">
                <span className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-sm text-[#0F172A] shadow-lg shadow-amber-500/20">1</span> 
                Destino da Entrega
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome do Recetor</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all placeholder:text-gray-300" placeholder="Ex: Ivan Carlos" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contacto Telefónico</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" placeholder="9xx xxx xxx" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Morada / GPS</label>
                    <button type="button" onClick={handleGetLocation} className="text-amber-600 font-black text-[9px] uppercase tracking-widest flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-full hover:bg-amber-100 transition-all">
                      {isLocating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-location-crosshairs"></i>}
                      {isLocating ? 'A Calcular GPS...' : 'Optimizar Frete via GPS'}
                    </button>
                  </div>
                  <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all text-sm" placeholder="Bairro, Rua, Casa nº, Ponto de Referência..." />
                  {distance !== null && (
                    <div className="mt-4 flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 animate-in slide-in-from-top-2">
                      <i className="fa-solid fa-map-location-dot"></i>
                      <p className="text-[10px] font-black uppercase tracking-widest">Distância Calculada: {distance.toFixed(2)} KM do Armazém Central</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Secção 2: Pagamento */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm transition-all hover:border-amber-200">
              <h3 className="text-xl font-heading font-black mb-8 uppercase italic flex items-center gap-4">
                <span className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-sm text-[#0F172A] shadow-lg shadow-amber-500/20">2</span> 
                Modo de Pagamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, paymentMethod: 'express'})} className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-5 ${formData.paymentMethod === 'express' ? 'border-amber-500 bg-amber-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${formData.paymentMethod === 'express' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <i className="fa-solid fa-mobile-screen-button"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase tracking-tighter">Multicaixa Express</p>
                    <p className="text-[10px] text-gray-400 font-bold">Confirmação Instantânea</p>
                  </div>
                </button>
                <button type="button" onClick={() => setFormData({...formData, paymentMethod: 'transfer'})} className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-5 ${formData.paymentMethod === 'transfer' ? 'border-amber-500 bg-amber-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${formData.paymentMethod === 'transfer' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <i className="fa-solid fa-building-columns"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase tracking-tighter">Transferência</p>
                    <p className="text-[10px] text-gray-400 font-bold">Validado via Comprovativo</p>
                  </div>
                </button>
              </div>

              {formData.paymentMethod === 'transfer' && (
                <div className="mt-8 p-10 bg-[#0F172A] rounded-[32px] text-white animate-in zoom-in duration-300 border border-white/5">
                  <div className="flex items-center gap-4 mb-8">
                    <img src="https://www.baidirecto.ao/img/bai_logo.png" className="h-6 filter brightness-0 invert opacity-50" alt="BAI" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Dados de Facturação (Luanda)</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">IBAN de Destino</p>
                      <p className="text-sm font-mono tracking-wider bg-white/5 p-4 rounded-xl border border-white/5 select-all">{STORE_INFO.banking[0].iban}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Titular</p>
                        <p className="text-xs font-bold">{STORE_INFO.banking[0].holder}</p>
                      </div>
                      <i className="fa-solid fa-shield-check text-amber-500 text-xl"></i>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-[#0F172A] text-white py-8 rounded-[32px] font-heading font-black uppercase tracking-[0.3em] text-sm hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-2xl flex items-center justify-center gap-4 group active:scale-[0.98]">
              Confirmar Pedido & Rastrear <i className="fa-solid fa-arrow-right group-hover:translate-x-3 transition-transform"></i>
            </button>
          </form>
        </div>

        {/* Resumo lateral Fixo */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm h-fit sticky top-32">
            <h2 className="text-2xl font-heading font-black mb-10 uppercase italic tracking-tighter text-[#0F172A] border-b border-gray-50 pb-6">Checkout <span className="text-amber-500">Info</span></h2>
            <div className="space-y-6">
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-4 text-xs font-bold">
                    <div className="flex-grow">
                      <p className="text-[#0F172A] uppercase italic leading-tight">{item.name}</p>
                      <p className="text-gray-400 mt-1">{item.quantity} uni. x {item.price.toLocaleString('pt-AO')} KZ</p>
                    </div>
                    <span className="text-[#0F172A] whitespace-nowrap">{(item.price * item.quantity).toLocaleString('pt-AO')} KZ</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-8 border-t border-gray-50 space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString('pt-AO')} KZ</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-amber-600">
                  <span>
                    Frete Dinâmico 
                    {distance !== null ? ` (${distance.toFixed(1)}km)` : ''}
                  </span>
                  <span>{shippingCost.toLocaleString('pt-AO')} KZ</span>
                </div>
                <div className="flex justify-between pt-6 border-t border-gray-100 items-baseline">
                  <span className="font-heading font-black uppercase text-xl italic text-[#0F172A]">Total</span>
                  <div className="text-right">
                    <span className="text-4xl font-heading font-black text-amber-500 leading-none">{total.toLocaleString('pt-AO')}</span>
                    <span className="text-sm font-bold ml-1 text-amber-500">KZ</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 p-6 bg-gray-50 rounded-3xl border border-gray-100">
               <div className="flex items-start gap-4">
                  <i className="fa-solid fa-truck-fast text-amber-500 mt-1"></i>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#0F172A]">Entrega Rápida</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">Tempo estimado de chegada em Luanda: 2-4 horas úteis.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
