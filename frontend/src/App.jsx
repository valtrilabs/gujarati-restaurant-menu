import React, { useState, useEffect } from 'react'

// Replace this with your Render backend URL after deployment
const API_URL = 'https://your-backend-url.onrender.com'

function App() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('lunch')
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState('')
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`)
      const data = await response.json()
      setCategories(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching menu:', error)
      setLoading(false)
    }
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAdmin(true)
      setShowAdmin(false)
    } else {
      alert('Incorrect password!')
      setPassword('')
    }
  }

  const toggleItemAvailability = async (itemId) => {
    try {
      await fetch(`${API_URL}/api/items/${itemId}/toggle`, {
        method: 'PUT'
      })
      fetchMenu()
    } catch (error) {
      console.error('Error toggling item:', error)
    }
  }

  const formatPrice = (price) => {
    if (!price) return ''
    return `₹${(price / 100).toFixed(0)}`
  }

  const lunchCategories = categories.filter(cat => cat.mealType === 'lunch')
  const dinnerCategories = categories.filter(cat => cat.mealType === 'dinner')
  const currentCategories = activeTab === 'lunch' ? lunchCategories : dinnerCategories

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading menu...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4B5 100%)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #8B4513 100%)',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
          Gujarat Thali Express
        </h1>
        <p style={{ margin: '0.5rem 0', opacity: 0.9 }}>Authentic Gujarati Cuisine</p>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '20px', 
          padding: '0.5rem 1rem',
          display: 'inline-block',
          fontSize: '0.9rem',
          marginTop: '1rem'
        }}>
          Fresh Menu - {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            month: 'long', 
            day: 'numeric'
          })}
        </div>
      </div>

      {/* QR Code Section */}
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'inline-block'
        }}>
          <div style={{
            width: '150px',
            height: '150px',
            background: '#f0f0f0',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem' }}>📱</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>QR Code</div>
            </div>
          </div>
          <h3 style={{ margin: '0 0 0.5rem', color: '#8B4513' }}>Scan for Menu Access</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Share this QR code with customers</p>
        </div>
      </div>

      {/* Admin Access */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {!isAdmin ? (
          <button 
            onClick={() => setShowAdmin(!showAdmin)}
            style={{
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid #ddd',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            🔧 Admin Access
          </button>
        ) : (
          <div style={{ color: '#8B4513' }}>
            ✅ Admin Mode Active
            <button 
              onClick={() => setIsAdmin(false)}
              style={{ marginLeft: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        )}
        
        {showAdmin && !isAdmin && (
          <form onSubmit={handleAdminLogin} style={{ marginTop: '1rem' }}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '0.5rem', marginRight: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
            />
            <button type="submit" style={{
              background: '#FF6B35',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Login
            </button>
          </form>
        )}
      </div>

      {/* Meal Type Tabs */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '0.5rem',
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setActiveTab('lunch')}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'lunch' ? '#FF6B35' : 'transparent',
              color: activeTab === 'lunch' ? 'white' : '#FF6B35',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            🍽️ Gujarati Thali (Lunch)
          </button>
          <button
            onClick={() => setActiveTab('dinner')}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'dinner' ? '#FF6B35' : 'transparent',
              color: activeTab === 'dinner' ? 'white' : '#FF6B35',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            🌙 Dinner
          </button>
        </div>

        {/* Menu Content */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {activeTab === 'lunch' ? (
            <div>
              <h2 style={{ color: '#8B4513', margin: '0 0 0.5rem' }}>આજનું થાળી</h2>
              <p style={{ color: '#666', margin: '0 0 1rem' }}>Today's Special Thali - ₹200 (Unlimited)</p>
              <div style={{
                background: '#E8F5E8',
                border: '1px solid #4CAF50',
                borderRadius: '8px',
                padding: '1rem',
                color: '#2E7D32'
              }}>
                🍽️ Complete unlimited meal with all items below
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ color: '#8B4513', margin: '0 0 0.5rem' }}>સાંજનું ખાવાનું</h2>
              <p style={{ color: '#666', margin: 0 }}>Evening Dinner Items</p>
            </div>
          )}
        </div>

        {/* Categories */}
        <div style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          {currentCategories.map((category) => (
            <div key={category.id} style={{
              background: 'white',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${getCategoryColor(category.color)} 0%, ${getCategoryColor(category.color)}CC 100%)`,
                color: 'white',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>{category.icon}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{category.displayName}</h3>
                    <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                      {getCategoryDescription(category.name)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div style={{ padding: '1rem' }}>
                {category.items.filter(item => item.isAvailable || isAdmin).map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem', color: '#8B4513' }}>{item.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                        {item.description} {item.price && formatPrice(item.price)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        color: item.isAvailable ? '#4CAF50' : '#f44336',
                        fontSize: '0.8rem'
                      }}>
                        ● {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => toggleItemAvailability(item.id)}
                          style={{
                            background: item.isAvailable ? '#f44336' : '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.7rem',
                            cursor: 'pointer'
                          }}
                        >
                          {item.isAvailable ? 'Disable' : 'Enable'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getCategoryColor(color) {
  const colors = {
    green: '#4CAF50',
    orange: '#FF9800', 
    pink: '#E91E63',
    purple: '#9C27B0',
    blue: '#2196F3',
    brown: '#8D6E63'
  }
  return colors[color] || '#666'
}

function getCategoryDescription(name) {
  const descriptions = {
    thali: 'Complete Meal',
    sabji: 'Fresh Vegetables',
    farsan: 'Crunchy Delights',
    sweet: 'Divine Desserts',
    roti: 'Bread & Rice',
    dinner: 'Evening Specials'
  }
  return descriptions[name] || 'Delicious Items'
}

export default App