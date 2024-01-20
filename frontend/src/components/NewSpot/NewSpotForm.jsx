import { useDispatch } from "react-redux";
import "./NewSpotForm.css";
import { useState, useEffect } from "react";
import { createASpot } from "../../store/spots";
import { useNavigate } from "react-router-dom";

const newSpotInput = () => {
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const errs = {};
    if (!country) {
      errs.country = "Country is required";
    }
    if (!address) {
      errs.address = "Address is required";
    }
    if (!city) {
      errs.city = "City is required";
    }
    if (!state) {
      errs.state = "State is required";
    }
    
    setErrors(errs);
  }, [dispatch]);

  const handlSubmit = async (e) => {
    e.prevenDefault();

    const newSpot = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      title,
      price,
      image,
    };
    if (newSpot) {
      let newSpot = await dispatch(createASpot(newSpot));
      navigate(`/spot/${newSpot.id}`);
    }
  };

  return (
    <>
      <h1>Create a new Spot</h1>
      <form onSubmit={handlSubmit}>
        <div className="firstSection">
          <h2>Where's your place located?</h2>
          <p>
            guests will only get your exact address once they booked a
            reservation.
          </p>
          <label>
            Country
            <input
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              name="country"
            ></input>
          </label>
          <p>{errors.country}</p>
          <label>Street Address </label>
          <p>{errors.address}</p>
          <label>City </label>
          <p>{errors.city}</p>

          <label>State </label>
          <p>{errors.state}</p>

          <label>Latitude, </label>
          <label>longitude </label>
        </div>
        <div className="secondSection">
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea placeholder="Please write at least 30 characters."></textarea>
        </div>
        <div className="thirdSection">
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <input placeholder="Name of your spot"></input>
        </div>
        <div className="fourthSection">
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results
          </p>
          <input placeholder="Price per night (USD)"></input>
        </div>
        <div className="fifthSection">
          <h3>Live up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot</p>
          <input placeholder="Preview Image URL"></input>
          <input placeholder="Image URL"></input>
          <input placeholder="Image URL"></input>
          <input placeholder="Image URL"></input>
          <input placeholder="Image URL"></input>
        </div>
        <button className="newSpot">Create Spot</button>
      </form>
    </>
  );
};

export default newSpotInput;
