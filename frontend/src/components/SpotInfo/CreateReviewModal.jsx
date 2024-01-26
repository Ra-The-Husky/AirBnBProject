import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useState } from "react";

function ReviewSpotModal() {
  const [review, setReview] = useState();
  const [stars, setStars] = useState();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const submitReview = (e) => {
    e.prevenDefault();
  };

  return (
    <div className="modal">
      <h1 className="title">How was your stay?</h1>
      <textarea
        className="reviewArea"
        name="review"
        cols="30"
        rows="10"
        placeholder="Leave your review here..."
        value={review}
      ></textarea>
      <button className="submit" onClick={submitReview}>
        Submit Your Review
      </button>
    </div>
  );
}

export default ReviewSpotModal;
