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
        {isLoaded && <ProfileButton user={sessionUser} />}
      <NavLink to='spots/new'>Create a New Spot</NavLink>
    </nav>
  );
}

export default Navigation;
