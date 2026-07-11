import React from 'react';

export default function CategoryFilter({ categories, activeCategory, onSelectCategory }) {
  return (
    <section className="categories-wrapper">
      <div className="container">
        <h4 style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          letterSpacing: '1px',
          marginBottom: '15px',
          fontWeight: '700'
        }}>
          Navegar por Categorias
        </h4>
        <div className="categories-container">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
