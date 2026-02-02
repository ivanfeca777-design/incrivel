
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLoginSuccess: (role: 'admin' | 'user') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Credenciais do Gestor fornecidas pelo utilizador
    const ADMIN_EMAIL = 'evaristofecayamalej@gmail.com';
    const ADMIN_PASS = 'Adminfeca1319';

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        onLoginSuccess('admin');
        navigate('/admin');
      } else if (email && password.length >= 6) {
        // Simulação de login para utilizadores comuns
        onLoginSuccess('user');
        navigate('/profile');
      } else {
        setError('Credenciais inválidas. Verifique o email e a senha (mínimo 6 caracteres).');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-[#0F172A] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-6 shadow-xl relative z-10">
            <i className="fa-solid fa-user-shield text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-heading font-black text-white uppercase italic tracking-tighter relative z-10">Amazing <span className="text-amber-500">Access</span></h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-3 relative z-10">Plataforma de Autenticação Unificada</p>
        </div>

        <form onSubmit={handleLogin} className="p-12 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">E-mail</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all"
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Palavra-passe</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center animate-in zoom-in border border-red-100">
              <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0F172A] text-white py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-xl shadow-[#0F172A]/10 disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <i className="fa-solid fa-circle-notch animate-spin"></i> A Processar
              </span>
            ) : 'Entrar na Conta'}
          </button>
          
          <div className="text-center pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/home')}
              className="text-gray-400 hover:text-[#0F172A] text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i> Voltar à Loja
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
