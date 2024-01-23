import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { createASpot, newSpotImage } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import "./NewSpotForm.css";

const NewSpotInput = () => {
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState({
    url: "",
    preview: false,
  });
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
      errs.lat = "*Latitude is required";
    }
    if (lng < 1) {
      errs.lng = "*Longititude is required";
    }
    if (description.length < 30) {
      errs.description = "*Description needs a minimum of 30 characters";
    }
    if (!name) {
      errs.title = "*Name is required";
    }
    if (price < 1) {
      errs.price = "*Price is required";
    }
    if (!previewImage) {
      errs.previewImage = "*Preview Image is required";
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
    name,
    price,
    previewImage,
  ]);

  // const spotId = useSelector(state => state.spots.spot.id)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const spot = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      previewImage,
    };

    navigate(`/spot/${spotId}`);
    reset();

    dispatch(createASpot(spot))
    .then((spot) => dispatch(newSpotImage(spot.id, spot.previewImage)))
  };

  const reset = () => {
    setCountry("");
    setAddress("");
    setCity("");
    setState("");
    setLat(0);
    setLng(0);
    setDescription("");
    setName("");
    setPrice("");
    setPreviewImage({
      url: "",
      preview: false,
    });
  };

  const testForm = () => {
    setCountry("testCountry");
    setAddress("testAddress");
    setCity("testCity");
    setState("testState");
    setLat(1);
    setLng(1);
    setDescription("This is a test description for the testSpot");
    setName("testSpot8");
    setPrice(11.11);
    setPreviewImage({
      url: "https://www.tygerauto.com/mm5/graphics/photos/test-sku.jpg",
      preview: true,
    });
  };

  return (
    <div>
      <h1 className="pageTitle">Create a new Spot</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="firstSection">
          <h2>Where&apos;s your place located?</h2>
          <p className="caption">
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label>
            Country
            <p className="errors">{errors.country}</p>
            <input
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              name="country"
            ></input>
          </label>
          <label>
            Street Address
            <p className="errors">{errors.address}</p>
            <input
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              name="address"
            ></input>{" "}
          </label>
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
            Catch guests&apos; attention with a spot title that highlights what
            makes your place special.
          </p>
          <input
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              value={previewImage.url}
              onChange={(e) =>
                setPreviewImage({
                  url: e.target.value,
                  preview: true,
                })
              }
              name="image"
            ></input>
            <p className="errors">{errors.previewImage}</p>
            <input placeholder="Image URL"></input>
            <input placeholder="Image URL"></input>
            <input placeholder="Image URL"></input>
            <input placeholder="Image URL"></input>
          </div>
        </div>
        <button type="submit" className="newSpot">
          Create Spot
        </button>
      </form>
      <button onClick={testForm} className="newSpot">
        Test Spot
      </button>
    </div>
  );
};

export default NewSpotInput;
