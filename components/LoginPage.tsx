
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLoginSuccess: (role: 'admin' | 'user') => void;
}

type AuthMode = 'login' | 'register' | 'recover';

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetMessages();

    // Login exclusivo para Clientes / Utilizadores
    setTimeout(() => {
      if (email && password.length >= 6) {
        onLoginSuccess('user');
        navigate('/home');
      } else {
        setError('As credenciais introduzidas estão incorrectas.');
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetMessages();

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess('Bem-vindo à Amazing Shop! Conta criada.');
      setTimeout(() => {
        onLoginSuccess('user');
        navigate('/home');
      }, 1000);
    }, 1800);
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetMessages();

    setTimeout(() => {
      setSuccess('Instruções enviadas para o seu e-mail.');
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 animate-in fade-in duration-700">
      <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-[#0F172A] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-6 shadow-xl relative z-10">
            <i className={`fa-solid ${mode === 'login' ? 'fa-user-check' : mode === 'register' ? 'fa-user-plus' : 'fa-key'} text-[#0F172A] text-2xl`}></i>
          </div>
          <h2 className="text-3xl font-heading font-black text-white uppercase italic tracking-tighter relative z-10 leading-none">
            Amazing <span className="text-amber-500">{mode === 'login' ? 'Shop' : mode === 'register' ? 'Membro' : 'Seguro'}</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-3 relative z-10">Portal do Cliente</p>
        </div>

        <div className="p-10 sm:p-14">
          {error && (
            <div className="mb-8 bg-red-50 text-red-500 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in zoom-in border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-8 bg-green-50 text-green-600 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in zoom-in border border-green-100">
              {success}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">E-mail</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Password</label>
                  <button type="button" onClick={() => setMode('recover')} className="text-[9px] font-black uppercase text-amber-500">Esqueci-me</button>
                </div>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-[#0F172A] text-white py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-xl active:scale-95">
                {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Entrar Agora'}
              </button>
              <div className="text-center pt-6">
                <button type="button" onClick={() => setMode('register')} className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                  Não tem conta? <span className="text-amber-600 font-black ml-1">Registar aqui</span>
                </button>
              </div>
            </form>
          )}

          {mode === 'register' && (
             <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Nome Completo</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Password</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Confirmar</label>
                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-amber-500 text-[#0F172A] py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-[#0F172A] hover:text-white transition-all shadow-xl mt-4">
                  Criar Conta Amazing
                </button>
                <div className="text-center pt-4">
                  <button type="button" onClick={() => setMode('login')} className="text-[11px] font-black uppercase tracking-widest text-gray-400">Já sou membro</button>
                </div>
             </form>
          )}

          {mode === 'recover' && (
             <form onSubmit={handleRecover} className="space-y-6">
                <p className="text-xs text-gray-500 font-medium text-center italic mb-8">Introduza o seu e-mail para receber um link de redefinição.</p>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">E-mail de Registo</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all" />
                </div>
                <button type="submit" className="w-full bg-[#0F172A] text-white py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-amber-500 transition-all">Recuperar Acesso</button>
                <div className="text-center pt-4">
                  <button type="button" onClick={() => setMode('login')} className="text-[11px] font-black uppercase tracking-widest text-gray-400">Voltar</button>
                </div>
             </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
