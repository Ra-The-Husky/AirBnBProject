import "./UserSpots.css";
import { getUserSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function manageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userSpots = useSelector((state) => state.spots.spot);
  console.log("should be the current user spots", userSpots);

  const updateSpot = (e) => {
    console.log('will have functionality soon')
    navigate('/')
  }

  const removeSpot = (e) => {
    e.preventDefault();
    dispatch(deleteSpot(spotId));
    navigate("/");
  };
  useEffect(() => {
    dispatch(getUserSpots(userSpots));
  }, [dispatch]);

  return (
    <>
      <h1>Manage Spots</h1>
      {userSpots.length ? (
        <>
          {userSpots &&
            userSpots.map((spot) => (
              <div>
                <span className="element" key={spot.id}>
                  <img src={spot.previewImage} alt={spot.name} />
                </span>
                <p>
                  {spot.city}, {spot.state}{" "}
                </p>
                <p>{spot.price} night </p>
                <i className="fa-solid fa-star"></i>
                <p>{spot.avgRating}</p>
                <div className="buttons">
                <button onClick={removeSpot}>Delete</button>
                <button onClick={updateSpot}>Update</button>
                </div>
              </div>
            ))}
        </>
      ) : (
        <div className="no-spots">
          <button className="new-spot">Create New Spot</button>
        </div>
      )}
    </>
  );
}

export default manageSpots;
