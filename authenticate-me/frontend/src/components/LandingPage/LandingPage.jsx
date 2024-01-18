import { useDispatch, useSelector } from "react-redux";
import "./LandingPage.css";
import { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allSpots = useSelector((state) => state.spots.spot);
  // console.log("this is the component console log,", allSpots);

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <>
      <ul className="tiles">
        {allSpots &&
          allSpots.map((spot) => (
            <div key={spot.id}
              onClick={() => {
                navigate(`/spots/${spot.id}`);
              }}
            >
              <span className="element" key={spot.id}>
                <p className="tooltip">{spot.name}</p>
                <img src={spot.previewImage} alt={spot.name} />
              </span>
              <div className="info">
                <p>
                  {spot.city}, {spot.state}{" "}
                </p>
                <p>{spot.price}/night </p>
              </div>
              <i className="fa-solid fa-star"></i>
              <p>{!spot.avgRating ? "New" : spot.avgRating} </p>
            </div>
          ))}
      </ul>
    </>
  );
};

export default LandingPage;
