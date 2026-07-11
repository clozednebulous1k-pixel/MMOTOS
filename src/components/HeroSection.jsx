import React from 'react';
import { ArrowRight, Zap, Shield } from 'lucide-react';

export default function HeroSection({ onExploreClick }) {
  return (
    <section className="hero-wrapper">
      <div className="container hero-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="hero-tag">
            <Zap size={14} /> Especialista em Duas Rodas
          </div>
          
          <h2 className="hero-title" style={{ maxWidth: '750px' }}>
            Eleve o nível da sua máquina com a <span>M Moto</span>
          </h2>
          
          <p className="hero-desc" style={{ maxWidth: '600px', margin: '0 auto 25px' }}>
            Encontre acessórios premium e peças de alta performance para a sua pilotagem. 
            Produtos selecionados com garantia de qualidade, suporte especializado e entrega garantida.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <button className="hero-cta" onClick={onExploreClick}>
              Explorar Catálogo <ArrowRight size={16} />
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            width: '100%',
            maxWidth: '500px',
            borderTop: '1px solid var(--border)',
            paddingTop: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="var(--primary)" />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Garantia de Entrega</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color="var(--primary)" />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Envio Expresso Rápido</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
