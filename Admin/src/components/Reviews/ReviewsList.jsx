import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReviewsList.css';
import { useStore } from '../Context/Store';

const ReviewsList = () => {
  const { products } = useStore(); // Access products from StoreContext
  const [selectedProduct, setSelectedProduct] = useState(products[0]?._id || ''); // Default to the first product
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch reviews when the selected product changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!selectedProduct) return;
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://gangacollection-backend.onrender.com/api/productss/reviews/${selectedProduct}`
        );
        setReviews(response.data.reviews || []);
      } catch (err) {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [selectedProduct]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`https://gangacollection-backend.onrender.com/api/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const filteredReviews =
    filter === 'all'
      ? reviews
      : reviews.filter((review) => review.rating === parseInt(filter));

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="reviews-list-container">
      <h2>Product Reviews</h2>

      {/* Product Selection Dropdown */}
      <div className="product-selector">
        <label>Select Product:</label>
        <select onChange={handleProductChange} value={selectedProduct}>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {`${product.name} ${product.itemcode}`}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Reviews by Rating */}
      <div className="filter-container">
        <label>Filter by Rating:</label>
        <select onChange={handleFilterChange} value={filter}>
          <option value="all">All</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Reviews Table */}
      <table className="reviews-table">
        <thead>
          <tr>
            <th>Reviewer</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Media</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <tr key={review._id}>
                <td>{review.name}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>
                  {review.media?.length > 0 ? (
                    <div className="media-container">
                      {review.media.map((file, index) => (
                        <img
                          key={index}
                          src={`http://localhost:5000/api/images/${file}`}
                          alt={`Review Media ${index + 1}`}
                          className="media-image"
                        />
                      ))}
                    </div>
                  ) : (
                    <span>No media</span>
                  )}
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No reviews found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsList;
