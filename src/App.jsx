import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CartSidebar from './components/CartSidebar';
import CheckoutFlow from './components/CheckoutFlow';
import OrderSuccess from './components/OrderSuccess';
import LoginModal from './components/LoginModal';
import ProductRequestForm from './components/ProductRequestForm';
import VirtualAssistant from './components/VirtualAssistant';
import AdminPanel from './components/AdminPanel';
import { products, categories } from './data/products';
import { Shield, AlertTriangle } from 'lucide-react';

// Firebase Import
import { db, isFirebaseActive } from './firebase';
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function App() {
  const [currentView, setCurrentView] = useState('store'); // 'store', 'checkout', 'success', 'admin'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderData, setOrderData] = useState(null);

  // Re-active Catalog Database (initialized from local file, overwritten by Firestore if active)
  const [catalogProducts, setCatalogProducts] = useState([...products]);
  
  // Re-active Requests Database (for Admin panel tracking)
  const [requests, setRequests] = useState([
    {
      customerName: 'Lucas Oliveira',
      contactInfo: '(11) 98765-4321',
      productName: 'Escapamento Vance & Hines Harley Iron 883'
    },
    {
      customerName: 'Juliana Costa',
      contactInfo: '(19) 98211-5544',
      productName: 'Guidão Ape Hanger 14" Preto Fosco'
    }
  ]);

  // Registered Admin list (simulated database list)
  const [registeredAdmins, setRegisteredAdmins] = useState([
    { name: 'Administrador M Moto', email: 'admin@mmoto.com', password: 'admin123' }
  ]);

  // Security and Login states
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [securityAlert, setSecurityAlert] = useState({ show: false, message: '' });

  // 1. Sync Catalog and Requests with Firestore if Firebase is active
  useEffect(() => {
    if (!isFirebaseActive) return;

    const loadFirestoreData = async () => {
      try {
        // A. Load Catalog Products
        const prodSnap = await getDocs(collection(db, 'products'));
        if (prodSnap.empty) {
          // Initialize Firestore with default items if empty
          console.log("Inicializando Firestore com produtos padrão...");
          for (const item of products) {
            await setDoc(doc(db, 'products', item.id.toString()), item);
          }
          setCatalogProducts([...products]);
        } else {
          const loadedProducts = [];
          prodSnap.forEach((doc) => {
            loadedProducts.push({ ...doc.data() });
          });
          setCatalogProducts(loadedProducts);
        }

        // B. Load Customer Requests
        const reqSnap = await getDocs(collection(db, 'requests'));
        if (!reqSnap.empty) {
          const loadedRequests = [];
          reqSnap.forEach((doc) => {
            loadedRequests.push({ ...doc.data() });
          });
          setRequests(loadedRequests);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do Firestore:", err);
      }
    };

    loadFirestoreData();
  }, []);

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
      if (e.key === 'F12') {
        e.preventDefault();
        setSecurityAlert({
          show: true,
          message: 'Atalho F12 Bloqueado! Inspecionamento do sistema desativado por motivos de segurança.'
        });
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
        setSecurityAlert({
          show: true,
          message: 'Atalho do Desenvolvedor Bloqueado! Acesso restrito por políticas de segurança.'
        });
      }
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
    const sqlRegex = /('|"|--|;|UNION|SELECT|DROP|INSERT|OR\s+['"]?\d+['"]?\s*=\s*['"]?\d+|OR\s+['"]?[a-zA-Z]+['"]?\s*=\s*['"]?[a-zA-Z]+)/i;
    const xssRegex = /(<script|javascript:|onload=|onerror=)/i;

    if (sqlRegex.test(value) || xssRegex.test(value)) {
      setSecurityAlert({
        show: true,
        message: 'Alerta de Segurança: Tentativa de Injeção de Código (SQL/XSS) bloqueada com sucesso!'
      });
      return ''; 
    }
    return value;
  };

  const handleSearchChange = (value) => {
    const cleanValue = sanitizeSearchInput(value);
    setSearchQuery(cleanValue);
  };

  // Secure Price Calculations (lookup directly in reactive database)
  const getSecureSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const originalProduct = catalogProducts.find((p) => p.id === item.id);
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
    setCartItems([]); 
    setCurrentView('success');
  };

  const handleResetToStore = () => {
    setCurrentView('store');
    setActiveCategory('all');
    setSearchQuery('');
    setOrderData(null);
  };

  const handleAddProduct = async (newProd) => {
    // 1. Optimistic UI update: update state immediately
    setCatalogProducts(prev => [newProd, ...prev]);

    // 2. Perform database mutation in background
    if (isFirebaseActive) {
      try {
        await setDoc(doc(db, 'products', newProd.id.toString()), newProd);
      } catch (e) {
        console.error("Erro ao salvar produto no Firestore:", e);
      }
    }
  };

  const handleEditProduct = async (updatedProd) => {
    // Optimistic UI update
    setCatalogProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    setCartItems(prev => prev.map(item => item.id === updatedProd.id ? { ...item, price: updatedProd.price } : item));
    
    if (isFirebaseActive) {
      try {
        await updateDoc(doc(db, 'products', updatedProd.id.toString()), updatedProd);
      } catch (e) {
        console.error("Erro ao atualizar produto no Firestore:", e);
      }
    }
  };

  const handleRemoveProduct = async (id) => {
    if (confirm('Tem certeza que deseja excluir este produto do catálogo?')) {
      // Optimistic UI update
      setCatalogProducts(prev => prev.filter(p => p.id !== id));
      setCartItems(prev => prev.filter(item => item.id !== id));
      
      if (isFirebaseActive) {
        try {
          await deleteDoc(doc(db, 'products', id.toString()));
        } catch (e) {
          console.error("Erro ao excluir produto no Firestore:", e);
        }
      }
    }
  };

  const handleAddRequest = async (newRequest) => {
    if (isFirebaseActive) {
      try {
        await addDoc(collection(db, 'requests'), newRequest);
      } catch (e) {
        console.error("Erro ao salvar solicitação no Firestore:", e);
      }
    }
    setRequests(prev => [newRequest, ...prev]);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('store');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('store');
  };

  // Sincronizar catálogo Mercado Livre
  const handleImportMLMock = async (realItems) => {
    if (realItems && realItems.length > 0) {
      // Optimistic UI update
      setCatalogProducts(prev => {
        const filteredPrev = prev.filter(p => !realItems.some(ri => ri.id === p.id));
        return [...realItems, ...filteredPrev];
      });

      if (isFirebaseActive) {
        try {
          for (const item of realItems) {
            await setDoc(doc(db, 'products', item.id.toString()), item);
          }
        } catch (e) {
          console.error("Erro ao salvar lote de anúncios no Firestore:", e);
        }
      }
      return;
    }

    // Mock fallback if no real array is passed
    const mlItems = [
      {
        id: 101,
        title: 'Guidão Esportivo Oxxy Fatbar Alumínio',
        category: 'pecas',
        categoryName: 'Peças & Motores',
        price: 389.00,
        rating: 4.8,
        reviews: 312,
        description: 'Guidão de alta performance em alumínio aeronáutico anodizado. Máxima resistência contra torção e excelente ergonomia.',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
        isBestSeller: true,
        mlLinked: true
      },
      {
        id: 102,
        title: 'Kit Protetor de Motor e Carenagem Coyote Speed',
        category: 'pecas',
        categoryName: 'Peças & Motores',
        price: 679.00,
        rating: 4.7,
        reviews: 95,
        description: 'Protetor robusto feito em aço carbono de alta resistência. Protege as carenagens laterais e o motor em quedas leves.',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
        isBestSeller: false,
        mlLinked: true
      }
    ];

    if (isFirebaseActive) {
      try {
        for (const item of mlItems) {
          await setDoc(doc(db, 'products', item.id.toString()), item);
        }
      } catch (e) {
        console.error("Erro ao salvar lote fictício no Firestore:", e);
      }
    }

    setCatalogProducts(prev => {
      const filteredPrev = prev.filter(p => p.id < 100);
      return [...mlItems, ...filteredPrev];
    });
  };

  const filteredProducts = catalogProducts.filter((product) => {
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
            Fechar
          </button>
        </div>
      )}

      {currentView !== 'admin' && (
        <Header
          cartCount={getSecureCartCount()}
          onCartClick={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          onResetView={handleResetToStore}
          user={user}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onLogoutClick={handleLogout}
          onAdminPanelClick={() => setCurrentView('admin')}
        />
      )}

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

        {currentView === 'admin' && (
          <AdminPanel
            productsList={catalogProducts}
            requestsList={requests}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onRemoveProduct={handleRemoveProduct}
            onImportMLMock={handleImportMLMock}
            onClose={handleResetToStore}
            user={user}
            onLogout={handleLogout}
            onLoginFromAdmin={handleLoginSuccess}
          />
        )}

        {/* Request form above footer, shown on store catalog page */}
        {currentView === 'store' && (
          <ProductRequestForm onAddRequest={handleAddRequest} />
        )}
      </main>

      {currentView !== 'admin' && (
        <footer className="footer">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div className="footer-logo">
                M <span>Moto</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--success)', fontWeight: '600' }}>
                <Shield size={12} /> {isFirebaseActive ? 'Banco de Dados Firestore Conectado' : 'Proteção Anti-Tampering & SSL'}
              </div>
            </div>
            <p style={{ marginBottom: '8px' }}>
              M Moto Peças e Acessórios Ltda. © 2026 - Todos os direitos reservados.
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              CNPJ: 00.000.000/0001-00 | Av. das Duas Rodas, 1000 - São Paulo, SP
            </p>
          </div>
        </footer>
      )}

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

      {/* Login / Register popup Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        registeredAdmins={registeredAdmins}
      />

      {/* Floating WhatsApp contact widget */}
      {currentView !== 'admin' && (
        <VirtualAssistant />
      )}
    </div>
  );
}
