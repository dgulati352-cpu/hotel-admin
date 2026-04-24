import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { ref, push, set, update, remove } from 'firebase/database';
import { db } from '../firebase';

export default function MenuManager({ dishes, setDishes, addToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    type: 'veg',
    image: ''
  });

  const categories = ['Main Course', 'Starters', 'Fast Food', 'Desserts', 'Beverages'];

  const openModal = (dish = null) => {
    if (dish) {
      setEditingDish(dish);
      setFormData({ ...dish });
    } else {
      setEditingDish(null);
      setFormData({ name: '', price: '', category: 'Main Course', type: 'veg', image: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDish(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
      addToast('Error', 'Please fill all fields and provide an image URL.', 'error');
      return;
    }

    const dishData = {
      ...formData,
      price: Number(formData.price),
    };

    try {
      if (editingDish) {
        await update(ref(db, `dishes/${editingDish.id}`), dishData);
        addToast('Success', 'Dish updated successfully.', 'success');
      } else {
        const newDishRef = push(ref(db, 'dishes'));
        await set(newDishRef, dishData);
        addToast('Success', 'New dish added to menu.', 'success');
      }
      closeModal();
    } catch (error) {
      console.error(error);
      addToast('Error', 'Failed to save dish.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      try {
        await remove(ref(db, `dishes/${id}`));
        addToast('Deleted', 'Dish has been removed from menu.', 'success');
      } catch (error) {
        console.error(error);
        addToast('Error', 'Failed to delete dish.', 'error');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Menu Items ({dishes.length})</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add New Dish
        </button>
      </div>

      <div className="grid-cards">
        {dishes.map(dish => (
          <div key={dish.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '160px' }}>
              <img src={dish.image} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => openModal(dish)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(dish.id)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.8)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                <span className={`badge ${dish.type === 'veg' ? 'badge-veg' : 'badge-non-veg'}`} style={{ backgroundColor: 'var(--bg-card)', padding: '4px 8px' }}>
                  {dish.type === 'veg' ? 'Veg' : 'Non-Veg'}
                </span>
              </div>
            </div>
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{dish.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{dish.category}</p>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-blue)', marginTop: '12px' }}>
                ₹{dish.price}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingDish ? 'Edit Dish' : 'Add New Dish'}</h3>
              <button className="modal-close" onClick={closeModal}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Dish Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="E.g., Chicken Tikka Masala" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Price (₹)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="E.g., 250" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Type</label>
                    <select 
                      className="form-control form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-control form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="https://example.com/image.jpg" 
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    style={{ marginBottom: '12px' }}
                  />
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="image-preview" onError={(e) => e.target.src='https://via.placeholder.com/400x200?text=Invalid+Image+URL'} />
                  ) : (
                    <div className="image-upload-area">
                      <ImageIcon size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Paste an image URL above to see preview</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingDish ? 'Save Changes' : 'Add Dish'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
