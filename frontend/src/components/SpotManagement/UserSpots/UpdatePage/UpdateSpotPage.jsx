import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { editSpot, getOneSpot } from "../../../../store/spots";
import { useNavigate, useParams } from "react-router-dom";

const EditSpotInput = () => {
  const spotInfo = useSelector((state) => state.spots.spot?.spot);
  // console.log('spotInfo', spotInfo)
  // const spotImages = useSelector((state) => state.spots.spot?.spot?.SpotImages);
  // console.log(spotImages)
  const { spotId } = useParams();
  const [country, setCountry] = useState(spotInfo?.country);
  const [address, setAddress] = useState(spotInfo?.address);
  const [city, setCity] = useState(spotInfo?.city);
  const [state, setState] = useState(spotInfo?.state);
  const [lat, setLat] = useState(spotInfo?.lat);
  const [lng, setLng] = useState(spotInfo?.lng);
  const [description, setDescription] = useState(spotInfo?.description);
  const [name, setName] = useState(spotInfo?.name);
  const [price, setPrice] = useState(spotInfo?.price);
  // const [previewImage, setPreviewImage] = useState({
  //   url: spotImages[0]?.url,
  //   preview: spotImages[0]?.preview,
  //   imageableType: "Spot",
  // });
  // const [extraImageOne, setExtraImageOne] = useState({
  //   url: spotImages[1]?.url,
  //   preview: spotImages[1]?.preview,
  //   imageableType: spotImages[1]?.url.imageableType,
  // });
  // const [extraImageTwo, setExtraImageTwo] = useState({
  //   url: spotImages[2]?.url,
  //   preview: spotImages[2]?.preview,
  //   imageableType: spotImages[2]?.url.imageableType,
  // });
  // const [extraImageThree, setExtraImageThree] = useState({
  //   url: spotImages[3]?.url,
  //   preview: spotImages[3]?.preview,
  //   imageableType: spotImages[3]?.url.imageableType,
  // });
  // const [extraImageFour, setExtraImageFour] = useState({
  //   url: spotImages[4]?.url,
  //   preview: spotImages[4]?.preview,
  //   imageableType: spotImages[4]?.url.imageableType,
  // });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const validTypes = ["jpg", "png", "jpeg"];
  //   const errs = {};
  //   if (!previewImage) {
  //     errs.previewImage = "*Preview image is required";
  //   }
  //   if (previewImage.url.includes(validTypes)) {
  //     errs.previewImage = "*Image URL must end in .jpg, .png, or .jpeg";
  //   }
  //   if (!extraImageOne.url.includes(validTypes)) {
  //     errs.extraImage = "*Image URL must end in .jpg, .png, or .jpeg";
  //   }
  //   if (!extraImageTwo.url.includes(validTypes)) {
  //     errs.extraImage = "*Image URL must end in .jpg, .png, or .jpeg";
  //   }
  //   if (!extraImageThree.url.includes(validTypes)) {
  //     errs.extraImage = "*Image URL must end in .jpg, .png, or .jpeg";
  //   }
  //   if (!extraImageFour.url.includes(validTypes)) {
  //     errs.extraImage = "*Image URL must end in .jpg, .png, or .jpeg";
  //   }
  //   setErrors(errs);
  // }, [
  //   dispatch,
  //   previewImage,
  //   extraImageOne,
  //   extraImageTwo,
  //   extraImageThree,
  //   extraImageFour,
  // ]);

  useEffect(() => {
    dispatch(getOneSpot(spotId));
  }, [dispatch, spotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const edits = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      // previewImage,
    };

    // const moreImages = [];
    // moreImages.push(
    //   extraImageOne,
    //   extraImageTwo,
    //   extraImageThree,
    //   extraImageFour
    // );

    dispatch(editSpot(spotId, edits))
      .then((editedSpot) => {
        // dispatch(newSpotImage(editedSpot.id, spot.previewImage));
        navigate(`/spots/${editedSpot.id}`);
        // return editedSpot;
      })
      // .then(() => {
      //   if (moreImages.length) {
      //     moreImages.map((image) => dispatch(newSpotImage(newSpot.id, image)));
      //   }
      // })
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <div>
        <h1 className="pageTitle">Update Your Spot</h1>
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
              Mention the best features of your space, any special amenities
              like fast wifi or parking, and what you love about the
              neighborhood.
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
              Catch guests&apos; attention with a spot title that highlights
              what makes your place special.
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
              Competitive pricing can help your listing stand out and rank
              higher in search results
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
          {/* <div className="fifthSection">
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
              <p className="errors">previewImage?{errors.previewImage}</p>
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
              <p className="errors">right file type? {errors.extraImage}</p>
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
          </div> */}
          <button type="submit" className="submitButton">
            Create Spot
          </button>
        </form>
      </div>
    </>
  );
};

export default EditSpotInput;
