import React, { useEffect, useState } from 'react';
import { Check, ShieldCheck, MapPin, Calendar, ArrowRight, Truck } from 'lucide-react';

export default function OrderSuccess({ orderData, onReset }) {
  const [trackingStep, setTrackingStep] = useState(1); // 1: Approved, 2: Packing, 3: Shipped

  useEffect(() => {
    // Simulate shipping progression for immersive mockup experience
    const timer1 = setTimeout(() => setTrackingStep(2), 4000);
    const timer2 = setTimeout(() => setTrackingStep(3), 8000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const formatPrice = (price) => {
    return price ? price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';
  };

  const getEstimatedDate = () => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 3); // 3 days shipping
    return delivery.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getPaymentName = (method) => {
    switch (method) {
      case 'pix': return 'Pix Copia e Cola';
      case 'credit_card': return 'Cartão de Crédito';
      case 'boleto': return 'Boleto Bancário';
      default: return 'Mercado Pago';
    }
  };

  const randomOrderId = Math.floor(100000 + Math.random() * 900000);

  return (
    <section className="container" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="success-container">
        <div className="success-icon-wrap">
          <Check size={40} strokeWidth={3} />
        </div>
        
        <h2 className="success-title">Pedido Confirmado!</h2>
        <p className="success-subtitle">
          Obrigado pela sua compra, <strong>{orderData?.customerName || 'Cliente'}</strong>! 
          Seu pedido foi registrado no sistema sob o número <strong style={{ color: '#fff' }}>#MM-{randomOrderId}</strong>.
        </p>

        {/* Dynamic Tracking Timeline */}
        <div style={{ marginTop: '20px', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Status de Rastreamento
          </h4>
        </div>

        <div className="tracking-timeline">
          <div className={`tracking-step ${trackingStep >= 1 ? 'completed' : ''}`}>
            <div className="tracking-node">
              <Check size={14} />
            </div>
            <span className="tracking-label">Pagamento Aprovado</span>
          </div>

          <div className={`tracking-step ${trackingStep >= 2 ? (trackingStep === 2 ? 'active' : 'completed') : ''}`}>
            <div className="tracking-node">
              <Calendar size={14} />
            </div>
            <span className="tracking-label">Preparando Envio</span>
          </div>

          <div className={`tracking-step ${trackingStep >= 3 ? (trackingStep === 3 ? 'active' : 'completed') : ''}`}>
            <div className="tracking-node">
              <Truck size={14} />
            </div>
            <span className="tracking-label">Em Trânsito</span>
          </div>

          <div className="tracking-step">
            <div className="tracking-node">
              <MapPin size={14} />
            </div>
            <span className="tracking-label">Entregue</span>
          </div>
        </div>

        {/* Order Details Details */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '35px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Método de Pagamento:</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>{getPaymentName(orderData?.paymentMethod)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Endereço de Entrega:</span>
            <span style={{ color: '#fff', textAlign: 'right', maxWidth: '300px' }}>{orderData?.address}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Previsão de Entrega:</span>
            <span style={{ color: '#2ecc71', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} /> {getEstimatedDate()}
            </span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700' }}>
            <span>Valor Total Pago:</span>
            <span style={{ color: 'var(--primary)' }}>{formatPrice(orderData?.total)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <button className="hero-cta" onClick={onReset}>
            Voltar para a Loja <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
