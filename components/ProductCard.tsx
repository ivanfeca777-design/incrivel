
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-white p-8">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-5 left-5">
          <span className="bg-[#0F172A] text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
            {product.category}
          </span>
        </div>
      </Link>
      
      <div className="p-8 flex flex-col flex-grow border-t border-gray-50">
        <Link to={`/product/${product.id}`} className="block mb-4">
          <h3 className="font-heading font-black text-[#0F172A] text-xl leading-tight tracking-tight line-clamp-2 group-hover:text-amber-500 transition-colors uppercase italic">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-6">
          <div className="flex text-amber-400 text-[12px] space-x-1">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-gray-100'}`}></i>
            ))}
          </div>
          <span className="text-[10px] text-gray-400 ml-4 font-bold uppercase tracking-widest">{product.reviews} reviews</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="font-heading font-black text-2xl text-[#0F172A] tracking-tighter">
            {product.price.toLocaleString('pt-AO')} <span className="text-sm font-bold text-gray-400 ml-1">KZ</span>
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="bg-[#0F172A] text-white w-14 h-14 rounded-2xl hover:bg-amber-500 hover:text-[#0F172A] transition-all flex items-center justify-center transform active:scale-95 shadow-xl shadow-gray-200"
          >
            <i className="fa-solid fa-plus text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
