
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

interface NavbarProps {
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="shrink-0 transition-transform hover:scale-105">
            <Logo className="h-10" />
          </Link>

          {/* Links de Navegação */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F172A] hover:text-amber-500 transition-colors font-heading">Produtos</Link>
            <Link to="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F172A] hover:text-amber-500 transition-colors font-heading">Sobre Nós</Link>
            <Link to="/support" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F172A] hover:text-amber-500 transition-colors font-heading">Suporte</Link>
            <Link to="/support#contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F172A] hover:text-amber-500 transition-colors font-heading">Contacto</Link>
          </div>

          {/* Carrinho */}
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative p-2 text-[#0F172A] hover:text-amber-500 transition-all group">
              <i className="fa-solid fa-shopping-bag text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-500 text-[#0F172A] text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
