import { useDispatch, useSelector } from "react-redux";
import "./LoadSpots.css";
import { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allSpots = useSelector((state) => state.spots?.spot);
  // console.log("this is the component console log,", allSpots);

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <>
      <ul className="container">
        {allSpots &&
          allSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => {
                navigate(`/spots/${spot.id}`);
              }}
            >
              <div className="tiles">
                <p className="tooltip">{spot.name}</p>
                <img
                  src={spot.previewImage}
                  alt={spot.name}
                  className="previewImage"
                />
                <div className="info">
                  <p className="location">
                    {spot.city}, {spot.state}{" "}
                  </p>
                  <div className="rating">
                    <i className="fa-solid fa-star"></i>
                    <p>{!spot.avgRating ? "New" : spot.avgRating}</p>
                  </div>
                </div>
                <div className="price">
                  <p className="price-number">{spot.price}</p>
                  <p className="night">night</p>
                </div>
              </div>
            </div>
          ))}
      </ul>
    </>
  );
};

export default LandingPage;
