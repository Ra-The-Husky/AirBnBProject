import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteReview } from "../../store/reviews";
import './ReviewModal.css'

function DeleteReviewModal({ reviewId, spotId, onButtonClick }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();


  const destroyReview = (e) => {
    e.preventDefault();
    dispatch(deleteReview(reviewId, spotId)).then(closeModal).then(() => {
      if (typeof onButtonClick === 'function') onButtonClick()
    })
  };

  return (
    <div className="profileForm">
      <h1 className="title">Confirm Delete</h1>
      <p className="confirmationText">
        Are you sure you want to remove this spot from the listings?
      </p>
      <button onClick={destroyReview} className="yesDelete">
        Yes (Delete Review)
      </button>
      <button className="noDelete" onClick={closeModal}>
        No (Keep Review)
      </button>
    </div>
  );
}

export default DeleteReviewModal;
