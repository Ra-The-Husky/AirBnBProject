import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import { useEffect } from "react";
import { getUserReviews } from "../../../store/reviews";
import UpdateReviewModal from "../UpdateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";
function UserReviews() {
  const dispatch = useDispatch();
  const userReviews = useSelector((state) => state.reviews?.reviews);
  console.log('should be user reviews', userReviews);

  useEffect(() => {
    dispatch(getUserReviews(userReviews));
  }, [dispatch]);

  return (
    <div className="reviewManagement">
      <h1>Manage Reviews</h1>
      {!userReviews?.length ? (
        <>
          <h3 className="noReviews">No reviews yet!</h3>
        </>
      ) : (
        <>
          {userReviews &&
            userReviews?.map((review) => {
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
                <div key={review?.id}>
                  <h2>{review?.Spot.name}</h2>
                  <p>
                    {month[date.getMonth()]} {date.getFullYear()}
                  </p>
                  <p>
                    <b>{review?.review}</b>
                  </p>
                  <OpenModalButton
                    buttonText="Update"
                    modalComponent={<UpdateReviewModal reviewInfo={review} spotName={review?.Spot.name} />}
                  />
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteReviewModal reviewId={review?.id} />}
                  />
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}

export default UserReviews;
