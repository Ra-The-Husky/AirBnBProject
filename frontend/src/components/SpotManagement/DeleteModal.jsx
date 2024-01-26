import { useModal } from "../../context/Modal";
import { useDispatch} from "react-redux";
import { deleteSpot} from "../../store/spots";
import "./DeleteModal.css";

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  console.log("is this the spotId?", spotId);

  const destroySpot = (e) => {
    e.preventDefault();
    return dispatch(deleteSpot(spotId))
      .then(closeModal)
  };

  return (
    <div className="modal">
      <h1 className="title">Confirm Delete</h1>
      <p className="confirmationText">
        Are you sure you want to remove this spot from the listings?
      </p>
      <button onClick={destroySpot} className="yesDelete">
        Yes (Delete Spot)
      </button>
      <button className="noDelete" onClick={closeModal}>
        No (Keep Spot)
      </button>
    </div>
  );
}

export default DeleteSpotModal;
