import React, { useState } from 'react';
import { Shield, LayoutGrid, FileInput, RotateCw, Plus, Edit, Trash2, ArrowLeft, LogOut, CheckCircle, Smartphone } from 'lucide-react';

export default function AdminPanel({ 
  productsList, 
  requestsList, 
  onAddProduct, 
  onEditProduct, 
  onRemoveProduct,
  onImportMLMock,
  onClose 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'catalog', 'ml_import'

  // Product Form states
  const [isEditing, setIsEditing] = useState(null); // holds product object or null
  const [isAdding, setIsAdding] = useState(false);
  const [prodForm, setProdForm] = useState({ title: '', category: 'acessorios', price: '', description: '', image: '', rating: 4.8, reviews: 10, isBestSeller: false, mlLinked: true });

  // Mercado Livre mock link importer
  const [mlUrl, setMlUrl] = useState('');
  const [mlSuccess, setMlSuccess] = useState(false);
  const [mlSyncing, setMlSyncing] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@mmoto.com' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Credenciais inválidas! Use admin@mmoto.com / admin123');
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!prodForm.title || !prodForm.price || !prodForm.description || !prodForm.image) {
      alert('Preencha todos os campos do produto.');
      return;
    }

    const priceNum = parseFloat(prodForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Insira um preço válido.');
      return;
    }

    if (isAdding) {
      onAddProduct({
        ...prodForm,
        id: Date.now(),
        price: priceNum,
        categoryName: prodForm.category.charAt(0).toUpperCase() + prodForm.category.slice(1)
      });
      setIsAdding(false);
    } else if (isEditing) {
      onEditProduct({
        ...isEditing,
        ...prodForm,
        price: priceNum,
        categoryName: prodForm.category.charAt(0).toUpperCase() + prodForm.category.slice(1)
      });
      setIsEditing(null);
    }

    // Reset Form
    setProdForm({ title: '', category: 'acessorios', price: '', description: '', image: '', rating: 4.8, reviews: 10, isBestSeller: false, mlLinked: true });
  };

  const handleStartEdit = (prod) => {
    setIsEditing(prod);
    setIsAdding(false);
    setProdForm({
      title: prod.title,
      category: prod.category,
      price: prod.price.toString(),
      description: prod.description,
      image: prod.image,
      rating: prod.rating,
      reviews: prod.reviews,
      isBestSeller: prod.isBestSeller,
      mlLinked: prod.mlLinked
    });
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    setProdForm({ title: '', category: 'acessorios', price: '', description: '', image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80', rating: 4.8, reviews: 12, isBestSeller: false, mlLinked: true });
  };

  // Simula a sincronização da conta do Mercado Livre
  const handleMLSync = () => {
    setMlSyncing(true);
    setTimeout(() => {
      onImportMLMock(); // Triggers importing mock items to catalog in App.jsx
      setMlSyncing(false);
      setMlSuccess(true);
      setTimeout(() => setMlSuccess(false), 5000);
    }, 2000);
  };

  const handleMLUrlImport = (e) => {
    e.preventDefault();
    if (!mlUrl.trim() || !mlUrl.includes('mercadolivre.com')) {
      alert('Insira uma URL válida de anúncio do Mercado Livre!');
      return;
    }

    setMlSyncing(true);
    setTimeout(() => {
      // Create a mock imported product based on URL keywords or general mock
      const cleanTitle = mlUrl.split('/').pop()?.replace(/-/g, ' ') || 'Peça Importada Mercado Livre';
      const capitalizedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      
      onAddProduct({
        id: Date.now(),
        title: capitalizedTitle.substring(0, 50) + ' (Importado ML)',
        category: 'pecas',
        categoryName: 'Peças & Motores',
        price: 499.00,
        rating: 4.7,
        reviews: 24,
        description: 'Produto importado diretamente do anúncio do Mercado Livre. Totalmente sincronizado com o estoque e frete grátis da M Moto.',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
        isBestSeller: false,
        mlLinked: true
      });
      setMlUrl('');
      setMlSyncing(false);
      alert('Anúncio do Mercado Livre importado e sincronizado com sucesso!');
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="modal-overlay">
        <div className="checkout-card" style={{ maxWidth: '400px', width: '100%', margin: '0 auto', background: '#ffffff', border: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(211,47,47,0.08)', color: 'var(--primary)', padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '20px' }}>Painel Administrativo</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>M Moto Peças e Acessórios</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">E-mail Administrativo</label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@mmoto.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha de Acesso</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {loginError && (
              <p style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>
                {loginError}
              </p>
            )}

            <button type="submit" className="checkout-btn" style={{ width: '100%' }}>
              Autenticar
            </button>
          </form>

          <button 
            onClick={onClose} 
            className="btn-secondary" 
            style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} /> Voltar para Loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh', padding: '30px 0' }}>
      <div className="container">
        
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px 24px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary)', color: '#ffffff', padding: '6px', borderRadius: '4px' }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px' }}>M Moto | Painel do Administrador</h2>
              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '600' }}>
                Firebase Sync Active • Modo Testes Autorizado
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}>
              <ArrowLeft size={15} /> Ver Site
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="checkout-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}>
              <LogOut size={15} /> Sair
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '30px', alignItems: 'start' }}>
          
          {/* Tab Sidebar Control */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <button 
              className={`category-btn ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => { setActiveTab('requests'); setIsEditing(null); setIsAdding(false); }}
              style={{ width: '100%', justifyContent: 'flex-start', borderRadius: '4px' }}
            >
              <FileInput size={16} /> Solicitações ({requestsList.length})
            </button>
            
            <button 
              className={`category-btn ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => { setActiveTab('catalog'); }}
              style={{ width: '100%', justifyContent: 'flex-start', borderRadius: '4px' }}
            >
              <LayoutGrid size={16} /> Gerenciar Catálogo
            </button>
            
            <button 
              className={`category-btn ${activeTab === 'ml_import' ? 'active' : ''}`}
              onClick={() => { setActiveTab('ml_import'); setIsEditing(null); setIsAdding(false); }}
              style={{ width: '100%', justifyContent: 'flex-start', borderRadius: '4px' }}
            >
              <RotateCw size={16} /> Integrar Mercado Livre
            </button>
          </div>

          {/* Tab Content Box */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '24px',
            minHeight: '400px'
          }}>
            
            {/* TAB 1: REQUESTS LIST */}
            {activeTab === 'requests' && (
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  Solicitações de Peças por Clientes
                </h3>
                {requestsList.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>
                    Nenhuma solicitação de produto feita pelos usuários ainda.
                  </p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-title)', fontWeight: '700' }}>
                        <th style={{ padding: '12px' }}>Cliente</th>
                        <th style={{ padding: '12px' }}>WhatsApp</th>
                        <th style={{ padding: '12px' }}>Peça Solicitada</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requestsList.map((req, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px', fontWeight: '600' }}>{req.customerName}</td>
                          <td style={{ padding: '12px' }}>{req.contactInfo}</td>
                          <td style={{ padding: '12px', color: 'var(--primary)', fontWeight: '500' }}>{req.productName}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <a 
                              href={`https://wa.me/55${req.contactInfo.replace(/\D/g, '')}?text=Olá ${req.customerName}, vimos sua solicitação da peça "${req.productName}" no site da M Moto. Vamos fazer um orçamento?`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="card-btn"
                              style={{ display: 'inline-flex', padding: '4px 10px', fontSize: '11px', width: 'auto' }}
                            >
                              WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB 2: PRODUCT CATALOG MANAGER */}
            {activeTab === 'catalog' && !isEditing && !isAdding && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  <h3 style={{ fontSize: '16px' }}>Catálogo de Peças</h3>
                  <button onClick={handleStartAdd} className="checkout-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px', width: 'auto' }}>
                    <Plus size={14} /> Adicionar Produto
                  </button>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-title)', fontWeight: '700' }}>
                      <th style={{ padding: '10px' }}>Item</th>
                      <th style={{ padding: '10px' }}>Categoria</th>
                      <th style={{ padding: '10px' }}>Preço</th>
                      <th style={{ padding: '10px' }}>Mercado Livre</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={prod.image} alt={prod.title} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #f0f0f0' }} />
                          <span style={{ fontWeight: '500', maxWidth: '200px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={prod.title}>
                            {prod.title}
                          </span>
                        </td>
                        <td style={{ padding: '10px', textTransform: 'capitalize' }}>{prod.categoryName}</td>
                        <td style={{ padding: '10px', fontWeight: '700' }}>
                          {prod.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td style={{ padding: '10px' }}>
                          {prod.mlLinked ? (
                            <span style={{ background: '#fff159', color: '#333', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>
                              Ativo
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Não</span>
                          )}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => handleStartEdit(prod)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#1a73e8' }}
                              title="Editar item"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => onRemoveProduct(prod.id)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                              title="Excluir item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2 EDIT FORM */}
            {(isEditing || isAdding) && (
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  {isAdding ? 'Cadastrar Novo Acessório' : 'Editar Acessório'}
                </h3>
                
                <form onSubmit={handleSaveProduct}>
                  <div className="form-group">
                    <label className="form-label">Título do Produto</label>
                    <input
                      type="text"
                      className="form-input"
                      value={prodForm.title}
                      onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Categoria</label>
                      <select
                        className="form-input"
                        value={prodForm.category}
                        onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                      >
                        <option value="capacetes">Capacetes</option>
                        <option value="vestuario">Jaquetas & Luvas</option>
                        <option value="pecas">Peças & Motores</option>
                        <option value="retrovisores">Retrovisores</option>
                        <option value="acessorios">Acessórios</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preço (BRL)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        placeholder="Ex: 890.00"
                        value={prodForm.price}
                        onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Descrição do Produto</label>
                    <textarea
                      className="form-input"
                      style={{ height: '80px', resize: 'vertical' }}
                      value={prodForm.description}
                      onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL da Imagem</label>
                    <input
                      type="url"
                      className="form-input"
                      value={prodForm.image}
                      onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prodForm.isBestSeller}
                        onChange={(e) => setProdForm({ ...prodForm, isBestSeller: e.target.checked })}
                      />
                      Destacar como "Mais Vendido"
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prodForm.mlLinked}
                        onChange={(e) => setProdForm({ ...prodForm, mlLinked: e.target.checked })}
                      />
                      Exibir selo "Mercado Livre"
                    </label>
                  </div>

                  <div className="form-actions" style={{ marginTop: '24px' }}>
                    <button type="button" onClick={() => { setIsEditing(null); setIsAdding(false); }} className="btn-secondary">
                      Cancelar
                    </button>
                    <button type="submit" className="checkout-btn" style={{ width: 'auto' }}>
                      Salvar Produto
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: MERCADO LIVRE SYNC */}
            {activeTab === 'ml_import' && (
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  Sincronização com o Mercado Livre
                </h3>
                
                <div style={{ background: '#fcfcfc', border: '1px solid var(--border)', borderRadius: '6px', padding: '16px', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-title)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Como funciona a conexão?
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    Utilizando o protocolo oficial <strong>Mercado Livre API (OAuth 2.0)</strong>, a loja M Moto conecta-se à sua conta vendedora. 
                    Todos os anúncios ativos são baixados, integrando automaticamente fotos, títulos, estoque e preços ao banco Firebase do site.
                  </p>
                </div>

                {/* Simulated URL single importer */}
                <form onSubmit={handleMLUrlImport} style={{ marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-title)', marginBottom: '10px' }}>
                    Importar Anúncio Unitário
                  </h4>
                  <div className="copy-pix-area">
                    <input
                      type="url"
                      className="form-input"
                      placeholder="Cole a URL do seu anúncio do Mercado Livre (ex: https://produto.mercadolivre.com.br/...)"
                      value={mlUrl}
                      onChange={(e) => setMlUrl(e.target.value)}
                      disabled={mlSyncing}
                    />
                    <button 
                      type="submit" 
                      className="checkout-btn" 
                      style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                      disabled={mlSyncing}
                    >
                      <RotateCw size={14} className={mlSyncing ? 'animate-spin' : ''} /> 
                      {mlSyncing ? 'Sincronizando...' : 'Importar'}
                    </button>
                  </div>
                </form>

                {/* Bulk Synchronization */}
                <div>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-title)', marginBottom: '10px' }}>
                    Sincronização em Lote (Toda a Loja)
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Clique abaixo para simular o redirecionamento OAuth de login comercial do Mercado Livre e importar todos os anúncios ativos da sua conta.
                  </p>
                  
                  {mlSuccess ? (
                    <div style={{
                      background: 'rgba(0, 166, 80, 0.05)',
                      border: '1px solid var(--success)',
                      borderRadius: '6px',
                      padding: '16px',
                      color: 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px'
                    }}>
                      <CheckCircle size={20} />
                      <strong>Sincronização Completa!</strong> 4 anúncios adicionais do Mercado Livre foram importados para o banco de dados.
                    </div>
                  ) : (
                    <button
                      onClick={handleMLSync}
                      disabled={mlSyncing}
                      className="checkout-btn"
                      style={{ 
                        width: 'auto', 
                        background: '#fff159', 
                        color: '#2d3277', 
                        border: '1px solid #d0c000',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <RotateCw size={16} className={mlSyncing ? 'rotate' : ''} /> 
                      {mlSyncing ? 'Conectando ao API Mercado Livre...' : 'Sincronizar Conta Mercado Livre'}
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
