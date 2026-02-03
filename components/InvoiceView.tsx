
import React from 'react';
import { Order } from '../types';
import { STORE_INFO } from '../constants';

interface InvoiceViewProps {
  order: Order;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ order }) => {
  const qrData = `Factura:${order.invoiceNumber}|Total:${order.total}|Cliente:${order.customerName}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="bg-white p-8 sm:p-16 max-w-4xl mx-auto shadow-2xl border border-gray-100 print:shadow-none print:border-0" id="printable-invoice">
      {/* Header Fatura */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-16 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white">
              <i className="fa-solid fa-gem text-2xl"></i>
            </div>
            <h1 className="text-3xl font-heading font-black uppercase italic tracking-tighter text-[#0F172A]">{STORE_INFO.legalName}</h1>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
            <p>{STORE_INFO.address}</p>
            <p>NIF: {STORE_INFO.nif}</p>
            <p>Email: {STORE_INFO.email}</p>
            <p>Tel: {STORE_INFO.phone}</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <h2 className="text-5xl font-heading font-black text-amber-500 uppercase italic mb-2">Factura</h2>
          <p className="text-xl font-bold text-[#0F172A]">#{order.invoiceNumber}</p>
          <div className="mt-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
             <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Data de Emissão</p>
             <p className="text-sm font-bold">{new Date(order.confirmedAt || order.createdAt).toLocaleDateString('pt-AO')}</p>
          </div>
        </div>
      </div>

      {/* Dados Cliente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-16 pb-12 border-b border-gray-100">
        <div>
          <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4">Facturar a:</h3>
          <p className="text-xl font-bold text-[#0F172A] mb-2">{order.customerName}</p>
          <p className="text-sm text-gray-500 font-medium">{order.address}</p>
          <p className="text-sm text-gray-500 font-medium">Contacto: {order.customerPhone}</p>
        </div>
        <div className="sm:text-right">
          <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4">Método de Pagamento:</h3>
          <p className="text-lg font-bold text-[#0F172A] uppercase">{order.paymentMethod === 'express' ? 'Multicaixa Express' : order.paymentMethod === 'transfer' ? 'Transferência Bancária' : order.paymentMethod.toUpperCase()}</p>
          <p className="text-xs text-green-600 font-black uppercase mt-1 italic tracking-widest"><i className="fa-solid fa-circle-check mr-2"></i> Pagamento Confirmado</p>
        </div>
      </div>

      {/* Tabela de Itens */}
      <table className="w-full mb-16">
        <thead>
          <tr className="border-b-2 border-[#0F172A] text-left">
            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Descrição</th>
            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Qtd</th>
            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Preço Un.</th>
            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {order.items.map((item, idx) => (
            <tr key={idx} className="group">
              <td className="py-6 font-bold text-[#0F172A]">{item.name}</td>
              <td className="py-6 text-center font-bold text-gray-500">{item.quantity}</td>
              <td className="py-6 text-right font-bold text-gray-500">{item.price.toLocaleString('pt-AO')} KZ</td>
              <td className="py-6 text-right font-black text-[#0F172A]">{(item.price * item.quantity).toLocaleString('pt-AO')} KZ</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totais e QR Code */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-12">
        <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
           <img src={qrUrl} alt="QR Code Verificação" className="w-32 h-32 rounded-xl shadow-sm bg-white p-2" />
           <div>
              <p className="text-[10px] font-black uppercase text-gray-400 mb-2 leading-tight">Autenticidade Garantida</p>
              <p className="text-[9px] font-medium text-gray-400 max-w-[150px]">Digitalize para validar esta factura no sistema oficial Feca Shop.</p>
           </div>
        </div>

        <div className="w-full sm:w-80 space-y-4">
          <div className="flex justify-between text-sm font-bold text-gray-400">
            <span>Subtotal</span>
            <span>{order.subtotal.toLocaleString('pt-AO')} KZ</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-400">
            <span>Taxa de Entrega</span>
            <span>{order.shipping.toLocaleString('pt-AO')} KZ</span>
          </div>
          <div className="pt-6 border-t-2 border-[#0F172A] flex justify-between items-end">
            <span className="text-xl font-heading font-black uppercase italic text-[#0F172A]">Total Pago</span>
            <div className="text-right">
               <span className="text-4xl font-heading font-black text-amber-500 leading-none">{order.total.toLocaleString('pt-AO')}</span>
               <span className="text-sm font-bold ml-1 text-amber-500">KZ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-gray-50 text-center">
         <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-300 italic">Obrigado pela sua preferência • Amazing Shop</p>
      </div>

      <div className="mt-12 flex justify-center print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-[#0F172A] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all flex items-center gap-3 shadow-xl"
        >
          <i className="fa-solid fa-print"></i> Descarregar PDF / Imprimir
        </button>
      </div>
    </div>
  );
};

export default InvoiceView;
