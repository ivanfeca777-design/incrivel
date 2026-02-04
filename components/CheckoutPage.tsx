
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Order } from '../types';
import { STORE_INFO } from '../constants';

interface CheckoutPageProps {
  cart: CartItem[];
  onOrderComplete: (order: Order) => void;
  clearCart: () => void;
}

// Centro de Distribuição Amazing Shop - Luanda (Coordenadas Reais Aproximadas)
const DC_LOCATION = { lat: -8.8147, lng: 13.2306 };

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onOrderComplete, clearCart }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'express' as Order['paymentMethod']
  });
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [shippingCost, setShippingCost] = useState(5000); // Valor padrão inicial
  const [distance, setDistance] = useState<number | null>(null);
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost;

  // Cálculo de distância via Haversine (Precisão Logística)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Raio da Terra em km
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
        
        // REGRA DE NEGÓCIO GRANULAR:
        // Base: 2500 KZ + (350 KZ por KM)
        // Mínimo: 3500 KZ
        // Máximo: 15000 KZ
        let calculatedShipping = 2500 + (dist * 350);
        calculatedShipping = Math.max(3500, Math.min(15000, calculatedShipping));
        
        // Arredondar para as centenas para estética comercial (ex: 3750, 4200)
        const finalShipping = Math.ceil(calculatedShipping / 100) * 100;

        setLocation({ lat: latitude, lng: longitude });
        setDistance(dist);
        setShippingCost(finalShipping);
        setFormData(prev => ({ 
          ...prev, 
          address: `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (Detetado via Satélite)` 
        }));
        setIsLocating(false);
      }, () => {
        alert("Não foi possível aceder ao seu GPS. Aplicando taxa fixa de entrega padrão.");
        setIsLocating(false);
        setShippingCost(5000);
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } else {
      alert("O seu navegador não suporta geolocalização.");
      setIsLocating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trackingCode = `AMZ-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const invoiceNumber = `FS-2025-${(Math.floor(Math.random() * 9999)).toString().padStart(4, '0')}`;
    
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      trackingCode,
      invoiceNumber,
      items: [...cart],
      subtotal,
      shipping: shippingCost,
      total,
      status: 'pending',
      paymentStatus: 'pending_validation',
      paymentMethod: formData.paymentMethod,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      address: formData.address,
      location: location || undefined,
      createdAt: new Date().toISOString()
    };

    onOrderComplete(newOrder);
    clearCart();
    navigate(`/track-order?code=${trackingCode}`);
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 animate-in fade-in duration-700">
      <h1 className="text-5xl font-heading font-black mb-16 uppercase italic tracking-tighter text-[#0F172A]">Finalizar <span className="text-amber-500">Compra</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-heading font-black mb-8 uppercase italic flex items-center gap-4 text-[#0F172A]">
                <span className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-sm text-[#0F172A] rotate-3 shadow-lg shadow-amber-500/20">1</span> 
                Dados de Facturação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome do Titular</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all placeholder:text-gray-300" placeholder="Ex: Evaristo Feca" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email (Factura Digital)</label>
                  <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all placeholder:text-gray-300" placeholder="seu@email.com" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Telefone Directo</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all placeholder:text-gray-300" placeholder="921 XXX XXX" />
                </div>
                <div className="md:col-span-2 space-y-3">
                   <div className="flex justify-between items-center mb-2 px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Morada de Entrega</label>
                      <button 
                        type="button" 
                        onClick={handleGetLocation} 
                        className={`text-white font-black text-[9px] uppercase tracking-widest px-6 py-3 rounded-full flex items-center gap-2 transition-all active:scale-95 ${location ? 'bg-green-500' : 'bg-[#0F172A] hover:bg-amber-500'}`}
                      >
                        {isLocating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-satellite-dish"></i>} 
                        {location ? 'Localização Confirmada' : 'Calcular Frete via GPS'}
                      </button>
                   </div>
                   <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={2} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-amber-500 transition-all italic text-gray-600" placeholder="Rua, Bairro, Ponto de Referência..." />
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-heading font-black mb-8 uppercase italic flex items-center gap-4 text-[#0F172A]">
                <span className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-sm text-[#0F172A] -rotate-3 shadow-lg shadow-amber-500/20">2</span> 
                Método de Pagamento
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'express', icon: 'fa-mobile-screen', label: 'Express' },
                  { id: 'transfer', icon: 'fa-building-columns', label: 'Transf.' },
                  { id: 'visa', icon: 'fa-cc-visa', label: 'Visa' },
                  { id: 'paypal', icon: 'fa-paypal', label: 'PayPal' }
                ].map(method => (
                  <button key={method.id} type="button" onClick={() => setFormData({...formData, paymentMethod: method.id as any})} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${formData.paymentMethod === method.id ? 'border-amber-500 bg-amber-50 text-[#0F172A]' : 'border-gray-50 bg-white text-gray-400 hover:border-gray-100'}`}>
                    <i className={`fa-solid ${method.icon} text-2xl`}></i>
                    <span className="text-[9px] font-black uppercase tracking-widest">{method.label}</span>
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'transfer' && (
                <div className="mt-8 p-8 bg-[#0F172A] rounded-[32px] text-white animate-in zoom-in border border-white/5">
                   <p className="text-[9px] font-black uppercase tracking-widest text-amber-500 mb-6">IBAN Angolano (Feca Shop Lda)</p>
                   <p className="text-xs font-mono tracking-wider bg-white/5 p-4 rounded-xl border border-white/5 select-all overflow-x-auto">{STORE_INFO.banking[0].iban}</p>
                   <p className="text-[8px] text-gray-500 mt-4 uppercase italic tracking-widest leading-loose">Envie o comprovativo para {STORE_INFO.email} após a transferência para validação imediata.</p>
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-[#0F172A] text-white py-8 rounded-[32px] font-heading font-black uppercase tracking-[0.3em] text-sm hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-2xl active:scale-[0.98] group">
              Finalizar Pedido Extraordinário <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform"></i>
            </button>
          </form>
        </div>

        <div className="space-y-8 h-fit sticky top-32">
          <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-2xl font-heading font-black mb-10 uppercase italic tracking-tighter text-[#0F172A] border-b border-gray-50 pb-6">Resumo</h2>
            <div className="space-y-6">
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-4 text-xs font-bold animate-in slide-in-from-right duration-300">
                    <span className="text-[#0F172A] uppercase italic leading-tight flex-grow">{item.name} <span className="text-amber-500 ml-1">x{item.quantity}</span></span>
                    <span className="text-[#0F172A] whitespace-nowrap">{(item.price * item.quantity).toLocaleString('pt-AO')} KZ</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-8 border-t border-gray-50 space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400"><span>Subtotal</span><span>{subtotal.toLocaleString('pt-AO')} KZ</span></div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase text-[#0F172A]">
                    <span className="flex items-center gap-2">
                      Taxa Entrega 
                      {location && <span className="bg-green-500 text-white px-2 py-0.5 rounded text-[8px] animate-pulse">GPS</span>}
                    </span>
                    <span className={location ? 'text-green-600' : 'text-gray-400'}>{shippingCost.toLocaleString('pt-AO')} KZ</span>
                  </div>
                  {distance !== null && (
                    <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl animate-in zoom-in">
                       <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Distância Calculada</p>
                       <p className="text-[10px] font-black text-[#0F172A] italic">{distance.toFixed(1)} km</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-6 border-t-2 border-[#0F172A] items-baseline">
                  <span className="font-heading font-black uppercase text-xl italic text-[#0F172A]">Total Final</span>
                  <div className="text-right">
                    <span className="text-4xl font-heading font-black text-amber-500 leading-none">{total.toLocaleString('pt-AO')}</span>
                    <span className="text-sm font-bold ml-1 text-amber-500">KZ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0F172A] p-8 rounded-[40px] text-center">
             <i className="fa-solid fa-shield-halved text-amber-500 text-2xl mb-4"></i>
             <p className="text-[9px] font-black text-white uppercase tracking-widest leading-relaxed">
               Pagamento 100% Seguro <br />
               <span className="text-gray-500 opacity-50">Certificado SSL Amazing Shop</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
