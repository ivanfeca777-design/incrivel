
import React, { useState } from 'react';
import { STORE_INFO } from '../constants';

const SupportPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const faqs = [
    { q: "Como funcionam as entregas em Luanda?", a: "Realizamos entregas no mesmo dia para pedidos feitos até às 12h. O custo é calculado via GPS no checkout." },
    { q: "Quais são os métodos de pagamento?", a: "Aceitamos Multicaixa Express e Transferência Bancária imediata (BAI/BFA)." },
    { q: "Os produtos têm garantia?", a: "Sim, todos os nossos produtos eletrónicos e técnicos têm garantia mínima de 6 meses contra defeitos de fabrico." },
    { q: "Posso levantar o meu pedido na loja?", a: "Sim, pode selecionar 'Levantamento em Loja' no checkout e dirigir-se à nossa sede na Rua do Comércio." }
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="bg-[#0F172A] py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 uppercase italic tracking-tighter">Centro de <span className="text-amber-500">Suporte</span></h1>
          <p className="text-gray-400 font-medium text-lg max-w-2xl mx-auto italic">Estamos aqui para garantir que a sua experiência Amazing seja impecável.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Coluna 1: Contactos Diretos */}
          <div className="space-y-8" id="contact">
            <h2 className="text-2xl font-heading font-black text-[#0F172A] uppercase italic tracking-tight mb-10 border-b-2 border-amber-500/20 pb-4">Canais Diretos</h2>
            
            <a href={`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}`} className="flex items-center gap-6 p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all group">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:rotate-12 transition-transform">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp Business</p>
                <p className="text-lg font-black text-[#0F172A]">{STORE_INFO.phone}</p>
              </div>
            </a>

            <a href={`mailto:${STORE_INFO.email}`} className="flex items-center gap-6 p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all group">
              <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white text-2xl group-hover:rotate-12 transition-transform">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Comercial</p>
                <p className="text-lg font-black text-[#0F172A] break-all">{STORE_INFO.email}</p>
              </div>
            </a>

            <div className="flex items-center gap-6 p-8 bg-amber-50 rounded-[32px] border border-amber-100">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-[#0F172A] text-2xl">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Sede em Luanda</p>
                <p className="text-sm font-bold text-[#0F172A]">{STORE_INFO.address}</p>
              </div>
            </div>
          </div>

          {/* Coluna 2: Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white p-12 rounded-[48px] border border-gray-100 shadow-2xl relative">
              <h2 className="text-2xl font-heading font-black text-[#0F172A] uppercase italic tracking-tight mb-10">Envie uma <span className="text-amber-500">Mensagem</span></h2>
              
              {formSubmitted ? (
                <div className="py-20 text-center animate-in zoom-in">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-check text-4xl"></i>
                  </div>
                  <h3 className="text-2xl font-black text-[#0F172A] uppercase italic mb-2">Mensagem Enviada!</h3>
                  <p className="text-gray-500 font-medium">Responderemos para o seu email em menos de 24 horas.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Seu Nome</label>
                    <input required type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold focus:border-amber-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email de Contacto</label>
                    <input required type="email" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold focus:border-amber-500 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assunto</label>
                    <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold focus:border-amber-500 outline-none transition-all appearance-none">
                      <option>Dúvida sobre Produto</option>
                      <option>Estado de Encomenda</option>
                      <option>Problemas Técnicos</option>
                      <option>Outros Assuntos</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Como podemos ajudar?</label>
                    <textarea required rows={5} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold focus:border-amber-500 outline-none transition-all"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-[#0F172A] text-white py-6 rounded-2xl font-heading font-black uppercase tracking-widest text-sm hover:bg-amber-500 transition-all shadow-xl">Enviar Mensagem Oficial</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black text-[#0F172A] uppercase italic tracking-tighter">Perguntas <span className="text-amber-500">Frequentes</span></h2>
            <p className="text-gray-500 font-medium mt-4">As respostas que procura, num só lugar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-heading font-black text-xl text-[#0F172A] mb-4 uppercase italic leading-tight">{faq.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
