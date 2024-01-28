import { useDispatch } from "react-redux";
import { useState} from "react";
import { createASpot, newSpotImage } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import "./CreateSpot.css";

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
    imageableType: "Spot",
  });
  const [extraImageOne, setExtraImageOne] = useState({
    url: "",
    preview: false,
    imageableType: "Spot",
  });
  const [extraImageTwo, setExtraImageTwo] = useState({
    url: "",
    preview: false,
    imageableType: "Spot",
  });
  const [extraImageThree, setExtraImageThree] = useState({
    url: "",
    preview: false,
    imageableType: "Spot",
  });
  const [extraImageFour, setExtraImageFour] = useState({
    url: "",
    preview: false,
    imageableType: "Spot",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
    // const validTypes = ["jpg", "png", "jpeg"];
    // const errs = {};
    // if (!previewImage.url) {
    //   errs.previewImage = "*Preview image is required";
    // }
    // if (previewImage.url.includes(validTypes)) {
    //   errs.previewImage = "*Image URL must end in .jpg, .png, or .jpeg";
    // }
    // if (!extraImageOne.url.includes(validTypes)) {
    //   errs.extraImage = "*Image URL must end in .jpg, .png, or .jpeg";
    // }
    // if (!extraImageTwo.url.includes(validTypes)) {
    //   errs.extraImage = "*Image URL must end in .jpg, .png, or .jpeg";
    // }
    // if (!extraImageThree.url.includes(validTypes)) {
    //   errs.extraImage = "*Image URL must end in .jpg, .png, or .jpeg";
    // }
    // if (!extraImageFour.url.includes(validTypes)) {
    //   errs.extraImage = "*Image URL must end in .jpg, .png, or .jpeg";
    // }
    // setErrors(errs);
  // }, [previewImage]);

  // const spotId = useSelector((state) => state.spots.spot?.id);

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

    const moreImages = [];
    moreImages.push(
      extraImageOne,
      extraImageTwo,
      extraImageThree,
      extraImageFour
    );

    // if (Object.values(errors)) {
    //   return console.log(errors);
    // } else {
      dispatch(createASpot(spot))
        .then((confirmedSpot) => {
          dispatch(newSpotImage(confirmedSpot.id, spot.previewImage));
          return confirmedSpot;
        })
        .then((newSpot) => {
          if (moreImages.length) {
            moreImages.map((image) =>
            dispatch(newSpotImage(newSpot.id, image))
            );
          }
          navigate(`/spots/${newSpot.id}`);
          reset();
        })
        .catch(async (res) => {
          const data = await res.json();
          console.log("ooof caught an error or two?", {
            errors: data.errors,
          });
          setErrors(data.errors);
        });
    // }
  };

  const reset = () => {
    setCountry("");
    setAddress("");
    setCity("");
    setState("");
    setLat("");
    setLng("");
    setDescription("");
    setName("");
    setPrice("");
    setPreviewImage({
      url: "",
      preview: false,
      imageableType: "Spot",
      imageableId: "",
    });
    setExtraImageOne({
      url: "",
      preview: false,
      imageableType: "Spot",
      imageableId: "",
    });
    setExtraImageTwo({
      url: "",
      preview: false,
      imageableType: "Spot",
      imageableId: "",
    });
    setExtraImageThree({
      url: "",
      preview: false,
      imageableType: "Spot",
      imageableId: "",
    });
    setExtraImageFour({
      url: "",
      preview: false,
      imageableType: "Spot",
      imageableId: "",
    });
  };

  const testForm = () => {
    setCountry("United States");
    setAddress("347 Newluc Circle");
    setCity("Dreamingale");
    setState("FL");
    setLat(Math.random() * 100);
    setLng(Math.random() * -100);
    setDescription("A real dream come true. Relax in this luxurious modern home in a peaceful quiet neighborhood");
    setName("Chill Haven");
    setPrice(Math.round(Math.random() * 500));
    setPreviewImage({
      url: "https://i.pinimg.com/736x/b6/8b/c3/b68bc3b9d5ff27f7c0c874819e64e322.jpg",
      preview: true,
      imageableType: "Spot",
    });
    setExtraImageOne({
      url: "https://media.designcafe.com/wp-content/uploads/2023/07/05195443/modern-interior-design.jpg",
      preview: true,
      imageableType: "Spot",
    });
    setExtraImageTwo({
      url: "https://media.designcafe.com/wp-content/uploads/2019/12/20235313/modern-bathroom-designs-for-your-home.jpg",
      preview: true,
      imageableType: "Spot",
    });
    setExtraImageThree({
      url: "https://cdn.homedit.com/wp-content/uploads/2014/01/modern-white-large-dining-table.jpg",
      preview: true,
      imageableType: "Spot",
    });
    setExtraImageFour({
      url: "https://media.designcafe.com/wp-content/uploads/2019/12/20234901/master-bedroom-design-for-your-home-4.jpg",
      preview: true,
      imageableType: "Spot",
    });
  };

  return (
    <div className="formPage">
      <h1 className="pageTitle">Create a new Spot</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="firstSection">
          <h2>Where&apos;s your place located?</h2>
          <p className="caption">
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <div className="countryAddress">
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
          </div>
          <div className="cityState">
            <label className="city">
              City
              <p className="errors">{errors.city}</p>
              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                name="city"
              ></input>
              {", "}
            </label>

            <label className="state">
              State
              <p className="errors">{errors.state}</p>
              <input
                placeholder="STATE"
                value={state}
                onChange={(e) => setState(e.target.value)}
                name="state"
              ></input>
            </label>
          </div>
          <div className="latLng">
            <label>
              Latitude
              <p className="errors">{errors.lat}</p>
              <input
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                name="lat"
              ></input>
              {","}
            </label>
            <label>
              longitude
              <p className="errors">{errors.lng}</p>
              <input
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                name="lng"
              ></input>
            </label>
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
                  imageableType: "Spot",

                })
              }
              name="preview image"
            ></input>
              {errors.previewImage && <p className="errors">{errors.previewImage}</p>}
            <input
              placeholder="Image URL"
              value={extraImageOne.url}
              onChange={(e) =>
                setExtraImageOne({
                  url: e.target.value,
                  preview: true,
                  imageableType: "Spot",
                })
              }
              name="extra image one"
            ></input>
            {/* <p className="errors">{errors.extraImage}</p> */}
            <input
              placeholder="Image URL"
              value={extraImageTwo.url}
              onChange={(e) =>
                setExtraImageTwo({
                  url: e.target.value,
                  preview: true,
                  imageableType: "Spot",
                })
              }
              name="extra image two"
            ></input>
            <input
              placeholder="Image URL"
              value={extraImageThree.url}
              onChange={(e) =>
                setExtraImageThree({
                  url: e.target.value,
                  preview: true,
                  imageableType: "Spot",
                })
              }
              name="extra image three"
            ></input>
            <input
              placeholder="Image URL"
              value={extraImageFour.url}
              onChange={(e) =>
                setExtraImageFour({
                  url: e.target.value,
                  preview: true,
                  imageableType: "Spot",
                })
              }
              name="extra image four"
            ></input>
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
