import "./SpotInfo.css";
import { getOneSpot, getSpotReviews } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const SpotInfo = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  // console.log("spotId", spotId);
  const userId = useSelector((state) => state.session.user?.id);
  const ownerId = useSelector((state) => state.spots.spot?.spot.Owner?.id);
  // console.log("userId", userId);
  // console.log("ownerId", ownerId);
  const spotDeets = useSelector((state) => state.spots.spot?.spot);
  const spotReviews = useSelector((state) => state.spots.review?.Reviews);

  useEffect(() => {
    dispatch(getOneSpot(spotId));
    dispatch(getSpotReviews(spotId));
  }, [dispatch]);
  const reserve = (e) => {
    e.preventDefault();

    alert("Feature Coming Soon");
  };
  return (
    <>
      <h1>{spotDeets?.name}</h1>
      <div className="location">
        <p>
          Location: {spotDeets?.city}, {spotDeets?.state}, {spotDeets?.country}
        </p>
      </div>
      <div className="pictures">
        {spotDeets &&
          spotDeets.SpotImages.map((image) => (
            <div className="imgContainer" key={image.id}>
              <img src={image.url} className="image" />
            </div>
          ))}
      </div>
      <p className="hosted">
        Hosted by {spotDeets?.Owner.firstName} {spotDeets?.Owner.lastName}{" "}
      </p>
      <div className="moreInfo">
        <p className="paragraph">{spotDeets?.description}</p>
        <div className="calloutBox">
          <div className="priceNight">
            <p className="price">{`$${spotDeets?.price}`}</p>
            <p>night</p>
          </div>
          <div className="ratingInfo">
            <i className="fa-solid fa-star"></i>
            <p>{spotDeets?.avgStarRating}</p> {"."}
            <p>
              {spotDeets?.avgStarRating === null || spotDeets?.avgStarRating < 1
                ? "New"
                : spotDeets?.numReviews === 1
                ? `${spotDeets?.numReviews} review`
                : `${spotDeets?.numReviews} reviews`}
            </p>
          </div>
          <div className="reserveContainer">
            <button className="reserveButton" onClick={reserve}>
              Reserve
            </button>
          </div>
        </div>
      </div>
      <div className="reviews">
        <i className="fa-solid fa-star"></i>
        <p>
          {spotDeets?.avgStarRating === null || spotDeets?.avgStarRating < 1
            ? "New"
            : spotDeets?.numReviews === 1
            ? `${spotDeets?.numReviews} review`
            : `${spotDeets?.numReviews} reviews`}
        </p>
        {ownerId !== userId ? (
          <button className="reviewButton">Post your review</button>
        ) : (
          <></>
        )}
        {!spotReviews?.length ? (
          <>
            <p>Be the first to post a review!</p>
          </>
        ) : (
          <>
            {spotReviews &&
              spotReviews.map((review) => {
                const date = new Date(review.updatedAt);
                const month = [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ];
                return (
                  <div key={review.id}>
                    <p>
                      <b>{review.User.firstName}</b>
                    </p>
                    <p>
                      {month[date.getMonth()]} {date.getFullYear()}
                    </p>
                    <p>
                      <b>{review.review}</b>
                    </p>
                  </div>
                );
              })}
          </>
        )}
      </div>
    </>
  );
};

export default SpotInfo;
