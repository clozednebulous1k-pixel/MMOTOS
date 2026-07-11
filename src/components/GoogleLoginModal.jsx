import React, { useState } from 'react';
import { X, User } from 'lucide-react';

export default function GoogleLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const mockAccounts = [
    {
      name: 'Pedro Silva',
      email: 'pedrosilva.moto@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60'
    },
    {
      name: 'Mariana Souza',
      email: 'marianasouza.ride@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60'
    }
  ];

  const handleSelectAccount = (acc) => {
    onLoginSuccess(acc);
    onClose();
  };

  const handleSubmitCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) {
      setError('Digite seu nome');
      return;
    }
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setError('Digite um e-mail válido');
      return;
    }

    onLoginSuccess({
      name: customName,
      email: customEmail,
      avatarUrl: '' // will fall back to initials / generic user icon
    });
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      {/* Google-like card container */}
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '380px', 
          borderRadius: '8px', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          padding: '24px',
          border: '1px solid #dadce0',
          position: 'relative'
        }}
      >
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#5f6368',
            cursor: 'pointer'
          }}
          aria-label="Fechar login"
        >
          <X size={18} />
        </button>

        {/* Google Logo (G Symbol) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>

        <h3 style={{
          textAlign: 'center',
          fontFamily: "'Roboto', 'Inter', sans-serif",
          fontSize: '20px',
          fontWeight: '400',
          color: '#202124',
          marginBottom: '8px'
        }}>
          Fazer login
        </h3>
        
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#5f6368',
          marginBottom: '24px'
        }}>
          para continuar em <strong style={{ color: 'var(--primary)' }}>M Moto</strong>
        </p>

        {!customMode ? (
          <div>
            {/* Account List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
              {mockAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleSelectAccount(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 10px',
                    background: '#ffffff',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f8f8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <img 
                    src={acc.avatarUrl} 
                    alt={acc.name} 
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#3c4043' }}>{acc.name}</div>
                    <div style={{ fontSize: '11px', color: '#5f6368' }}>{acc.email}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setCustomMode(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border: 'none',
                color: '#1a73e8',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                justifyContent: 'center'
              }}
            >
              Usar outra conta
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitCustom}>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #dadce0',
                  borderRadius: '4px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="email"
                placeholder="Seu e-mail Google"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #dadce0',
                  borderRadius: '4px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            {error && (
              <p style={{ color: '#d93025', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  setCustomMode(false);
                  setError('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#5f6368',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Voltar
              </button>
              <button
                type="submit"
                style={{
                  background: '#1a73e8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Fazer login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
