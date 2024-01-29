import { csrfFetch } from "./csrf";
import { getUserSpots, getOneSpot, getSpotReviews } from "./spots";

const LOAD_USER_REVIEWS = "reviews/userReviews";
const REMOVE_REVIEW = "reviews/removeReview";

const UPDATE_REVIEW = "reviews/updateReview";

//actions
export const loadUserReviews = (reviews) => ({
  type: LOAD_USER_REVIEWS,
  reviews,
});



export const updateReview = (review) => ({
  type: UPDATE_REVIEW,
  review,
});

export const removeReview = (reviewId) => ({
  type: REMOVE_REVIEW,
  reviewId,
});

//thunks
export const getUserReviews = () => async (dispatch) => {
  const res = await fetch(`/api/reviews/current`);

  if (res.ok) {
    const userReviews = await res.json();
    dispatch(loadUserReviews(userReviews));
    return userReviews;
  }
};


export const createAReview = (spotId, payload) => async (dispatch) => {
  let res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const review = await res.json();
    dispatch(getSpotReviews(spotId));
    dispatch(getOneSpot(spotId))
    return review;
  }
  return res;
};


export const editReview = (reviewId, edits) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(edits),
  });
  if (res.ok) {
    const updatedReview = await res.json();
    dispatch(updateSpot(updatedReview));
    dispatch(getUserReviews())
    return updatedReview;
  }
  return res
};

export const deleteReview = (reviewId, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(getOneSpot(spotId))
    dispatch(getSpotReviews(spotId))
    dispatch(getUserReviews())
    return data;
  }
};

const initState = [];
//reducers
const reviewsReducer = (state = initState, action) => {
  switch (action.type) {
    case LOAD_USER_REVIEWS:
      return { ...state, reviews: [...action.reviews.Reviews] };

    case UPDATE_REVIEW:
      return { ...state, reviewId: action.review };
    case REMOVE_REVIEW:
      delete { ...state[action.review] };
      return { ...state };
    default:
      return state;
  }
};

export default reviewsReducer;
