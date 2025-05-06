import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReviewsList.css';
import { useStore } from '../Context/Store';

const ReviewsList = () => {
  const { products, API_BASE_URL } = useStore();
  const [selectedProduct, setSelectedProduct] = useState(products[0]?._id || '');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch reviews when the selected product changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!selectedProduct) return;
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/productss/reviews/${selectedProduct}`
        );
        setReviews(response.data.reviews || []);
      } catch (err) {
        setError('Failed to load reviews. Please try again later.');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [selectedProduct, API_BASE_URL]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (err) {
      alert('Failed to delete review. Please try again.');
      console.error('Error deleting review:', err);
    }
  };

  const filteredReviews =
    filter === 'all'
      ? reviews
      : reviews.filter((review) => review.rating === parseInt(filter));

  const renderStars = (rating) => {
    return (
      <div className="rl-stars-container">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`rl-star ${i < rating ? 'rl-star-filled' : 'rl-star-empty'}`}
          >
            {i < rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="rl-loading-container">
      <div className="rl-spinner"></div>
      <p>Loading reviews...</p>
    </div>
  );

  if (error) return (
    <div className="rl-error-container">
      <div className="rl-error-alert">
        <span className="rl-error-icon">⚠️</span>
        <p>{error}</p>
        <button 
          className="rl-retry-btn" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="rl-container">
      <div className="rl-header">
        <h1 className="rl-title">Customer Reviews</h1>
        <div className="rl-controls">
          {/* Product Selection Dropdown */}
          <div className="rl-select-group">
            <label className="rl-select-label">Product:</label>
            <select 
              className="rl-select" 
              onChange={handleProductChange} 
              value={selectedProduct}
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {`${product.name} (${product.itemcode})`}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Reviews by Rating */}
          <div className="rl-select-group">
            <label className="rl-select-label">Filter:</label>
            <select 
              className="rl-select" 
              onChange={handleFilterChange} 
              value={filter}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Count */}
      <div className="rl-stats">
        <span className="rl-stat-item">
          Total: <strong>{reviews.length}</strong> reviews
        </span>
        {filter !== 'all' && (
          <span className="rl-stat-item">
            Filtered: <strong>{filteredReviews.length}</strong> reviews
          </span>
        )}
        <span className="rl-stat-item">
          Average: <strong>
            {reviews.length > 0 
              ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
              : '0.0'
            } ★
          </strong>
        </span>
      </div>

      {/* Reviews List */}
      <div className="rl-reviews-container">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review._id} className="rl-review-card">
              <div className="rl-review-header">
                <div className="rl-reviewer-info">
                  <span className="rl-reviewer-name">{review.name}</span>
                  <span className="rl-review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="rl-review-rating">
                  {renderStars(review.rating)}
                  <span className="rl-rating-value">{review.rating}.0</span>
                </div>
              </div>
              
              <div className="rl-review-body">
                <p className="rl-review-comment">{review.comment || 'No comment provided'}</p>
                
                {review.media?.length > 0 && (
                  <div className="rl-media-gallery">
                    {review.media.map((file, index) => (
                      <div key={index} className="rl-media-item">
                        <img
                          src={`${API_BASE_URL}/images/${file}`}
                          alt={`Review media ${index + 1}`}
                          className="rl-media-image"
                          onClick={() => window.open(`${API_BASE_URL}/images/${file}`, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="rl-review-footer">
                <button
                  className="rl-delete-btn"
                  onClick={() => handleDeleteReview(review._id)}
                >
                  <span className="rl-delete-icon">🗑️</span>
                  {!isMobile && 'Delete Review'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rl-empty-state">
            <div className="rl-empty-icon">📭</div>
            <h3>No reviews found</h3>
            <p>There are no reviews matching your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;