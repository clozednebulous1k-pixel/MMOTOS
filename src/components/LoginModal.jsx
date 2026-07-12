import React, { useState } from 'react';
import { X, Shield, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { auth, isFirebaseActive } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, registeredAdmins }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const sanitize = (text) => {
    return text.replace(/['";\-]/g, '').trim();
  };

  const determineRole = (userEmail) => {
    // Check if the email belongs to an administrator
    const isAdmin = registeredAdmins.some(admin => admin.email.toLowerCase() === userEmail.toLowerCase());
    return isAdmin ? 'admin' : 'customer';
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = sanitize(email);
    const cleanPassword = sanitize(password);

    if (!cleanEmail || !cleanPassword) {
      setError('Preencha e-mail e senha.');
      return;
    }

    setIsLoading(true);
    setError('');

    if (isFirebaseActive && auth) {
      // Real Firebase Authentication
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        const role = determineRole(cleanEmail);
        onLoginSuccess({
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: role,
          avatarUrl: ''
        });
        onClose();
      } catch (err) {
        console.error("Firebase Auth Error:", err);
        setError('E-mail ou senha incorretos (Firebase). Verifique suas credenciais.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fallback offline / simulated auth for development resilience
      console.warn("Firebase desativado. Usando login simulado.");
      const matchedAdmin = registeredAdmins.find(
        (admin) => admin.email.toLowerCase() === cleanEmail.toLowerCase() && admin.password === cleanPassword
      );

      if (matchedAdmin) {
        onLoginSuccess({
          name: matchedAdmin.name,
          email: matchedAdmin.email,
          role: 'admin',
          avatarUrl: ''
        });
      } else {
        onLoginSuccess({
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'customer',
          avatarUrl: ''
        });
      }
      setIsLoading(false);
      onClose();
    }
  };

  const handleRegisterSubmit = async (e) => {
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

    setIsLoading(true);
    setError('');

    if (isFirebaseActive && auth) {
      // Real Firebase Registration
      try {
        await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        const role = determineRole(cleanEmail);
        onLoginSuccess({
          name: cleanName,
          email: cleanEmail,
          role: role,
          avatarUrl: ''
        });
        alert('Conta criada com sucesso no Firebase!');
        onClose();
      } catch (err) {
        console.error("Firebase Auth Error:", err);
        if (err.code === 'auth/email-already-in-use') {
          setError('Este e-mail já está cadastrado.');
        } else {
          setError('Erro ao criar conta. Tente novamente.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fallback offline / simulated registration
      const role = determineRole(cleanEmail);
      onLoginSuccess({
        name: cleanName,
        email: cleanEmail,
        role: role,
        avatarUrl: ''
      });
      alert('Conta de Cliente criada com sucesso (Modo Simulado)!');
      setIsLoading(false);
      onClose();
    }
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
          position: 'relative',
          background: '#ffffff'
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
          <h3 style={{ fontSize: '20px', color: 'var(--text-title)' }}>M Moto Login</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isRegisterMode ? 'Crie sua conta para acompanhar seus pedidos.' : 'Acesse sua conta para gerenciar compras.'}
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

        <div>
          {!isRegisterMode ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Seu e-mail"
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '12px', marginBottom: '16px', justifyContent: 'center', fontWeight: '500' }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button type="submit" className="checkout-btn" style={{ width: '100%', opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
                {isLoading ? 'Autenticando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
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
                  placeholder="Seu e-mail"
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
                    placeholder="Confirme a senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '12px', marginBottom: '16px', justifyContent: 'center', fontWeight: '500' }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button type="submit" className="checkout-btn" style={{ width: '100%', opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Cadastrar Conta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
