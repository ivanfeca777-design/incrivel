
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

    // Credenciais do Gestor
    const ADMIN_EMAIL = 'evaristofecayamalej@gmail.com';
    const ADMIN_PASS = 'Adminfeca1319';

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        onLoginSuccess('admin');
        navigate('/admin');
      } else if (email && password.length >= 6) {
        onLoginSuccess('user');
        navigate('/profile');
      } else {
        setError('Credenciais inválidas. Verifique os dados introduzidos.');
        setIsLoading(false);
      }
    }, 1500);
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
      setSuccess('Conta criada com sucesso! A entrar...');
      setTimeout(() => {
        onLoginSuccess('user');
        navigate('/profile');
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
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Profissional */}
        <div className="bg-[#0F172A] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-6 shadow-xl relative z-10">
            <i className={`fa-solid ${mode === 'login' ? 'fa-user-shield' : mode === 'register' ? 'fa-user-plus' : 'fa-key'} text-white text-2xl`}></i>
          </div>
          <h2 className="text-3xl font-heading font-black text-white uppercase italic tracking-tighter relative z-10">
            Amazing <span className="text-amber-500">{mode === 'login' ? 'Access' : mode === 'register' ? 'Join' : 'Reset'}</span>
          </h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-3 relative z-10">
            {mode === 'login' && 'Plataforma de Autenticação Unificada'}
            {mode === 'register' && 'Crie a sua conta de cliente premium'}
            {mode === 'recover' && 'Recuperação de Acesso Seguro'}
          </p>
        </div>

        <div className="p-10 sm:p-14">
          {/* Alertas */}
          {error && (
            <div className="mb-8 bg-red-50 text-red-500 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in zoom-in border border-red-100 flex items-center justify-center gap-3">
              <i className="fa-solid fa-circle-exclamation text-sm"></i> {error}
            </div>
          )}
          {success && (
            <div className="mb-8 bg-emerald-50 text-emerald-600 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in zoom-in border border-emerald-100 flex items-center justify-center gap-3">
              <i className="fa-solid fa-circle-check text-sm"></i> {success}
            </div>
          )}

          {/* Form de Login */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">E-mail</label>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all"
                  placeholder="exemplo@email.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Palavra-passe</label>
                  <button type="button" onClick={() => setMode('recover')} className="text-[9px] font-black uppercase text-amber-500 hover:underline">Esqueceu a senha?</button>
                </div>
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-[#0F172A] text-white py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-xl disabled:opacity-50">
                {isLoading ? <i className="fa-solid fa-circle-notch animate-spin mr-2"></i> : 'Entrar na Conta'}
              </button>
              <div className="text-center pt-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Novo por aqui? <button type="button" onClick={() => setMode('register')} className="text-amber-600 font-black hover:underline ml-1">Criar Conta Incrível</button>
                </p>
              </div>
            </form>
          )}

          {/* Form de Registo */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Nome Completo</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all"
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">E-mail</label>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all"
                  placeholder="exemplo@email.com"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Password</label>
                  <input 
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Confirmar</label>
                  <input 
                    type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-amber-500 text-[#0F172A] py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-[#0F172A] hover:text-white transition-all shadow-xl disabled:opacity-50 mt-4">
                {isLoading ? <i className="fa-solid fa-circle-notch animate-spin mr-2"></i> : 'Registar Cliente'}
              </button>
              <div className="text-center pt-4">
                <button type="button" onClick={() => setMode('login')} className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#0F172A]">Já tenho conta. <span className="text-amber-600 underline">Fazer Login</span></button>
              </div>
            </form>
          )}

          {/* Form de Recuperação */}
          {mode === 'recover' && (
            <form onSubmit={handleRecover} className="space-y-6 text-center">
              <p className="text-sm text-gray-500 font-medium px-4 mb-8">Introduza o e-mail da sua conta e enviaremos um link para redefinir a sua palavra-passe com segurança.</p>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">E-mail de Registo</label>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#0F172A] outline-none focus:border-amber-500 transition-all"
                  placeholder="exemplo@email.com"
                />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-[#0F172A] text-white py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-amber-500 hover:text-[#0F172A] transition-all shadow-xl disabled:opacity-50">
                {isLoading ? <i className="fa-solid fa-circle-notch animate-spin mr-2"></i> : 'Enviar Link de Redefinição'}
              </button>
              <div className="text-center pt-4">
                <button type="button" onClick={() => setMode('login')} className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#0F172A]"><i className="fa-solid fa-arrow-left mr-2"></i> Voltar ao Login</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
