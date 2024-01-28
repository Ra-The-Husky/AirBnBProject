import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navBar">
      <NavLink to="/">
        <i className="fa-solid fa-crown"> RoyalBnB</i>
      </NavLink>
      {sessionUser ? (
        <div className="createSpot">
          <NavLink to="spots/new" className="createSpot">
            Create a New Spot
          </NavLink>
        </div>
      ) : (
        <></>
      )}
      <div className="profile">
        <div className="profileMenu">
          {isLoaded && <ProfileButton user={sessionUser} />}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
