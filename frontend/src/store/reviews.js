import { csrfFetch } from "./csrf";
import { getUserSpots, getOneSpot } from "./spots";

const REMOVE_REVIEW = "reviews/removeReview";
const NEW_REVIEW = "reviews/newReview";
const UPDATE_REVIEW = "reviews/updateReview";

//actions
export const addReview = (review) => ({
  type: NEW_REVIEW,
  review,
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
export const createAReview = (payload) => async (dispatch) => {
  let res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    const review = await res.json();
    // console.log("made it here, boss.", spot);
    dispatch(addReview(review));
    return review;
  }
};

export const editReview = (reviewId, edits) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(edits),
  });
  if (res.ok) {
    console.log("made it here?");
    const updatedReview = await res.json();
    console.log(updatedReview);
    dispatch(updateSpot(updatedReview));
    return updatedReview;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  console.log(reviewId);
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(removeReview(data));
    return data;
  }
};

const initState = [];
//reducers
const reviewsReducer = (state = initState, action) => {
  switch (action.type) {
    case NEW_REVIEW:
      return { ...state, review: action.review };
    case UPDATE_REVIEW:
      return { ...state, reviewId: action.review };
    case REMOVE_REVIEWUPDATE_REVIEW:
      delete { ...state[action.review] };
      return { ...state };
    // case RECIEVE_REVIEWS:
    //   return { ...state, review: action.review };
    default:
      return state;
  }
};

export default reviewsReducer;
