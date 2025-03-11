import React from "react";
import "./ReviewScrollCard.css";

const ReviewScrollCard = ({ reviews }) => {
  return (
    <div className="review-scroll-container">
      <h2 className="reviews-title">Customer Reviews</h2>
      <div className="reviews-wrapper">
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <img
              src={review.productImage}
              alt={`Product reviewed by ${review.name}`}
              className="product-image"
            />
            <div className="review-details">
              <div className="reviewer-info">
                <div>
                  <h4 className="reviewer-name">{review.name}</h4>
                </div>
              </div>
              <p className="review-text">"{review.text}"</p>
              <div className="review-rating">
                {"⭐".repeat(review.rating)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewScrollCard;
