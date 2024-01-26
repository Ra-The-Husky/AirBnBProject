import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useState, useSelector } from "react";
import { updateReview } from "../../store/reviews";
import StarRating from '../SpotInfo/StarRating'

function UpdateReviewModal() {
    const dispatch = useDispatch();

    const { closeModal } = useModal();

    const spot = useSelector(state => state.spots)

    const spotId = ((Object.keys(spot).join()))

    const sessionUser = useSelector(state => state.session.user);

    const [firstName, setFirstName] = useState(sessionUser.firstName)
    const [review, setReview] = useState(review);
    const [stars, setStars] = useState(stars)
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
      e.preventDefault();

      setErrors({})

      if(sessionUser) setFirstName(sessionUser.firstName)

      const edits = {
        review,
        stars,
        firstName: firstName
      }
      await dispatch(updateReview(spotId, edits))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors)
        }
      })

    }

    const onChange = (number) => {
      setStars(parseInt(number))
    }

    return (
      <div className='reviewForm'>
        <h1>How was your stay at {spot.name}?</h1>
        <form onSubmit={handleSubmit}>
          {errors.review && <span className='errors'>{errors.review}</span>}
          {errors.stars && <span className='errors'>{errors.stars}</span>}
          <textarea

            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="4"
          />
          <StarRating
            onChange={onChange}
            stars={stars}
            />
          <button type='submit' disabled={(review.length < 10) || (!stars)}>Submit Your Review</button>

        </form>
      </div>
    )
  }

export default UpdateReviewModal;
