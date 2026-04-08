import { useState } from 'react'

export default function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    setAdded(true)
    onAdd(product)
    setTimeout(() => setAdded(false), 1500)
  }

  const providerColors = {
    'Open Food Facts': '#E65100',
    'DummyJSON': '#1565C0',
    'FakeStore': '#6A1B9A',
  }

  const providerColor = providerColors[product.source] || '#2E7D32'

  return (
    <div style={{
      backgroundColor: '#141414',
      border: '1px solid #222222',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      gap: '16px',
      position: 'relative',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = '#2E7D32'
      e.currentTarget.style.backgroundColor = '#161616'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = '#222222'
      e.currentTarget.style.backgroundColor = '#141414'
    }}
    >

      {/* Best Value Badge */}
      {product.isBestValue && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: '#1B5E20',
          border: '1px solid #2E7D32',
          borderRadius: '6px',
          padding: '3px 8px',
          fontSize: '10px',
          fontWeight: '700',
          color: '#66BB6A',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>
          Best Value
        </div>
      )}

      {/* Discount Badge */}
      {product.discount && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: '#2E7D32',
          borderRadius: '6px',
          padding: '3px 8px',
          fontSize: '10px',
          fontWeight: '700',
          color: '#fff',
        }}>
          {product.discount}% OFF
        </div>
      )}

      {/* Product Image */}
      <div style={{
        width: '90px',
        height: '90px',
        borderRadius: '10px',
        backgroundColor: '#1E1E1E',
        flexShrink: 0,
        overflow: 'hidden',
        marginTop: product.discount ? '20px' : '0',
      }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={e => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
          }}>
            {product.emoji || '🛒'}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, paddingTop: product.discount ? '20px' : '0' }}>

        {/* Provider tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: '#1A1A1A',
          border: `1px solid ${providerColor}40`,
          borderRadius: '20px',
          padding: '2px 8px',
          marginBottom: '8px',
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: providerColor,
          }} />
          <span style={{
            fontSize: '11px',
            color: providerColor,
            fontWeight: '500',
          }}>
            {product.source}
          </span>
        </div>

        {/* Name */}
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#F0EDE8',
          marginBottom: '4px',
          paddingRight: product.isBestValue ? '80px' : '0',
          lineHeight: '1.3',
        }}>
          {product.name}
        </div>

        {/* Quantity */}
        <div style={{
          fontSize: '12px',
          color: '#757575',
          marginBottom: '10px',
        }}>
          {product.quantity} {product.unit}
        </div>

        {/* Price row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#F0EDE8',
              }}>
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span style={{
                  fontSize: '14px',
                  color: '#555',
                  textDecoration: 'line-through',
                }}>
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#4CAF50',
              fontWeight: '500',
              marginTop: '2px',
            }}>
              ₹{product.unitPrice}/100{product.unit === 'ml' ? 'ml' : 'g'}
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={e => { e.stopPropagation(); handleAdd() }}
            style={{
              backgroundColor: added ? '#1B5E20' : '#0E0E0E',
              border: `1px solid ${added ? '#2E7D32' : '#333'}`,
              borderRadius: '10px',
              padding: '8px 18px',
              color: added ? '#66BB6A' : '#F0EDE8',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '70px',
            }}
            onMouseEnter={e => {
              if (!added) {
                e.currentTarget.style.backgroundColor = '#1B5E20'
                e.currentTarget.style.borderColor = '#2E7D32'
                e.currentTarget.style.color = '#66BB6A'
              }
            }}
            onMouseLeave={e => {
              if (!added) {
                e.currentTarget.style.backgroundColor = '#0E0E0E'
                e.currentTarget.style.borderColor = '#333'
                e.currentTarget.style.color = '#F0EDE8'
              }
            }}
          >
            {added ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  )
}