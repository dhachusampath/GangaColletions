import React, { useState } from 'react';
import axios from 'axios';
import './AddReview.css';
import ReactStars from 'react-star-rating-component';
import { useStore } from '../Context/Store';

const AddReview = ({ productId }) => {

    const {API_BASE_URL} = useStore();
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null); // State for the uploaded image
    const [isVerified, setIsVerified] = useState(true); // Assuming a verified purchase
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create a FormData object to handle file uploads
        const formData = new FormData();
        formData.append('productId', productId);
        formData.append('rating', rating);
        formData.append('title', title);
        formData.append('comment', comment);
        formData.append('isVerified', isVerified);
        formData.append('date', new Date());
        if (image) {
            formData.append('image', image);
        }

        // Send the form data to the backend
        axios
            .post(`${API_BASE_URL}/api/reviews`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                setIsSubmitting(false);
                alert('Review submitted successfully!');
            })
            .catch((error) => {
                setIsSubmitting(false);
                alert('Error submitting review.');
            });
    };

    return (
        <div className="add-review">
            <h3>Add Your Review</h3>
            <form onSubmit={handleSubmit}>
                <label>Rating</label>
                <ReactStars value={rating} onStarClick={setRating} starCount={5} />

                <label>Review Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <label>Comment</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />

                <label>Upload Product Image</label>
                <input type="file" onChange={handleImageChange} accept="image/*" />

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default AddReview;
