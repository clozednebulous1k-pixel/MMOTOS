import React, { useState } from 'react';
import { X, Shield, Mail, Lock, User, Check, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, registeredAdmins, onRegisterAdmin }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false); // Toggle to custom email login

  // Form Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const mockGoogleAccounts = [
    {
      name: 'Pedro Silva',
      email: 'pedrosilva.moto@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
      role: 'customer'
    },
    {
      name: 'Mariana Souza',
      email: 'marianasouza.ride@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
      role: 'customer'
    }
  ];

  const sanitize = (text) => {
    return text.replace(/['";\-]/g, '').trim();
  };

  const handleGoogleLogin = (acc) => {
    onLoginSuccess(acc);
    onClose();
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = sanitize(email);
    const cleanPassword = sanitize(password);

    if (!cleanEmail || !cleanPassword) {
      setError('Preencha e-mail e senha.');
      return;
    }

    // Check if matching admin first
    const matchedAdmin = registeredAdmins.find(
      (admin) => admin.email === cleanEmail && admin.password === cleanPassword
    );

    if (matchedAdmin) {
      onLoginSuccess({
        name: matchedAdmin.name,
        email: matchedAdmin.email,
        role: 'admin',
        avatarUrl: ''
      });
      setError('');
      onClose();
      return;
    }

    // Default Customer Login (if not matching admin list, log in as normal customer)
    onLoginSuccess({
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: 'customer',
      avatarUrl: ''
    });
    setError('');
    onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const cleanName = sanitize(name);
    const cleanEmail = sanitize(email);
    const cleanPassword = sanitize(password);
    const cleanConfirm = sanitize(confirmPassword);

    if (!cleanName || !cleanEmail || !cleanPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (cleanPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setError('As senhas não coincidem.');
      return;
    }

    const userData = {
      name: cleanName,
      email: cleanEmail,
      role: 'customer',
      avatarUrl: ''
    };

    onLoginSuccess(userData);
    setError('');
    onClose();
    alert('Conta de Cliente criada com sucesso!');
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '400px', 
          borderRadius: '8px', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
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

        {/* Brand header in modal */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--text-title)' }}>Entrar na M Moto</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Acesse sua conta para gerenciar compras ou o painel administrativo.
          </p>
        </div>

        {/* Tabs for Login / Register */}
        <div style={{ display: 'flex', borderBottom: '1px solid #dadce0', marginBottom: '20px' }}>
          <button
            onClick={() => { setIsRegisterMode(false); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              background: 'transparent',
              border: 'none',
              borderBottom: !isRegisterMode ? '2px solid var(--primary)' : 'none',
              color: !isRegisterMode ? 'var(--text-title)' : 'var(--text-muted)',
              fontWeight: !isRegisterMode ? '700' : '500',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Fazer Login
          </button>
          <button
            onClick={() => { setIsRegisterMode(true); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              background: 'transparent',
              border: 'none',
              borderBottom: isRegisterMode ? '2px solid var(--primary)' : 'none',
              color: isRegisterMode ? 'var(--text-title)' : 'var(--text-muted)',
              fontWeight: isRegisterMode ? '700' : '500',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Criar Conta
          </button>
        </div>

        {!isCustomMode && !isRegisterMode ? (
          <div>
            {/* Google Login Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <button 
                onClick={() => handleGoogleLogin(mockGoogleAccounts[0])}
                className="google-login-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  background: '#ffffff',
                  border: '1px solid #dadce0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#3c4043'
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Entrar com Google (Pedro Silva)
              </button>
              <button 
                onClick={() => handleGoogleLogin(mockGoogleAccounts[1])}
                className="google-login-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  background: '#ffffff',
                  border: '1px solid #dadce0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#3c4043'
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Entrar com Google (Mariana Souza)
              </button>
            </div>

            <div style={{ textAlign: 'center', margin: '15px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              — OU ENTRAR COM E-MAIL —
            </div>

            <button
              onClick={() => setIsCustomMode(true)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid #cccccc',
                color: 'var(--text-title)',
                padding: '10px 14px',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Usar E-mail e Senha
            </button>
          </div>
        ) : (
          /* TRADITIONAL EMAIL FLOW */
          <div>
            {!isRegisterMode ? (
              /* LOGIN */
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Senha</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>
                    {error}
                  </p>
                )}

                <button type="submit" className="checkout-btn" style={{ width: '100%' }}>
                  Entrar
                </button>

                <button
                  type="button"
                  onClick={() => { setIsCustomMode(false); setError(''); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#1a73e8',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '16px',
                    textAlign: 'center'
                  }}
                >
                  Voltar para login Google
                </button>
              </form>
            ) : (
              /* REGISTER (CADASTRO) */
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Senha</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Mín. 6 dígitos"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirmar Senha</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Confirme"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>


                {error && (
                  <p style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>
                    {error}
                  </p>
                )}

                <button type="submit" className="checkout-btn" style={{ width: '100%' }}>
                  Cadastrar
                </button>

                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(false); setIsCustomMode(false); setError(''); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#1a73e8',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '16px',
                    textAlign: 'center'
                  }}
                >
                  Voltar para login Google
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
