import "./SpotInfo.css";
import { getOneSpot, getSpotReviews } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const SpotInfo = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  console.log(spotId);
  const spotDeets = useSelector((state) => state.spots.spot.spot);
  const spotReviews = useSelector((state) => state.spots.review?.Reviews);
  //   console.log("should be the spot's details,", spotDeets);
  //   console.log("should be the spot's reviews,", spotReviews);

  useEffect(() => {
    dispatch(getOneSpot(spotId));
    dispatch(getSpotReviews(spotId));
  }, [dispatch]);

  return (
    <>
      <div>
        <h1>{spotDeets?.name}</h1>
        <div className="location">
          <p>
            Location: {spotDeets?.city}, {spotDeets?.state},{" "}
            {spotDeets?.country}
          </p>
          <div className="pictures">
            {spotDeets &&
              spotDeets.SpotImages.map((image) => (
                <img key={image.id} src={image.url} />
              ))}
          </div>
          <div>
            <p className="hosted">
              Hosted by {spotDeets?.Owner.firstName},{" "}
              {spotDeets?.Owner.lastName}{" "}
            </p>
            <p className="paragraph">{spotDeets?.description}</p>
          </div>
          <div className="calloutBox">
            <p>{`$${spotDeets?.price} night`}</p>
            <i className="fa-solid fa-star"></i>
            <p>{spotDeets?.avgStarRating}</p>
            <p>{`${
              spotDeets?.numReviews > 1
                ? "reviews"
                : `${spotDeets?.numReviews} review`
            }`}</p>
            <div>
              <button className="reserveButton" onClick={"reserve"}>
                Reserve
              </button>
            </div>
          </div>
          <div className="reviews">
            <i className="fa-solid fa-star"></i>
            <p>{spotDeets?.avgStarRating}</p>
            <p>{`${
              spotDeets?.numReviews > 1
                ? "reviews"
                : `${spotDeets?.numReviews} review`
            }`}</p>
            {spotReviews &&
              spotReviews.map((review) => {
                const date = new Date(review.updatedAt)
                        const month = ["January", "February", "March", "April", "May", "June",  "July", "August", "September", "October", "November", "December"]
                return (
                  <div key={review.id}>
                    <p>{`Firstname ${review.User.firstName}`}</p>
                            <p><b>{review.User.firstName}</b></p>
                            <p>{month[date.getMonth()]} {date.getFullYear()}</p>
                            <p><b>{review.review}</b></p>
                        </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SpotInfo;
