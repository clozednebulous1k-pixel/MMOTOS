import React from 'react';
import { X, Trash2, ShoppingBag, CreditCard } from 'lucide-react';

export default function CartSidebar({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onRemoveItem, 
  onCheckout 
}) {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3 className="cart-title">
            <ShoppingBag size={20} color="var(--primary)" /> Seu Carrinho
          </h3>
          <button className="cart-close-btn" onClick={onClose} aria-label="Fechar carrinho">
            <X size={24} />
          </button>
        </div>

        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={48} strokeWidth={1} color="var(--text-muted)" />
              <p>Seu carrinho está vazio.</p>
              <button 
                onClick={onClose} 
                className="btn-secondary" 
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Voltar às Compras
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={`${item.id}-${item.selectedAttr}`}>
                <div className="cart-item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.title}</h4>
                  {item.selectedAttr && (
                    <p className="cart-item-attr">
                      Opção selecionada: <strong style={{ color: '#fff' }}>{item.selectedAttr}</strong>
                    </p>
                  )}
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                </div>
                <div className="cart-item-controls">
                  <button 
                    className="cart-remove-btn" 
                    onClick={() => onRemoveItem(item.id, item.selectedAttr)}
                    aria-label="Remover item"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="cart-item-qty">
                    <button 
                      className="cart-item-qty-btn" 
                      onClick={() => onUpdateQty(item.id, item.selectedAttr, item.quantity - 1)}
                      aria-label="Diminuir"
                    >
                      -
                    </button>
                    <span className="cart-item-qty-val">{item.quantity}</span>
                    <button 
                      className="cart-item-qty-btn" 
                      onClick={() => onUpdateQty(item.id, item.selectedAttr, item.quantity + 1)}
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            <div className="cart-summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Frete</span>
              <span style={{ color: '#2ecc71', fontWeight: '600' }}>GRÁTIS</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            
            <button 
              className="checkout-btn" 
              onClick={onCheckout}
              style={{ marginTop: '20px' }}
            >
              <CreditCard size={18} /> Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}
