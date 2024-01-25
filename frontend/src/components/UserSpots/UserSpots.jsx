import "./UserSpots.css";
import { getOneSpot, getUserSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useModal } from "../../context/Modal";
// import OpenModalButton from "../OpenModalButton/OpenModalButton";
// import DeleteModal from './SpotManagement/DeleteModal'

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userSpots = useSelector((state) => state.spots.spots);
  // console.log("should be the current user spots", userSpots);

  const removeSpot = (e) => {
    e.preventDefault();

    console.log("deleting modal being added soon");
    navigate("/spots/current");
  };

  useEffect(() => {
    dispatch(getUserSpots(userSpots));
  }, [dispatch]);

  return (
    <>
      <h1>Manage Spots</h1>
      {userSpots ? (
        <>
          {userSpots &&
            userSpots.map((spot) => (
              <div key={spot.id}>
                <span className="element">
                  <img src={spot.previewImage} alt={spot.name} />
                </span>
                <p>
                  {spot.city}, {spot.state}{" "}<p>{spot.id}</p>
                </p>
                <p>{spot.price} night </p>
                <div className="buttons">
                  <button onClick={() => {
                navigate(`/spots/${spot.id}/edit`);
              }}>Update</button>
                  <button onClick={removeSpot}>Delete</button>
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

export default ManageSpots;
