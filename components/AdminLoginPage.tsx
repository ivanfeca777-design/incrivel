
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

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

    // Credenciais exclusivas do Gestor Evaristo
    const ADMIN_EMAIL = 'evaristofecayamalej@gmail.com';
    const ADMIN_PASS = 'Adminfeca1319';

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        onLoginSuccess('admin');
        navigate('/admin');
      } else {
        setError('Acesso negado. Credenciais de administrador inválidas.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorativo Admin */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-500 rounded-full blur-[150px]"></div>
      </div>

      <div className="bg-white w-full max-w-lg rounded-[56px] shadow-2xl overflow-hidden relative z-10 animate-in zoom-in duration-500">
        <div className="bg-[#0F172A] p-12 text-center border-b border-white/5">
          <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
            <i className="fa-solid fa-shield-halved text-[#0F172A] text-3xl"></i>
          </div>
          <h2 className="text-3xl font-heading font-black text-white uppercase italic tracking-tighter">Feca <span className="text-amber-500">Control</span></h2>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.5em] mt-3 italic">Portal de Gestão Restrito</p>
        </div>

        <form onSubmit={handleAdminLogin} className="p-12 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100 flex items-center justify-center gap-3 animate-bounce">
              <i className="fa-solid fa-circle-exclamation"></i> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">ID Institucional</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all"
              placeholder="evaristo@fecashop.ao"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Chave de Acesso</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0F172A] text-white py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-xl disabled:opacity-50 mt-4 active:scale-95"
          >
            {isLoading ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : 'Validar Identidade'}
          </button>

          <div className="text-center pt-4">
             <button type="button" onClick={() => navigate('/')} className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-amber-500 transition-colors">Voltar à Loja Pública</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
