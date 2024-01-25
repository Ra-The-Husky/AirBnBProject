import spot from "../../../backend/db/models/spot";
import { csrfFetch } from "./csrf";
 const LOAD_SPOTS = "spots/loadSpots";
 const LOAD_USER_SPOTS = 'spots/loadUserSpots'
const RECIEVE_SPOT = "spots/receiveSpot";
 const RECIEVE_REVIEWS = "spots/receiveReviews";
const REMOVE_SPOT = "spots/removeSpot";
const NEW_SPOT = "spots/newSpot";
const NEW_SPOT_IMAGE = "spots/spotImage";
const UPDATE_SPOT = "spots/updateSpot";

//actions
export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const loadUserSpots = (spots) => ({
  type: LOAD_USER_SPOTS,
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

export const addSpotImage = (image) => ({
  type: NEW_SPOT_IMAGE,
  image,
});

export const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
})

export const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId,
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

export const getUserSpots = () => async (dispatch) => {
  const res = await fetch(`/api/spots/current`);

  if (res.ok) {
    const userSpots = await res.json();
    // console.log("user's spots", userSpots.Spots);
    dispatch(loadUserSpots(userSpots.Spots));
    return userSpots;
  }
};

export const getOneSpot = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spot = await res.json();
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

export const createASpot = (payload) => async (dispatch) => {
  let res = await csrfFetch(`/api/spots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    const spot = await res.json();
    // console.log("made it here, boss.", spot);
    dispatch(addSpot(spot));
    return spot
  }
};

export const editSpot = (spotId) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/edit`, {
    method: 'PUT',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(spot)
  })
  if (res.ok) {
    const updatedSpot = await res.json()
    console.log(updatedSpot)
    dispatch(updateSpot(updatedSpot))
    return updatedSpot
  }
}

export const newSpotImage = (spotId, image) => async (dispatch) => {
  const { url, preview, imageableType} = image
  console.log('thunk spotId log', spotId)
  // console.log('new image info', url, preview, imageableType);
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify({
      url,
      preview,
      imageableType,
      imageableId: spotId
    })
  });

  if (res.ok) {
    const image = await res.json();
    dispatch(addSpotImage(image));
    return image;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/current`, {
    method: "DELETE",
  });

  console.log("this is the spot to be delete id", spotId);
  if (res.ok) {
    const data = await res.json()
    dispatch(removeSpot(data.spotId));
    return data
  }
};

//selectors

const initState = [];
//reducers
const spotsReducer = (state = initState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      console.log('action',action)
      console.log('action',state)
      console.log('action',spot)
      return { ...state, spot: [...action.spots] };
      case LOAD_USER_SPOTS:
        return {...state, spots: [...action.spots]}
    case RECIEVE_SPOT:
      return { ...state, spot: action.spot };
    case NEW_SPOT:
      return { ...state, spot: action.spot };
    case NEW_SPOT_IMAGE:
      return { ...state, images: action.image };
      case UPDATE_SPOT:
      return { ...state, spotId: action.spot };
    case REMOVE_SPOT:
      delete { ...state[action.spot] };
      return { ...state };
    case RECIEVE_REVIEWS:
      return { ...state, review: action.review };
    default:
      return state;
  }
};

export default spotsReducer;