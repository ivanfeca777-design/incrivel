
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminLoginPageProps {
  onLoginSuccess: (role: 'admin') => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // CREDENCIAIS OFICIAIS ACTIVADAS:
    const ADMIN_ID = 'evaristofecayamalej@gmail.com';
    const ADMIN_KEY = 'Adminfeca1319';

    setTimeout(() => {
      if (email.trim() === ADMIN_ID && password === ADMIN_KEY) {
        // Sucesso na Autenticação
        onLoginSuccess('admin');
        navigate('/admin');
      } else {
        setError('Acesso Negado: Credenciais não reconhecidas pelo servidor Feca.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Elementos Visuais de Segurança */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#fbbf24_0,transparent_50%)] blur-[120px]"></div>
        <div className="grid grid-cols-8 gap-4 opacity-10">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="h-20 border-r border-b border-amber-500/20"></div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-3xl w-full max-w-lg rounded-[48px] shadow-2xl border border-white/10 overflow-hidden relative z-10 animate-in zoom-in duration-500">
        <div className="p-12 text-center border-b border-white/5 bg-black/20">
          <div className="w-24 h-24 bg-amber-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(251,191,36,0.4)] rotate-3">
            <i className="fa-solid fa-user-shield text-[#0F172A] text-4xl"></i>
          </div>
          <h2 className="text-4xl font-heading font-black text-white uppercase italic tracking-tighter">FECA <span className="text-amber-500">CONTROL</span></h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.4em] italic">Servidor de Acesso Seguro Activo</p>
          </div>
        </div>

        <form onSubmit={handleAdminLogin} className="p-12 space-y-8">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-500/20 animate-in shake">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">E-mail Institucional</label>
            <div className="relative">
              <i className="fa-solid fa-at absolute left-6 top-1/2 -translate-y-1/2 text-gray-600"></i>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-14 pr-6 py-5 font-bold text-white outline-none focus:border-amber-500 focus:bg-white/10 transition-all placeholder:text-gray-700"
                placeholder="id@amazing.ao"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Chave Encriptada</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-6 top-1/2 -translate-y-1/2 text-gray-600"></i>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-14 pr-6 py-5 font-bold text-white outline-none focus:border-amber-500 focus:bg-white/10 transition-all placeholder:text-gray-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-amber-500 text-[#0F172A] py-7 rounded-3xl font-heading font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_20px_40px_rgba(251,191,36,0.2)] disabled:opacity-50 mt-4 active:scale-95 text-xs"
          >
            {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Activar Consola de Gestão'}
          </button>

          <div className="text-center pt-6">
             <button type="button" onClick={() => navigate('/')} className="text-[9px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors">Abortar e Sair do Terminal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
