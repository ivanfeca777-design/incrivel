
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { STORE_INFO } from '../constants';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Olá! Sou o seu assistente da Amazing Shop. Como posso ajudá-lo a encontrar o produto perfeito hoje?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    const response = await getGeminiResponse(userMsg, messages);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {/* WhatsApp Quick Button */}
      <a 
        href={`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}?text=Olá,%20venho%20do%20site%20e%20preciso%20de%20ajuda.`}
        target="_blank"
        className="bg-[#25D366] hover:bg-[#128C7E] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 group relative"
        title="Falar com um humano via WhatsApp"
      >
        <i className="fa-brands fa-whatsapp text-2xl"></i>
        <span className="absolute right-full mr-3 bg-white text-[#25D366] text-[10px] font-black px-3 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-100 uppercase tracking-widest">Atendimento Humano</span>
      </a>

      {/* Trigger Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-amber-500 hover:bg-[#0F172A] text-[#0F172A] hover:text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
        >
          <i className="fa-solid fa-robot text-2xl"></i>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#0F172A] p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-robot text-[#0F172A]"></i>
              </div>
              <div>
                <h3 className="text-white font-bold leading-none uppercase tracking-tighter italic">Assistente IA</h3>
                <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium ${
                  msg.role === 'user' 
                    ? 'bg-[#0F172A] text-white rounded-tr-none shadow-md' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pergunte algo..."
              className="flex-grow bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 transition-all outline-none font-medium"
            />
            <button 
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-[#0F172A] text-white w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
