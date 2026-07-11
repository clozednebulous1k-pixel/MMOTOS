import React, { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onProductClick, onAddToCart }) {
  const [sortBy, setSortBy] = useState('relevance');

  const getSortedProducts = () => {
    const items = [...products];
    if (sortBy === 'price-asc') {
      return items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      return items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      return items.sort((a, b) => b.rating - a.rating);
    }
    return items; // relevance (default as in original list)
  };

  const sortedProducts = getSortedProducts();

  return (
    <section className="products-wrapper">
      <div className="container">
        <div className="section-header">
          <div className="section-title-container">
            <div className="section-stripe"></div>
            <h2 className="section-title">Nossos Acessórios</h2>
          </div>
          
          <div>
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Ordenar produtos"
            >
              <option value="relevance">Destaques</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="rating">Melhor Avaliados</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
                onAddToCart={onAddToCart}
              />
            ))
          ) : (
            <div className="no-products">
              <h3>Nenhum acessório encontrado</h3>
              <p style={{ marginTop: '10px' }}>Tente buscar por termos diferentes ou selecione outra categoria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
