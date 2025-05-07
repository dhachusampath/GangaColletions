import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiX, FiChevronUp, FiChevronDown, FiSave } from 'react-icons/fi';
import { useStore } from '../Context/Store';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const { API_BASE_URL } = useStore();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    subcategories: [],
    order: 0
  });
  const [newSubcategory, setNewSubcategory] = useState('');
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.trim()) {
      setNewCategory(prev => ({
        ...prev,
        subcategories: [...prev.subcategories, newSubcategory.trim()]
      }));
      setNewSubcategory('');
    }
  };

  const handleRemoveSubcategory = (index) => {
    setNewCategory(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/categories/${editId}`, newCategory);
        toast.success('Category updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/categories`, newCategory);
        toast.success('Category added successfully');
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setNewCategory({
      name: category.name,
      subcategories: [...category.subcategories],
      order: category.order
    });
    setEditId(category._id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_BASE_URL}/categories/${id}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting category');
      }
    }
  };

  const resetForm = () => {
    setNewCategory({ name: '', subcategories: [], order: 0 });
    setNewSubcategory('');
    setEditId(null);
    setIsEditing(false);
  };

  const moveCategory = async (index, direction) => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === categories.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedCategories = [...categories];
    
    // Swap the order values
    const tempOrder = updatedCategories[index].order;
    updatedCategories[index].order = updatedCategories[newIndex].order;
    updatedCategories[newIndex].order = tempOrder;
    
    // Swap the array positions
    [updatedCategories[index], updatedCategories[newIndex]] = 
      [updatedCategories[newIndex], updatedCategories[index]];
    
    setCategories(updatedCategories);

    try {
      await axios.post(`${API_BASE_URL}/categories/reorder`, [
        { id: updatedCategories[index]._id, order: updatedCategories[index].order },
        { id: updatedCategories[newIndex]._id, order: updatedCategories[newIndex].order }
      ]);
    } catch (error) {
      toast.error('Failed to save new order');
      fetchCategories(); // Revert if error
    }
  };

  return (
    <div className="jewel-category-management">
      <div className="jewel-category-header">
        <h1>Manage Categories</h1>
        <button 
          className="jewel-category-add-btn" 
          onClick={resetForm}
          disabled={isEditing}
        >
          <FiPlus /> Add New Category
        </button>
      </div>

      <div className="jewel-category-container">
        <div className="jewel-category-form">
          <h2>{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
          
          <div className="jewel-form-group">
            <label>Category Name*</label>
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              className="jewel-form-input"
            />
          </div>
          
          <div className="jewel-form-group">
            <label>Subcategories</label>
            <div className="jewel-subcategory-input-group">
              <input
                type="text"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="Add subcategory"
                className="jewel-form-input"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory()}
              />
              <button 
                className="jewel-subcategory-add-btn"
                onClick={handleAddSubcategory}
              >
                <FiPlus />
              </button>
            </div>
            
            {newCategory.subcategories.length > 0 && (
              <div className="jewel-subcategory-list">
                {newCategory.subcategories.map((subcat, index) => (
                  <div key={index} className="jewel-subcategory-item">
                    <span>{subcat}</span>
                    <button 
                      className="jewel-subcategory-remove-btn"
                      onClick={() => handleRemoveSubcategory(index)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="jewel-form-actions">
            <button 
              className="jewel-cancel-btn"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="jewel-save-btn"
              onClick={handleSubmit}
              disabled={loading || !newCategory.name.trim()}
            >
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
        
        <div className="jewel-category-list">
          <h2>Current Categories</h2>
          
          {categories.length === 0 ? (
            <div className="jewel-no-categories">
              No categories found. Add your first category!
            </div>
          ) : (
            <ul className="jewel-category-items">
              {categories.map((category, index) => (
                <li key={category._id} className="jewel-category-item">
                  <div className="jewel-category-details">
                    <div className="jewel-category-order-controls">
                      <button 
                        className="jewel-order-btn"
                        onClick={() => moveCategory(index, 'up')}
                        disabled={index === 0}
                      >
                        <FiChevronUp />
                      </button>
                      <button 
                        className="jewel-order-btn"
                        onClick={() => moveCategory(index, 'down')}
                        disabled={index === categories.length - 1}
                      >
                        <FiChevronDown />
                      </button>
                    </div>
                    
                    <div className="jewel-category-content">
                      <h3>{category.name}</h3>
                      {category.subcategories.length > 0 && (
                        <ul className="jewel-subcategory-display">
                          {category.subcategories.map((subcat, idx) => (
                            <li key={idx}>{subcat}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  
                  <div className="jewel-category-actions">
                    <button 
                      className="jewel-edit-btn"
                      onClick={() => handleEdit(category)}
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className="jewel-delete-btn"
                      onClick={() => handleDelete(category._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CategoryManagement;