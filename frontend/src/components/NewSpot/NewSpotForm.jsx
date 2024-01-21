import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { createASpot } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import "./NewSpotForm.css";

const newSpotInput = () => {
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const errs = {};
    if (!country) {
      errs.country = "*Country is required";
    }
    if (!address) {
      errs.address = "*Address is required";
    }
    if (!city) {
      errs.city = "*City is required";
    }
    if (!state) {
      errs.state = "*State is required";
    }
    if (lat < 1) {
      errs.lat = "*Latitude is not valid";
    }
    if (lng < 1) {
      errs.lng = "*Longititude is not valid";
    }
    if (description.length < 30) {
      errs.description = "*Minimum of 30 characters required";
    }
    if (!title) {
      errs.title = "*Title is required";
    }
    if (price < 1) {
      errs.price = "*Price is required";
    }
    if (!image) {
      errs.image = "*Preview Image is required";
    }
    setErrors(errs);
  }, [
    dispatch,
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
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const spot = {
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
    dispatch(createASpot(spot));
    console.log(spot);
    navigate(`/spot/${spot.id}`);
    //   reset()
  };

  const reset = () => {
    setCountry("");
    setAddress("");
    setCity("");
    setState("");
    setLat(0);
    setLng(0);
    setDescription("");
    setTitle("");
    setPrice("");
    setImage("");
  };

  return (
    <div className="form">
      <h1 className="pageTitle">Create a new Spot</h1>
      <form onSubmit={handleSubmit}>
        <div className="firstSection">
          <h2>Where's your place located?</h2>
          <p className="caption">
            Guests will only get your exact address once they booked a
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
          <p className="errors">{errors.country}</p>
          <label>
            Street Address
            <input
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              name="address"
            ></input>{" "}
          </label>
          <p className="errors">{errors.address}</p>
          <div className="cityState">
            <label className="city">
              City
              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                name="city"
              ></input>{" "}
            </label>
            <p className="errors">{errors.city}</p>

            <label className="state">
              State
              <input
                placeholder="STATE"
                value={state}
                onChange={(e) => setState(e.target.value)}
                name="state"
              ></input>
            </label>
          <p className="errors">{errors.state}</p>
          </div>
          <div className="latLng">
            <label>
              Latitude
              <input
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                name="lat"
              ></input>
              {","}
            </label>
              <p className="errors">{errors.lat}</p>
            <label>
              longitude
              <input
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                name="lng"
              ></input>
            </label>
          <p className="errors">{errors.lng}</p>
          </div>
        </div>
        <div className="secondSection">
          <h2>Describe your place to guests</h2>
          <p className="caption">
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            placeholder="Please write at least 30 characters."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            rows="5"
          ></textarea>
          <p className="errors">{errors.description}</p>
        </div>
        <div className="thirdSection">
          <h2>Create a title for your spot</h2>
          <p className="caption">
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <input
            placeholder="Name of your spot"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            name="title"
          ></input>
          <p className="errors">{errors.title}</p>
        </div>
        <div className="fourthSection">
          <h2>Set a base price for your spot</h2>
          <p className="caption">
            Competitive pricing can help your listing stand out and rank higher
            in search results
          </p>
          <p>$</p>
          <input
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            name="price"
          ></input>
          <p className="errors">{errors.price}</p>
        </div>
        <div className="fifthSection">
          <h2>Liven up your spot with photos</h2>
          <p className="caption">
            Submit a link to at least one photo to publish your spot
          </p>
          <div className="images">
            <input
              placeholder="Preview Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              name="image"
            ></input>
            <p className="errors">{errors.image}</p>
            <input placeholder="Image URL"></input>
            <input placeholder="Image URL"></input>
            <input placeholder="Image URL"></input>
            <input placeholder="Image URL"></input>
          </div>
        </div>
        <button
          disabled={Object.values(errors)}
          className="newSpot"
          type="submit"
        >
          Create Spot
        </button>
      </form>
    </div>
  );
};

export default newSpotInput;
