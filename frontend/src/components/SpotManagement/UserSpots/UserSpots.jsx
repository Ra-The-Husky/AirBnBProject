import { getUserSpots } from "../../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate} from "react-router-dom";
import "../../LandingPage/LoadSpots.css";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import '../../../components/LandingPage/LoadSpots.css'

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userSpots = useSelector((state) => state.spots.spots);

  const createASpot = (e) => {
    e.preventDefault();

    navigate("/spots/new");
  };

  useEffect(() => {
    dispatch(getUserSpots());
  }, [dispatch]);

  return (
    <>
      <h1>Manage Spots</h1>
      {!userSpots?.length ? (
        <button onClick={createASpot} className="button">
          Create A Spot
        </button>
      ) : (
        <></>
      )}

      <div className="container">
        {userSpots &&
          userSpots.map((spot) => (
            <div className="tiles" key={spot.id}>

              <div
                className="element"
                onClick={() => {
                  navigate(`/spots/${spot.id}`);
                }}

              >
                <img
                  src={spot.previewImage}
                  alt={spot.name}
                  className="previewImage"
                />
                <div className="info">
                  <p className="location">
                    {spot.city}, {spot.state}
                  </p>
                  <div className="rating">
                    <i className="fa-solid fa-star"></i>
                    <p>{!spot.avgRating ? "New" : spot.avgRating}</p>
                  </div>
                  <p>{spot.price} night </p>
                </div>
              </div>
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
                  modalComponent={<DeleteSpotModal spotId={spot?.id} />}
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default ManageSpots;
