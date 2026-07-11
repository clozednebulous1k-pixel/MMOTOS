import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function ProductRequestForm({ onAddRequest }) {
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName.trim() || !customerName.trim() || !contactInfo.trim()) {
      alert('Por favor, preencha todos os campos do formulário de solicitação.');
      return;
    }

    // Call the parent state dispatch
    if (onAddRequest) {
      onAddRequest({
        productName: productName.trim(),
        customerName: customerName.trim(),
        contactInfo: contactInfo.trim()
      });
    }

    setSubmitted(true);
    setProductName('');
    setCustomerName('');
    setContactInfo('');

    setTimeout(() => {
      setSubmitted(false);
    }, 6000); // Reset feedback banner
  };

  return (
    <section style={{
      background: '#ffffff',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '40px 0',
      width: '100%'
    }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '25px'
        }}>
          <h3 style={{ fontSize: '20px', color: 'var(--text-title)', marginBottom: '8px' }}>
            Não encontrou a peça ou acessório que procurava?
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Nós localizamos para você! Faça uma solicitação direta e retornaremos com o orçamento em minutos.
          </p>
        </div>

        {submitted ? (
          <div style={{
            background: 'rgba(0, 166, 80, 0.05)',
            border: '1px solid var(--success)',
            borderRadius: '6px',
            padding: '20px',
            textAlign: 'center',
            color: 'var(--success)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            animation: 'pop 0.3s ease-out'
          }}>
            <CheckCircle size={32} />
            <h4 style={{ color: 'var(--success)' }}>Solicitação Registrada com Sucesso!</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', maxWidth: '400px' }}>
              Nossa equipe comercial foi acionada. Entraremos em contato via WhatsApp/E-mail assim que localizarmos o item no estoque.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Peça ou Acessório Desejado</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Escapamento Vance & Hines Iron 883, Guidão Ape Hanger 14 pol, etc."
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Seu Nome</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nome completo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">WhatsApp ou E-mail</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="(11) 99999-9999 ou e-mail"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="checkout-btn" 
              style={{
                alignSelf: 'center',
                width: 'auto',
                minWidth: '200px',
                marginTop: '10px',
                padding: '10px 24px',
                fontSize: '13px'
              }}
            >
              <Send size={14} style={{ marginRight: '5px' }} /> Enviar Solicitação
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
