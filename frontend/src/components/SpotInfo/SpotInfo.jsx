import "./SpotInfo.css";
import { getOneSpot, getSpotReviews } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateReviewModal from "../ReviewManagement/CreateReviewModal";
import DeleteReviewModal from "../ReviewManagement/DeleteReviewModal";

const SpotInfo = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [newSpot, setNewSpot] = useState(true);
  const userId = useSelector((state) => state.session.user?.id);
  const ownerId = useSelector((state) => state.spots.spot?.spot?.Owner.id);
  const spotDeets = useSelector((state) => state.spots.spot?.spot);
  const spotReviews = useSelector((state) => state.spots.review?.Reviews);
  const user = useSelector((state) => state.session.user);
  let hasReview = false;

  spotReviews?.forEach((review) => {
    if (review.User?.id === userId) {
      hasReview = true;
    }
  });
  async function generic() {
    await dispatch(getSpotReviews(spotId)).then((reviews) => {
      if (reviews.Reviews.length > 0) {
        setNewSpot(false);
      }
    });
  }

  useEffect(() => {
    dispatch(getOneSpot(spotId));
    dispatch(getSpotReviews(spotId)).then((reviews) => {
      if (reviews.Reviews.length > 0) {
        setNewSpot(false);
      }
    });
  }, [dispatch, spotId]);

  const reserve = (e) => {
    e.preventDefault();

    alert("Feature Coming Soon");
  };

  return (
    <div className="spotInfoPage">
      <h1>{spotDeets?.name}</h1>
      <div className="location">
        <p>
          Location: {spotDeets?.city}, {spotDeets?.state}, {spotDeets?.country}
        </p>
      </div>
      <div className="imgContainer" >
        {spotDeets &&
          spotDeets.SpotImages.map((image) => (

              <img key={image.id} src={image.url} className="image" />

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
            <i className="fa-solid fa-star"> </i>
            <p>
              {spotDeets?.avgStarRating !== "NaN"
                ? spotDeets?.avgStarRating
                : "New"}{" "}
            </p>
            <p hidden={newSpot}>
              &#x2022;{" "}
              {spotDeets?.numReviews === 1
                ? `${spotDeets?.numReviews} review`
                : `${spotDeets?.numReviews} reviews`}
            </p>
          </div>
          <div className="reserveContainer">
            <button className="shineButton" onClick={reserve}>
              Reserve
            </button>
          </div>
        </div>
      </div>
      <div className="reviews">
        <div className="reviewHeading">
          <i className="fa-solid fa-star"></i>
          <p>
            {spotDeets?.avgStarRating !== "NaN"
              ? spotDeets?.avgStarRating
              : "New"}
          </p>
          <p hidden={newSpot}>
            {" "}&#x2022;{" "}
            {spotDeets?.numReviews === 1
              ? `${spotDeets?.numReviews} review`
              : `${spotDeets?.numReviews} reviews`}
          </p>
        </div>
        {!user || ownerId === userId || hasReview ? (
          <></>
        ) : (
          <OpenModalButton
            className="button"
            buttonText="Post Your Review"
            modalComponent={<CreateReviewModal spotId={spotId} />}
          />
        )}
        {!spotReviews?.length ? (
          <>
            <p>Be the first to post a review!</p>
          </>
        ) : (
          <div className="reviewList">
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
                  <div className='reviewInfo'key={review.id}>
                    <p>
                      <b>{review.User.firstName}</b>
                    </p>
                    <p>
                      {month[date.getMonth()]} {date.getFullYear()}
                    </p>
                    <p>
                      <b>{review.review}</b>
                    </p>
                    <div>
                      {review.User.id === userId ? (
                        <OpenModalButton
                          buttonText="Delete"
                          modalComponent={
                            <DeleteReviewModal
                              onButtonClick={generic}
                              reviewId={review.id}
                              spotId={spotId}
                            />
                          }
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotInfo;
