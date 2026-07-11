import React from 'react';
import { ShoppingBag, Search, ShieldCheck, LogOut, ShieldAlert } from 'lucide-react';
import Logo from './Logo';

export default function Header({ 
  cartCount, 
  onCartClick, 
  searchQuery, 
  setSearchQuery, 
  onResetView,
  user,
  onLoginClick,
  onLogoutClick,
  onAdminPanelClick
}) {
  return (
    <header className="header-wrapper">
      <div className="container header-container">
        <a href="#" className="logo-link" onClick={(e) => { e.preventDefault(); onResetView(); }}>
          <Logo height={42} light={true} />
        </a>

        <div className="search-bar">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar capacetes, jaquetas, retrovisores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '2px 6px'
              }}
            >
              Limpar
            </button>
          )}
        </div>

        <div className="header-actions">
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--success)',
            fontWeight: '600'
          }} className="hide-mobile">
            <ShieldCheck size={16} />
            Compra 100% Segura
          </span>

          {/* Unified Login Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* If Admin, show Quick Admin Panel entry button in the header */}
              {user.role === 'admin' && (
                <button 
                  onClick={onAdminPanelClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    marginRight: '6px'
                  }}
                  title="Abrir painel administrativo"
                >
                  <ShieldAlert size={12} /> Painel Admin
                </button>
              )}

              <div className="hide-mobile" style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-title)', fontWeight: '600', display: 'block' }}>
                  Olá, {user.name.split(' ')[0]}
                </span>
              </div>
              
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                />
              ) : (
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: user.role === 'admin' ? 'var(--primary)' : '#2d3277',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <button 
                onClick={onLogoutClick}
                title="Sair"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="google-login-btn"
              onClick={onLoginClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                border: '1px solid #dadce0',
                borderRadius: '4px',
                padding: '6px 14px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                color: '#3c4043',
                fontFamily: "'Roboto', 'Inter', sans-serif",
                transition: 'background-color 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7f8f8';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Login
            </button>
          )}

          <button className="cart-trigger" onClick={onCartClick} aria-label="Abrir Carrinho">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
