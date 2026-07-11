import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, Shield, Truck } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [selectedAttr, setSelectedAttr] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Auto-select first attribute option if available
  useEffect(() => {
    if (product && product.attributes && product.attributes.options.length > 0) {
      setSelectedAttr(product.attributes.options[0]);
    }
  }, [product]);

  if (!product) return null;

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedAttr);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar detalhes">
          <X size={20} />
        </button>

        <div className="modal-grid">
          <div className="modal-image-col">
            <img src={product.image} alt={product.title} className="modal-image" />
          </div>

          <div className="modal-info-col">
            <span className="modal-category">{product.categoryName}</span>
            <h2 className="modal-title">{product.title}</h2>

            <div className="card-rating" style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < Math.floor(product.rating) ? '#f1c40f' : 'none'} 
                    stroke="#f1c40f" 
                  />
                ))}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {product.rating} ({product.reviews} avaliações)
              </span>
            </div>

            <div className="modal-ml-guarantee">
              <Shield size={14} /> Garantia M Moto & Mercado Pago Integrado
            </div>

            <div className="modal-price-container">
              <span className="modal-price-label">Preço à vista</span>
              <div className="modal-price">{formatPrice(product.price)}</div>
              <div className="modal-price-sub">
                ou em até 12x de <strong style={{ color: '#fff' }}>{formatPrice((product.price * 1.05) / 12)}</strong> no cartão
              </div>
            </div>

            <p className="modal-description">{product.description}</p>

            {product.attributes && (
              <div style={{ marginBottom: '20px' }}>
                <h4 className="modal-attribute-title">{product.attributes.label}:</h4>
                <div className="modal-sizes">
                  {product.attributes.options.map((opt) => (
                    <button
                      key={opt}
                      className={`size-btn ${selectedAttr === opt ? 'active' : ''}`}
                      onClick={() => setSelectedAttr(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Truck size={16} color="#2ecc71" />
              <span style={{ fontSize: '13px', color: '#2ecc71', fontWeight: '500' }}>
                Frete grátis para todo o Brasil
              </span>
            </div>

            <div className="modal-action-row">
              <div className="qty-selector">
                <button 
                  className="qty-btn" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="Diminuir quantidade"
                >
                  -
                </button>
                <span className="qty-val">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => setQuantity(q => q + 1)}
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>

              <button className="modal-add-btn" onClick={handleAdd}>
                <ShoppingCart size={18} /> Comprar Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
