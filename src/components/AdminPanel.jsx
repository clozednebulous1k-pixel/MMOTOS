import React, { useState, useEffect } from 'react';
import { Shield, LayoutGrid, FileInput, RotateCw, Plus, Edit, Trash2, ArrowLeft, LogOut, CheckCircle, UserPlus, User } from 'lucide-react';

export default function AdminPanel({ 
  productsList, 
  requestsList, 
  onAddProduct, 
  onEditProduct, 
  onRemoveProduct,
  onImportMLMock,
  onClose,
  user,
  onLogout,
  onLoginFromAdmin
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(user && user.role === 'admin');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Simulated Database of Admins
  const [admins, setAdmins] = useState([
    { name: 'Administrador M Moto', email: 'admin@mmoto.com', password: 'admin123' }
  ]);

  // Form inputs for Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Sincronizador Keys (pre-configured with user's newly generated Mercado Livre credentials)
  const mlClientId = "4425858350815502";
  const mlClientSecret = "HNc06OHhDGNWbQ2S79O7D3sdK0JqwHUZ";

  useEffect(() => {
    setIsAuthenticated(user && user.role === 'admin');
  }, [user]);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('requests');

  // Product Form states
  const [isEditing, setIsEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [prodForm, setProdForm] = useState({ title: '', category: 'acessorios', price: '', description: '', image: '', rating: 4.8, reviews: 10, isBestSeller: false, mlLinked: true });

  // Mercado Livre link importer states
  const [mlUrl, setMlUrl] = useState('');
  const [mlSuccess, setMlSuccess] = useState(false);
  const [mlSyncing, setMlSyncing] = useState(false);

  const sanitizeInput = (text) => {
    return text.replace(/['";\-]/g, '').trim();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(password);

    const matchedAdmin = admins.find(admin => admin.email === cleanEmail && admin.password === cleanPassword);
    
    if (matchedAdmin) {
      onLoginFromAdmin({
        name: matchedAdmin.name,
        email: matchedAdmin.email,
        role: 'admin',
        avatarUrl: ''
      });
      setIsAuthenticated(true);
      setAuthError('');
      setEmail('');
      setPassword('');
    } else {
      setAuthError('E-mail ou senha incorretos! (Padrão: admin@mmoto.com / admin123)');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const cleanName = sanitizeInput(regName);
    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(password);
    const cleanConfirm = sanitizeInput(regConfirmPassword);

    if (!cleanName || !cleanEmail || !cleanPassword) {
      setAuthError('Por favor, preencha todos os campos.');
      return;
    }

    if (cleanPassword.length < 6) {
      setAuthError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setAuthError('As senhas não coincidem.');
      return;
    }

    const exists = admins.some(admin => admin.email === cleanEmail);
    if (exists) {
      setAuthError('Este e-mail já está cadastrado.');
      return;
    }

    const newAdmin = { name: cleanName, email: cleanEmail, password: cleanPassword };
    setAdmins(prev => [...prev, newAdmin]);
    
    onLoginFromAdmin({
      name: cleanName,
      email: cleanEmail,
      role: 'admin',
      avatarUrl: ''
    });
    
    setIsAuthenticated(true);
    setAuthError('');
    setRegName('');
    setEmail('');
    setPassword('');
    setRegConfirmPassword('');
    setIsRegisterMode(false);
    alert('Conta de administrador criada com sucesso!');
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

  // REAL LIVE SYNC: Sincronização em Lote descobrindo o Seller ID
  const handleMLSync = async () => {
    const sampleUrl = prompt('Por favor, cole o link (URL) de QUALQUER um dos seus anúncios ativos no Mercado Livre. Nós localizaremos seu ID de vendedor e baixaremos todo o seu catálogo automaticamente:');
    if (!sampleUrl) return;

    // Regex to capture MLB-123456789 or MLB123456789
    const match = sampleUrl.match(/(MLB-?\d+)/i);
    if (!match) {
      alert('Link inválido. O link do anúncio do Mercado Livre deve conter o código "MLB" seguido de números (ex: https://produto.mercadolivre.com.br/MLB-356877258-...).');
      return;
    }

    const itemId = match[1].replace('-', '');
    setMlSyncing(true);

    try {
      // 1. Fetch item to get the numeric seller_id
      const res = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
      if (!res.ok) throw new Error('Não foi possível carregar os dados desse anúncio.');
      const itemData = await res.json();
      const sellerId = itemData.seller_id;

      if (!sellerId) {
        throw new Error('Não encontramos o ID do vendedor associado a este anúncio.');
      }

      // 2. Query search endpoint to get all active listings of this seller
      const searchRes = await fetch(`https://api.mercadolibre.com/sites/MLB/search?seller_id=${sellerId}`);
      if (!searchRes.ok) throw new Error('Erro ao listar anúncios da sua conta.');
      const searchData = await searchRes.json();

      const items = searchData.results || [];
      if (items.length === 0) {
        alert('Nenhum anúncio ativo foi encontrado para esta conta de vendedor.');
        return;
      }

      // 3. Map Mercado Livre items to M Moto catalog items
      const formattedItems = items.map(item => ({
        id: item.id,
        title: item.title,
        category: 'pecas',
        categoryName: 'Mercado Livre',
        price: item.price,
        rating: 4.8,
        reviews: item.sold_quantity || 12,
        description: `Produto original importado diretamente do anúncio do Mercado Livre. Envio expresso pelo Mercado Envios, estoque integrado de forma segura com a M Moto. Código do Anúncio: ${item.id}.`,
        // Replace ML thumbnail format (-I.jpg) with high resolution format (-O.jpg)
        image: item.thumbnail ? item.thumbnail.replace('-I.jpg', '-O.jpg') : 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
        isBestSeller: item.tags?.includes('best_seller_candidate') || false,
        mlLinked: true
      }));

      onImportMLMock(formattedItems); // Update global catalog state
      setMlSuccess(true);
      setTimeout(() => setMlSuccess(false), 5000);
      alert(`Sincronização Completa! ${formattedItems.length} produtos foram importados e cadastrados com sucesso na sua loja.`);
    } catch (err) {
      console.error(err);
      alert('Falha na Sincronização: ' + err.message);
    } finally {
      setMlSyncing(false);
    }
  };

  // REAL LIVE IMPORT: Importar um único anúncio direto da API
  const handleMLUrlImport = async (e) => {
    e.preventDefault();
    if (!mlUrl.trim()) return;

    const match = mlUrl.match(/(MLB-?\d+)/i);
    if (!match) {
      alert('Não foi possível identificar o código do anúncio. Certifique-se de colar uma URL contendo "MLB".');
      return;
    }

    const itemId = match[1].replace('-', '');
    setMlSyncing(true);

    try {
      // 1. Fetch item details
      const res = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
      if (!res.ok) throw new Error('Falha ao baixar o anúncio do Mercado Livre.');
      const data = await res.json();

      // 2. Fetch description (async child request)
      let description = `Acessório premium importado diretamente do anúncio original do Mercado Livre (${data.id}).`;
      try {
        const descRes = await fetch(`https://api.mercadolibre.com/items/${itemId}/description`);
        if (descRes.ok) {
          const descData = await descRes.json();
          description = descData.plain_text || descData.text || description;
        }
      } catch (e) {
        console.log('Erro ao carregar descrição, usando padrão.');
      }

      // Add single product
      onAddProduct({
        id: data.id,
        title: data.title,
        category: 'pecas',
        categoryName: 'Mercado Livre',
        price: data.price,
        rating: 4.8,
        reviews: data.initial_quantity || 15,
        description: description.substring(0, 400) + (description.length > 400 ? '...' : ''),
        image: data.pictures && data.pictures.length > 0 ? data.pictures[0].url : data.thumbnail,
        isBestSeller: false,
        mlLinked: true
      });

      setMlUrl('');
      alert('Anúncio do Mercado Livre importado e integrado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro na importação: ' + err.message);
    } finally {
      setMlSyncing(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    onLogout();
  };

  // Auth View
  if (!isAuthenticated) {
    return (
      <div className="modal-overlay">
        <div className="checkout-card" style={{ maxWidth: '400px', width: '100%', margin: '0 auto', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '8px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(211,47,47,0.08)', color: 'var(--primary)', padding: '12px', borderRadius: '50%', marginBottom: '8px' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '20px' }}>Painel Administrativo</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>M Moto Peças e Acessórios</p>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
            <button
              onClick={() => { setIsRegisterMode(false); setAuthError(''); }}
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
              onClick={() => { setIsRegisterMode(true); setAuthError(''); }}
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

          {!isRegisterMode ? (
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

              {authError && (
                <p style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>
                  {authError}
                </p>
              )}

              <button type="submit" className="checkout-btn" style={{ width: '100%' }}>
                Entrar no Painel
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Seu nome"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail de Acesso</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="email@mmoto.com"
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
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {authError && (
                <p style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>
                  {authError}
                </p>
              )}

              <button type="submit" className="checkout-btn" style={{ width: '100%' }}>
                Registrar Administrador
              </button>
            </form>
          )}

          <button 
            onClick={onClose} 
            className="btn-secondary" 
            style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} /> Voltar para a Loja
          </button>
        </div>
      </div>
    );
  }

  // Dashboard View
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
                Conectado como: <strong>{user?.name || 'Admin'}</strong> ({user?.email})
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}>
              <ArrowLeft size={15} /> Ver Site
            </button>
            <button onClick={handleLogout} className="checkout-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}>
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
                    Chaves de API Configuradas
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    <div>ID do Aplicativo: <strong style={{ color: 'var(--text-title)' }}>{mlClientId}</strong></div>
                    <div>Chave Secreta: <strong style={{ color: 'var(--text-title)' }}>{mlClientSecret.substring(0, 6)}••••••••••••••••••••••••</strong></div>
                    <div style={{ marginTop: '6px', color: 'var(--success)', fontWeight: '600' }}>Conexão Segura Integrada</div>
                  </div>
                </div>

                {/* Simulated URL single importer */}
                <form onSubmit={handleMLUrlImport} style={{ marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-title)', marginBottom: '10px' }}>
                    Importar Anúncio Unitário por URL
                  </h4>
                  <div className="copy-pix-area">
                    <input
                      type="url"
                      className="form-input"
                      placeholder="Cole a URL do seu anúncio do Mercado Livre (ex: https://produto.mercadolivre.com.br/MLB-123...)"
                      value={mlUrl}
                      onChange={(e) => setMlUrl(e.target.value)}
                      disabled={mlSyncing}
                      required
                    />
                    <button 
                      type="submit" 
                      className="checkout-btn" 
                      style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                      disabled={mlSyncing}
                    >
                      <RotateCw size={14} className={mlSyncing ? 'animate-spin' : ''} /> 
                      {mlSyncing ? 'Buscando...' : 'Importar'}
                    </button>
                  </div>
                </form>

                {/* Bulk Sincronizador M Moto */}
                <div>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-title)', marginBottom: '10px' }}>
                    Auto-Sincronizador M Moto (Sincronizar Toda a Conta)
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
                    Clique abaixo, insira a URL de qualquer um dos seus anúncios ativos do Mercado Livre, e nossa ferramenta fará a varredura completa da sua loja para importar todos os anúncios em tempo real.
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
                      <div>
                        <strong>Sincronização Ativa e Concluída!</strong> Seus anúncios do Mercado Livre foram listados e sincronizados com a vitrine M Moto.
                      </div>
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
                      {mlSyncing ? 'Consultando a API do Mercado Livre...' : 'Executar Sincronizador de Anúncios'}
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
