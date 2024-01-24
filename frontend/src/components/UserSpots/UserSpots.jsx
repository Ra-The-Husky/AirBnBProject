import "./UserSpots.css";
import { getUserSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useModal } from "../../context/Modal";
// import OpenModalButton from "../OpenModalButton/OpenModalButton";
// import DeleteModal from './SpotManagement/DeleteModal'

function manageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userSpots = useSelector((state) => state.spots.spots);
  // console.log("should be the current user spots", userSpots);

  const editSpot = (e) => {
    e.preventDefault();

    console.log("Will edit later")
    navigate(`/spots/1/edit`)
  };

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
                  {spot.city}, {spot.state}{" "}
                </p>
                <p>{spot.price} night </p>
                <div className="buttons">
                  <button onClick={editSpot}>Update</button>
                  <button onClick={removeSpot}>Delete</button>
                  {/* <>
                    <OpenModalButton
                      itemText="Delete"
                      modalComponent={<DeleteModal />}
                    />
                  </> */}
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
