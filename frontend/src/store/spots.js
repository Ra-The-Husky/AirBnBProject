// import { createSelector } from "reselect";

export const LOAD_SPOTS = "spots/loadSpots";
export const RECIEVE_SPOT = "spots/receiveSpot";
export const RECIEVE_REVIEWS = "spots/receiveReviews";
export const REMOVE_SPOT = "spots/removeSpot";
export const NEW_SPOT = "spots/newSpot";
// export const UPDATE_SPOT = "spots/updateSpot";

//actions
export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const getSpot = (spot) => ({
  type: RECIEVE_SPOT,
  spot,
});

export const getReview = (review) => ({
  type: RECIEVE_REVIEWS,
  review,
});

export const addSpot = (spot) => ({
  type: NEW_SPOT,
  spot,
});

//thunks
export const getAllSpots = () => async (dispatch) => {
  const res = await fetch(`/api/spots`);

  if (res.ok) {
    const data = await res.json();
    // console.log('line 20 console log,' ,data)
    dispatch(loadSpots(data.Spots));
    return data;
  }
};

export const getOneSpot = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spot = await res.json();
    // console.log("this is the spot info,", spot);
    dispatch(getSpot(spot));
    return spot;
  }
};

export const getSpotReviews = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const review = await res.json();
    // console.log("this is the spot reviews,", review);
    dispatch(getReview(review));
    return review;
  }
};

export const createASpot = (payload) => async dispatch => {
  const res = await fetch(`/api/spots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (res.ok) {
    const spot = await res.json()
    console.log("made it here, boss.")
    dispatch(addSpot(spot))
    return spot
  }
}

//selectors

const initState = [];
//reducers
const spotsReducer = (state = initState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      return { ...state, spot: [...action.spots] };
    case RECIEVE_SPOT:
      return { ...state, spotId: action.spot };
      case NEW_SPOT:
        console.log("this is the action," ,action)
        return {...state, spot: [...action.spot]}
    case REMOVE_SPOT:
      return;
    case RECIEVE_REVIEWS:
      return { ...state, review: action.review };
    default:
      return state;
  }
};

export default spotsReducer;

//object version of the all spots reducer
// {
//   const spotsState = {};
//   console.log('line 34 console log,' ,action)
//   action.spots.forEach((spot) => {
//     spotsState[spot.id] = spot;
//   });
//   console.log('line 38 console log', spotsState)
//   return spotsState;
// }
