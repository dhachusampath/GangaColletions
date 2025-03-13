import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewSection.css';
import { useStore } from '../Context/Store';

const StarRating = ({ rating, onRate }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <i
        key={star}
        className={`fa-solid fa-star ${star <= rating ? 'active' : ''}`}
        onClick={() => onRate(star)}
      ></i>
    ))}
  </div>
);

const ReviewSection = ({ productId }) => {
  const {API_BASE_URL} =useStore();
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    comment: '',
    media: [],
  });
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/productss/reviews/${productId}`);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, media: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('rating', formData.rating);
    form.append('comment', formData.comment);
    formData.media.forEach((file) => form.append('media', file));

    try {
      await axios.post(`${API_BASE_URL}/productss/reviews/${productId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ name: '', rating: 0, comment: '', media: [] });
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === 'prev' && prev > 1) return prev - 1;
      if (direction === 'next' && prev < totalPages) return prev + 1;
      return prev;
    });
  };

  return (
    <div className="review-section">
      <h2>Customer Reviews</h2>

      {/* Review Form */}
      <form className="review-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your Name"
            required
          />
        </label>
        <label>
          Rating:
          <StarRating
            rating={formData.rating}
            onRate={(rating) => setFormData((prev) => ({ ...prev, rating }))}
          />
        </label>
        <label>
          Comment:
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Write your review here"
            required
          ></textarea>
        </label>
        <label>
          Upload Media:
          <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
        </label>
        <button type="submit">Submit Review</button>
      </form>

      {/* Reviews List */}
      <div className="review-list">
        {paginatedReviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          paginatedReviews.map((review) => (
            <div key={review._id} className="review-item">
              <p>
                <strong>Name:</strong> {review.name}
              </p>
              <p>
                <strong>Rating:</strong> {review.rating} / 5
              </p>
              <p>
                <strong>Comment:</strong> {review.comment}
              </p>
              {review.media.length > 0 && (
                <div className="review-media">
                  {review.media.map((media, index) => (
                    <img
                      key={index}
                      src={`${url}/images/${media}`}
                      alt={`Review Media ${index}`}
                      onClick={() => setSelectedMedia({ media, index })}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="review-pagination">
  <button
    className="pagination-btn pagination-prev"
    disabled={currentPage === 1}
    onClick={() => handlePageChange('prev')}
  >
    Previous
  </button>
  <span className="pagination-info">
    Page {currentPage} of {totalPages}
  </span>
  <button
    className="pagination-btn pagination-next"
    disabled={currentPage === totalPages}
    onClick={() => handlePageChange('next')}
  >
    Next
  </button>
</div>


      {/* Media Viewer */}
      {selectedMedia && (
        <div className="media-viewer">
          <div className="media-overlay" onClick={() => setSelectedMedia(null)}></div>
          <div className="media-content">
            <img src={`${API_BASE_URL}/images/${selectedMedia.media}`} alt="Review Media" />
            <button className="close-button" onClick={() => setSelectedMedia(null)}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
