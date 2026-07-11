import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onProductClick, onAddToCart }) {
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation(); // prevent modal opening
    onAddToCart(product);
  };

  return (
    <div className="product-card" onClick={() => onProductClick(product)}>
      <div className="card-image-container">
        {product.isBestSeller && <span className="card-badge">Mais Vendido</span>}
        {product.mlLinked && <span className="card-ml-badge">Mercado Livre</span>}
        <img 
          src={product.image} 
          alt={product.title} 
          className="card-image"
          loading="lazy"
        />
      </div>
      <div className="card-info">
        <span className="card-category">{product.categoryName}</span>
        <h3 className="card-title">{product.title}</h3>
        
        <div className="card-rating">
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                fill={i < Math.floor(product.rating) ? '#f1c40f' : 'none'} 
                stroke="#f1c40f" 
              />
            ))}
          </div>
          <span className="card-rating-text">{product.rating} ({product.reviews})</span>
        </div>

        <div className="card-price-container">
          <span className="card-price">{formatPrice(product.price)}</span>
          <div className="card-installments">
            ou 12x de {formatPrice(product.price / 12)}
          </div>
        </div>

        <button className="card-btn" onClick={handleQuickAdd}>
          <ShoppingCart size={15} /> Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
