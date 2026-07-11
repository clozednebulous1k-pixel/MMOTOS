import React, { useState } from 'react';
import { Phone, X, MessageCircle } from 'lucide-react';

export default function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false); // Closed by default, opens on click
  const phoneNumber = "5511952025568";
  const displayPhone = "(11) 95202-5568";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Olá! Estou no site da M Moto e tenho uma dúvida sobre minha compra.`;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, fontFamily: 'var(--font-body)' }}>
      {/* Floating WhatsApp Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: '#25d366', // WhatsApp Green
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
            transition: 'transform 0.2s',
            animation: 'pop 0.3s ease-out'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="Fale conosco no WhatsApp"
        >
          <MessageCircle size={30} fill="#ffffff" />
        </button>
      )}

      {/* Floating Contact Card */}
      {isOpen && (
        <div style={{
          width: '300px',
          background: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Header */}
          <div style={{
            background: '#25d366',
            color: '#ffffff',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={18} fill="#ffffff" />
              <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>Suporte M Moto</h4>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              aria-label="Fechar contato"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-title)', marginBottom: '4px' }}>
              Dúvidas sobre sua compra?
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Fale conosco agora pelo WhatsApp!
            </p>
            
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#25d366',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '10px 16px',
                borderRadius: '4px',
                fontWeight: '700',
                fontSize: '13px',
                boxShadow: '0 2px 4px rgba(37, 211, 102, 0.2)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#20ba5a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#25d366'}
            >
              <Phone size={14} fill="#ffffff" /> Chamar no WhatsApp
            </a>
            
            <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
              Tel: <strong style={{ color: 'var(--text-title)' }}>{displayPhone}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
