import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CartSidebar from './components/CartSidebar';
import CheckoutFlow from './components/CheckoutFlow';
import OrderSuccess from './components/OrderSuccess';
import GoogleLoginModal from './components/GoogleLoginModal';
import ProductRequestForm from './components/ProductRequestForm';
import VirtualAssistant from './components/VirtualAssistant';
import { products, categories } from './data/products';
import { Shield, AlertTriangle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('store'); // 'store', 'checkout', 'success'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderData, setOrderData] = useState(null);

  // Security and Login states
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [securityAlert, setSecurityAlert] = useState({ show: false, message: '' });

  // Security: Keyboard DevTools and Right-Click Blockers
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      setSecurityAlert({
        show: true,
        message: 'Clique Direito Bloqueado! Acesso restrito para segurança da aplicação.'
      });
    };

    const handleKeyDown = (e) => {
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
        setSecurityAlert({
          show: true,
          message: 'Atalho F12 Bloqueado! Inspecionamento do sistema desativado por motivos de segurança.'
        });
      }
      // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
        setSecurityAlert({
          show: true,
          message: 'Atalho do Desenvolvedor Bloqueado! Acesso restrito por políticas de segurança.'
        });
      }
      // Block Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        setSecurityAlert({
          show: true,
          message: 'Atalho Ctrl+U Bloqueado! Visualização do código fonte desativada.'
        });
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Timer to auto-clear security alert
  useEffect(() => {
    if (securityAlert.show) {
      const timer = setTimeout(() => {
        setSecurityAlert({ show: false, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [securityAlert.show]);

  // Security: Active input sanitization (Anti-SQL Injection & Anti-XSS)
  const sanitizeSearchInput = (value) => {
    // SQL Injection patterns: ' OR 1=1, --, UNION, SELECT, DROP
    // XSS patterns: <script, javascript:
    const sqlRegex = /('|"|--|;|UNION|SELECT|DROP|INSERT|OR\s+['"]?\d+['"]?\s*=\s*['"]?\d+|OR\s+['"]?[a-zA-Z]+['"]?\s*=\s*['"]?[a-zA-Z]+)/i;
    const xssRegex = /(<script|javascript:|onload=|onerror=)/i;

    if (sqlRegex.test(value) || xssRegex.test(value)) {
      setSecurityAlert({
        show: true,
        message: 'Alerta de Segurança: Tentativa de Injeção de Código (SQL/XSS) bloqueada com sucesso!'
      });
      return ''; // Block & clear the input
    }
    return value;
  };

  const handleSearchChange = (value) => {
    const cleanValue = sanitizeSearchInput(value);
    setSearchQuery(cleanValue);
  };

  // Secure Price Calculations (lookup directly in frozen database)
  const getSecureSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      // Lookup the official item price from the frozen registry
      const originalProduct = products.find((p) => p.id === item.id);
      const officialPrice = originalProduct ? originalProduct.price : 0;
      return acc + (officialPrice * item.quantity);
    }, 0);
  };

  const getSecureCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  // Cart actions
  const handleAddToCart = (product, quantity = 1, selectedAttr = '') => {
    let finalAttr = selectedAttr;
    if (!selectedAttr && product.attributes && product.attributes.options.length > 0) {
      finalAttr = product.attributes.options[0];
    }

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedAttr === finalAttr
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity, selectedAttr: finalAttr }];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateQty = (productId, selectedAttr, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, selectedAttr);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.selectedAttr === selectedAttr
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (productId, selectedAttr) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === productId && item.selectedAttr === selectedAttr))
    );
  };

  const handleCheckoutTransition = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleOrderComplete = (data) => {
    setOrderData(data);
    setCartItems([]); // Clear cart
    setCurrentView('success');
  };

  const handleResetToStore = () => {
    setCurrentView('store');
    setActiveCategory('all');
    setSearchQuery('');
    setOrderData(null);
  };

  // Filter products by category and search
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      
      {/* Security Alert Banner Overlay */}
      {securityAlert.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          background: '#d93025',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '4px',
          boxShadow: '0 4px 15px rgba(217,48,37,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'var(--font-title)',
          fontWeight: '600',
          fontSize: '13px',
          animation: 'pop 0.3s ease-out'
        }}>
          <AlertTriangle size={18} />
          <span>{securityAlert.message}</span>
          <button 
            onClick={() => setSecurityAlert({ show: false, message: '' })}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: '700',
              marginLeft: '10px',
              fontSize: '13px'
            }}
          >
            Disparar
          </button>
        </div>
      )}

      <Header
        cartCount={getSecureCartCount()}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        onResetView={handleResetToStore}
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={() => setUser(null)}
      />

      <main style={{ flexGrow: 1 }}>
        {currentView === 'store' && (
          <>
            <HeroSection onExploreClick={() => {
              const element = document.querySelector('.products-wrapper');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }} />
            
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            <ProductGrid
              products={filteredProducts}
              onProductClick={setSelectedProduct}
              onAddToCart={handleAddToCart}
            />
          </>
        )}

        {currentView === 'checkout' && (
          <CheckoutFlow
            cartItems={cartItems}
            onBackToCart={() => setCurrentView('store')}
            onOrderComplete={handleOrderComplete}
            user={user}
          />
        )}

        {currentView === 'success' && (
          <OrderSuccess
            orderData={orderData}
            onReset={handleResetToStore}
          />
        )}

        {/* Request form above footer, shown on store catalog page */}
        {currentView === 'store' && (
          <ProductRequestForm />
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div className="footer-logo">
              M <span>Moto</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--success)', fontWeight: '600' }}>
              <Shield size={12} /> Proteção Anti-Tampering & SSL
            </div>
          </div>
          <p style={{ marginBottom: '10px' }}>
            M Moto Peças e Acessórios Ltda. © 2026 - Todos os direitos reservados.
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            CNPJ: 00.000.000/0001-00 | Av. das Duas Rodas, 1000 - São Paulo, SP
          </p>
        </div>
      </footer>

      {/* Cart sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckoutTransition}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Google Login popup Modal */}
      <GoogleLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={setUser}
      />

      {/* Floating Virtual Assistant chatbot */}
      <VirtualAssistant />
    </div>
  );
}
