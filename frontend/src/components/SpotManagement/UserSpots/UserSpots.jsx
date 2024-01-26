import { getUserSpots } from "../../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../../LandingPage/LandingPage.css";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import DeleteModal from "../DeleteModal";

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userSpots = useSelector((state) => state.spots.spots);
  // console.log("should be the current user spots", userSpots);

  useEffect(() => {
    dispatch(getUserSpots(userSpots));
  }, [dispatch, userSpots]);

  return (
    <div className="management">
      <h1>Manage Spots</h1>
      {/* <button onClick={navigate('/spots/new')}>Create a New Spot</button> */}
        <div className="tiles">
          {userSpots &&
            userSpots.map((spot) => (
              <div className="tiles" key={spot.id}>
                <span className="element">
                  <img src={spot.previewImage} alt={spot.name} />
                </span>
                <p>
                  {spot.city}, {spot.state}
                </p>
                <p>{spot.price} night </p>
                <div className="buttons">
                  <button
                    onClick={() => {
                      navigate(`/spots/${spot.id}/edit`);
                    }}
                  >
                    Update
                  </button>
                  <OpenModalButton
                    className="button"
                    buttonText="Delete"
                    spotId={spot.id}
                    modalComponent={<DeleteModal spotId={spot.id} Spots={userSpots} />}
                  />
                </div>
              </div>
            ))}
        </div>
    </div>
  );
}

export default ManageSpots;
