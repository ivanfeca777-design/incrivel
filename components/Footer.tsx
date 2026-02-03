
import React from 'react';
import { Link } from 'react-router-dom';
import { STORE_INFO } from '../constants';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4 filter brightness-0 invert">
              <Logo className="h-10" />
            </div>
            {/* Link Administrativo Segregado: Porta secreta para o Gestor Evaristo */}
            <div className="mb-6">
              <Link 
                to="/admin-control" 
                className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-amber-500 transition-all flex items-center gap-2 group w-fit"
              >
                <i className="fa-solid fa-key text-[8px] group-hover:scale-110 transition-transform"></i>
                Acesso Restrito
              </Link>
            </div>
            <p className="text-sm leading-relaxed mb-6 italic">
              "Experimente o extraordinário. Compre o incrível."
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all"><i className="fa-brands fa-twitter"></i></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest border-l-2 border-amber-500 pl-3">Explorar</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-amber-400 transition-colors">Novidades</Link></li>
              <li><Link to="/products" className="hover:text-amber-400 transition-colors">Mais Vendidos</Link></li>
              <li><Link to="/products" className="hover:text-amber-400 transition-colors">Ofertas Exclusivas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest border-l-2 border-amber-500 pl-3">Assistência</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/track-order" className="hover:text-amber-400 transition-colors">Acompanhar Pedido</Link></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Lojas Físicas</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Centro de Devoluções</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Ajuda & FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest border-l-2 border-amber-500 pl-3">Contacto Directo</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 group">
                <i className="fa-solid fa-location-dot mt-1 text-amber-500 group-hover:scale-110 transition-transform"></i>
                <span className="group-hover:text-white transition-colors">{STORE_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <i className="fa-solid fa-phone text-amber-500 group-hover:scale-110 transition-transform"></i>
                <span className="group-hover:text-white transition-colors">{STORE_INFO.phone}</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <i className="fa-solid fa-envelope text-amber-500 group-hover:scale-110 transition-transform"></i>
                <span className="group-hover:text-white transition-colors">{STORE_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 text-center text-[10px] tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} {STORE_INFO.name}. Criado para os ousados. Desenhado para o incrível.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
