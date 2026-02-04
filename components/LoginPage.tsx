
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

    setTimeout(() => {
      if (email && password.length >= 6) {
        onLoginSuccess('user');
        navigate('/home');
      } else {
        setError('Acesso negado. Verifique as suas credenciais.');
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetMessages();

    if (password !== confirmPassword) {
      setError('As passwords não coincidem.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess('Conta criada com sucesso!');
      setTimeout(() => {
        onLoginSuccess('user');
        navigate('/home');
      }, 1000);
    }, 1800);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-xl rounded-[48px] border border-white/20 shadow-2xl overflow-hidden">
        {/* Header do Cartão */}
        <div className="p-10 text-center border-b border-white/10">
          <h2 className="text-2xl font-heading font-black text-white uppercase italic tracking-widest leading-none">
            {mode === 'login' ? 'Acesso Amazing' : mode === 'register' ? 'Novo Membro' : 'Recuperação'}
          </h2>
          <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.4em] mt-3 italic">Portal Exclusivo</p>
        </div>

        <div className="p-10 space-y-6">
          {error && (
            <div className="bg-red-500/20 text-red-200 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-500/30 animate-in zoom-in">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/20 text-green-200 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-green-500/30 animate-in zoom-in">
              {success}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">E-mail</label>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 font-bold text-white outline-none focus:border-amber-500 transition-all placeholder:text-gray-600"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                  <button type="button" onClick={() => setMode('recover')} className="text-[9px] font-black uppercase text-amber-500 hover:text-white transition-colors">Esqueci-me</button>
                </div>
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 font-bold text-white outline-none focus:border-amber-500 transition-all"
                />
              </div>
              <button 
                type="submit" disabled={isLoading}
                className="w-full bg-amber-500 text-[#0F172A] py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl active:scale-95 text-xs"
              >
                {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Entrar na Amazing Shop'}
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setMode('register')} className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Ainda não é membro? <span className="text-amber-500 ml-1">Registar</span>
                </button>
              </div>
            </form>
          )}

          {mode === 'register' && (
             <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome Completo</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 font-bold text-white outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 font-bold text-white outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 font-bold text-white outline-none focus:border-amber-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirmar</label>
                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 font-bold text-white outline-none focus:border-amber-500 transition-all" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-amber-500 text-[#0F172A] py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl mt-4 text-xs">
                  Criar Identidade Digital
                </button>
                <div className="text-center pt-2">
                  <button type="button" onClick={() => setMode('login')} className="text-[11px] font-black uppercase tracking-widest text-gray-400">Já sou membro</button>
                </div>
             </form>
          )}

          {mode === 'recover' && (
             <form onSubmit={(e) => { e.preventDefault(); setSuccess('Link enviado!'); }} className="space-y-6">
                <p className="text-[11px] text-gray-400 font-medium text-center italic mb-4">Insira o seu e-mail para recuperar o acesso.</p>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">E-mail de Registo</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 font-bold text-white outline-none focus:border-amber-500 transition-all" />
                </div>
                <button type="submit" className="w-full bg-amber-500 text-[#0F172A] py-6 rounded-2xl font-heading font-black uppercase tracking-widest hover:bg-white transition-all text-xs">Recuperar Password</button>
                <div className="text-center pt-2">
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
