import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import session from "./session";
import spots from './spots'
import reviews from './reviews'

const rootReducer = combineReducers({
  session,
  spots,
  reviews
});

let enhancer;

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}


export default configureStore;
