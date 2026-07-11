import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, QrCode, CreditCard, FileText, Check, Shield } from 'lucide-react';
import { products } from '../data/products';

export default function CheckoutFlow({ cartItems, onBackToCart, onOrderComplete, user }) {
  const [step, setStep] = useState(1); // 1: Info, 2: Address, 3: Payment
  
  // Step 1: Info Form
  const [infoForm, setInfoForm] = useState({ name: '', email: '', phone: '' });
  // Step 2: Address Form
  const [addressForm, setAddressForm] = useState({ cep: '', street: '', number: '', neighborhood: '', city: '', state: 'SP' });
  // Step 3: Payment Type & Form Details
  const [paymentMethod, setPaymentMethod] = useState('pix'); // pix, credit_card, boleto
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [cardFocusedField, setCardFocusedField] = useState('');
  
  // Simulations
  const [pixTimeLeft, setPixTimeLeft] = useState(600);
  const [copiedText, setCopiedText] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-fill Google Account profile if logged in
  useEffect(() => {
    if (user) {
      setInfoForm((prev) => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email
      }));
    }
  }, [user]);

  useEffect(() => {
    if (step === 3 && paymentMethod === 'pix') {
      const timer = setInterval(() => {
        setPixTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, paymentMethod]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Secure Price lookup - calculate directly from frozen products
  const getSecureSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const originalProduct = products.find((p) => p.id === item.id);
      const price = originalProduct ? originalProduct.price : 0;
      return acc + (price * item.quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Security: Cleanse strings against injection attempts
  const sanitize = (text) => {
    if (!text) return '';
    // Strip common SQL symbols and tags
    return text
      .replace(/['";\-]/g, '')
      .replace(/(SELECT|UNION|DROP|INSERT|OR\s+1\s*=\s*1|<script)/gi, '')
      .trim();
  };

  // Basic Form Validations with sanitization
  const validateStep1 = () => {
    const errs = {};
    const sanitizedName = sanitize(infoForm.name);
    const sanitizedEmail = sanitize(infoForm.email);
    const sanitizedPhone = sanitize(infoForm.phone);

    if (!sanitizedName) errs.name = 'Nome é obrigatório';
    if (!sanitizedEmail || !sanitizedEmail.includes('@')) errs.email = 'Insira um e-mail válido';
    if (!sanitizedPhone || sanitizedPhone.length < 10) errs.phone = 'WhatsApp inválido';

    setInfoForm({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    const sanitizedCep = sanitize(addressForm.cep);
    const sanitizedStreet = sanitize(addressForm.street);
    const sanitizedNumber = sanitize(addressForm.number);
    const sanitizedNeighborhood = sanitize(addressForm.neighborhood);
    const sanitizedCity = sanitize(addressForm.city);

    if (!sanitizedCep) errs.cep = 'CEP obrigatório';
    if (!sanitizedStreet) errs.street = 'Rua obrigatória';
    if (!sanitizedNumber) errs.number = 'Número obrigatório';
    if (!sanitizedNeighborhood) errs.neighborhood = 'Bairro obrigatório';
    if (!sanitizedCity) errs.city = 'Cidade obrigatória';

    setAddressForm((prev) => ({
      ...prev,
      cep: sanitizedCep,
      street: sanitizedStreet,
      number: sanitizedNumber,
      neighborhood: sanitizedNeighborhood,
      city: sanitizedCity
    }));

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    if (paymentMethod === 'credit_card') {
      const errs = {};
      const sanitizedNum = sanitize(cardForm.number);
      const sanitizedName = sanitize(cardForm.name);
      const sanitizedExp = sanitize(cardForm.expiry);
      const sanitizedCvv = sanitize(cardForm.cvv);

      if (!sanitizedNum || sanitizedNum.replace(/\s/g, '').length < 16) errs.cardNumber = 'Cartão inválido';
      if (!sanitizedName) errs.cardName = 'Nome do titular obrigatório';
      if (!sanitizedExp || !sanitizedExp.includes('/')) errs.cardExpiry = 'Validade inválida (MM/AA)';
      if (!sanitizedCvv || sanitizedCvv.length < 3) errs.cardCvv = 'CVV inválido';

      setCardForm({
        number: sanitizedNum,
        name: sanitizedName,
        expiry: sanitizedExp,
        cvv: sanitizedCvv
      });

      setErrors(errs);
      return Object.keys(errs).length === 0;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setErrors({});
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      setErrors({});
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    } else {
      onBackToCart();
    }
  };

  const handleFinalize = () => {
    if (validateStep3()) {
      onOrderComplete({
        customerName: infoForm.name,
        paymentMethod: paymentMethod,
        total: getSecureSubtotal(),
        address: `${addressForm.street}, ${addressForm.number} - ${addressForm.city}/${addressForm.state}`
      });
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const matches = value.match(/.{1,4}/g);
    const formatted = matches ? matches.join(' ') : '';
    setCardForm({ ...cardForm, number: formatted });
  };

  const handleCardExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) {
      setCardForm({ ...cardForm, expiry: `${value.substring(0, 2)}/${value.substring(2, 4)}` });
    } else {
      setCardForm({ ...cardForm, expiry: value });
    }
  };

  return (
    <section className="checkout-view-container container">
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={handlePrev} 
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <span style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
          <Shield size={12} /> Checkout Criptografado & Protegido
        </span>
      </div>

      <div className="checkout-grid">
        <div className="checkout-card">
          <div className="checkout-steps">
            <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-circle">{step > 1 ? <CheckCircle2 size={16} /> : '1'}</div>
              <span className="step-label">Identificação</span>
            </div>
            <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-circle">{step > 2 ? <CheckCircle2 size={16} /> : '2'}</div>
              <span className="step-label">Entrega</span>
            </div>
            <div className={`step-indicator ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              <div className="step-circle">{step > 3 ? <CheckCircle2 size={16} /> : '3'}</div>
              <span className="step-label">Pagamento</span>
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px' }}>Dados Pessoais</h3>
                {user && (
                  <span style={{ fontSize: '11px', background: 'rgba(0,166,80,0.08)', color: 'var(--success)', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}>
                    Sincronizado com o Google
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nome completo para nota fiscal"
                  value={infoForm.name}
                  onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                />
                {errors.name && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="exemplo@gmail.com"
                  value={infoForm.email}
                  onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                  disabled={user !== null} // Lock email if logged in with Google
                />
                {errors.email && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp / Telefone</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="(11) 99999-9999"
                  value={infoForm.phone}
                  onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                />
                {errors.phone && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.phone}</span>}
              </div>

              <div className="form-actions">
                <div></div>
                <button className="checkout-btn" style={{ width: 'auto' }} onClick={handleNext}>
                  Avançar <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Endereço de Entrega</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">CEP</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="00000-000"
                    value={addressForm.cep}
                    onChange={(e) => setAddressForm({ ...addressForm, cep: e.target.value })}
                  />
                  {errors.cep && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.cep}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Bairro</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Bairro"
                    value={addressForm.neighborhood}
                    onChange={(e) => setAddressForm({ ...addressForm, neighborhood: e.target.value })}
                  />
                  {errors.neighborhood && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.neighborhood}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rua / Avenida</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nome do logradouro"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                />
                {errors.street && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.street}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Número</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Número"
                    value={addressForm.number}
                    onChange={(e) => setAddressForm({ ...addressForm, number: e.target.value })}
                  />
                  {errors.number && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.number}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Cidade</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Cidade"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  />
                  {errors.city && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.city}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-input"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                >
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PR">Paraná</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="RS">Rio Grande do Sul</option>
                </select>
              </div>

              <div className="form-actions">
                <button className="btn-secondary" onClick={handlePrev}>Voltar</button>
                <button className="checkout-btn" style={{ width: 'auto' }} onClick={handleNext}>
                  Avançar para Pagamento <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Método de Pagamento</h3>
              
              <div className="payment-grid">
                <div 
                  className={`payment-method-card ${paymentMethod === 'pix' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('pix')}
                >
                  <QrCode size={20} color={paymentMethod === 'pix' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span className="payment-method-title">Pix</span>
                </div>

                <div 
                  className={`payment-method-card ${paymentMethod === 'credit_card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('credit_card')}
                >
                  <CreditCard size={20} color={paymentMethod === 'credit_card' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span className="payment-method-title">Cartão</span>
                </div>

                <div 
                  className={`payment-method-card ${paymentMethod === 'boleto' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('boleto')}
                >
                  <FileText size={20} color={paymentMethod === 'boleto' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span className="payment-method-title">Boleto</span>
                </div>
              </div>

              {/* PIX */}
              {paymentMethod === 'pix' && (
                <div className="pix-code-container">
                  <div className="qr-code-mock">
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <rect x="0" y="0" width="100" height="100" fill="#fff"/>
                      <rect x="5" y="5" width="25" height="25" fill="#000"/>
                      <rect x="10" y="10" width="15" height="15" fill="#fff"/>
                      <rect x="70" y="5" width="25" height="25" fill="#000"/>
                      <rect x="75" y="10" width="15" height="15" fill="#fff"/>
                      <rect x="5" y="70" width="25" height="25" fill="#000"/>
                      <rect x="10" y="75" width="15" height="15" fill="#fff"/>
                      <rect x="40" y="40" width="20" height="20" fill="#d32f2f"/>
                      <rect x="35" y="15" width="10" height="10" fill="#000"/>
                      <rect x="55" y="15" width="10" height="20" fill="#000"/>
                      <rect x="15" y="45" width="15" height="10" fill="#000"/>
                      <rect x="45" y="65" width="20" height="10" fill="#000"/>
                      <rect x="75" y="45" width="15" height="20" fill="#000"/>
                    </svg>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>Escaneie o QR Code no app do banco</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Expira em <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{formatTime(pixTimeLeft)}</span>
                    </p>
                  </div>
                  <div className="copy-pix-area">
                    <div className="copy-input">
                      00020101021226870014br.gov.bcb.pix2565pix.m-moto-pecas-acessorios.com.br/qr/e60a969b-e5fa
                    </div>
                    <button 
                      className="copy-btn"
                      onClick={() => handleCopyText('00020101021226870014br.gov.bcb.pix2565pix.m-moto-pecas-acessorios.com.br/qr/e60a969b-e5fa')}
                    >
                      {copiedText ? <Check size={14} /> : 'Copiar'}
                    </button>
                  </div>
                </div>
              )}

              {/* CREDIT CARD */}
              {paymentMethod === 'credit_card' && (
                <div>
                  <div className="card-preview-container">
                    <div className={`card-preview ${cardFocusedField === 'cvv' ? 'flipped' : ''}`}>
                      <div className="card-front">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div className="card-chip"></div>
                          <span className="card-logo">M Moto</span>
                        </div>
                        <div className="card-preview-number">
                          {cardForm.number || '•••• •••• •••• ••••'}
                        </div>
                        <div className="card-preview-row">
                          <div>
                            <span className="card-preview-label">Titular</span>
                            <div className="card-preview-val">{cardForm.name.toUpperCase() || 'NOME DO TITULAR'}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className="card-preview-label">Validade</span>
                            <div className="card-preview-val">{cardForm.expiry || 'MM/AA'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="card-back">
                        <div className="card-stripe"></div>
                        <div className="card-signature-area">
                          <span className="card-cvv-text">{cardForm.cvv || '•••'}</span>
                        </div>
                        <span style={{ fontSize: '8px', color: '#bbbbbb', marginLeft: '16px', marginBottom: '12px' }}>
                          M Moto Peças e Acessórios Ltda.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Número do Cartão</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="0000 0000 0000 0000"
                      value={cardForm.number}
                      onChange={handleCardNumberChange}
                      onFocus={() => setCardFocusedField('number')}
                    />
                    {errors.cardNumber && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nome Impresso no Cartão</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="NOME DO TITULAR"
                      value={cardForm.name}
                      onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                      onFocus={() => setCardFocusedField('name')}
                    />
                    {errors.cardName && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.cardName}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Validade</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="MM/AA"
                        value={cardForm.expiry}
                        onChange={handleCardExpiryChange}
                        onFocus={() => setCardFocusedField('expiry')}
                      />
                      {errors.cardExpiry && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.cardExpiry}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="123"
                        maxLength="4"
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '') })}
                        onFocus={() => setCardFocusedField('cvv')}
                        onBlur={() => setCardFocusedField('')}
                      />
                      {errors.cardCvv && <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.cardCvv}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* BOLETO */}
              {paymentMethod === 'boleto' && (
                <div className="pix-code-container">
                  <div style={{ textAlign: 'center', margin: '10px 0' }}>
                    <FileText size={40} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>Boleto Bancário Digital</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '300px' }}>
                      Compensação automática em até 2 dias úteis.
                    </p>
                  </div>
                  <div className="copy-pix-area">
                    <div className="copy-input">
                      34191.79001 01043.513184 91020.150008 7 90840000349000
                    </div>
                    <button 
                      className="copy-btn"
                      onClick={() => handleCopyText('34191.79001 01043.513184 91020.150008 7 90840000349000')}
                    >
                      {copiedText ? <Check size={14} /> : 'Copiar'}
                    </button>
                  </div>
                </div>
              )}

              <div className="form-actions" style={{ marginTop: '30px' }}>
                <button className="btn-secondary" onClick={handlePrev}>Voltar</button>
                <button className="checkout-btn" style={{ width: 'auto' }} onClick={handleFinalize}>
                  Confirmar Compra
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right order preview */}
        <div className="order-summary-box">
          <h3 className="summary-title">Resumo do Pedido</h3>
          
          <div className="summary-item-list">
            {cartItems.map((item) => {
              // Secure calculation lookup
              const originalProduct = products.find((p) => p.id === item.id);
              const price = originalProduct ? originalProduct.price : 0;
              return (
                <div className="summary-item" key={`${item.id}-${item.selectedAttr}`}>
                  <div className="summary-item-img">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div className="summary-item-name">{item.title}</div>
                    <div className="summary-item-qty">Qtd: {item.quantity} {item.selectedAttr ? `| ${item.selectedAttr}` : ''}</div>
                  </div>
                  <div className="summary-item-price">
                    {formatPrice(price * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Frete</span>
              <span style={{ color: 'var(--success)', fontWeight: '600' }}>Grátis</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', color: 'var(--text-title)', paddingTop: '10px' }}>
              <span>Total</span>
              <span>{formatPrice(getSecureSubtotal())}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
