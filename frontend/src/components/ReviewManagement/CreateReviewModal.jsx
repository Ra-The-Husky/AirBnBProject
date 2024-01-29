import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import StarRating from './StarRating'
import { createAReview } from "../../store/reviews";
import './ReviewModal.css'

function ReviewSpotModal({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const sessionUser = useSelector(state => state.session.user);

    const [firstName, setFirstName] = useState('')
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
      e.preventDefault();

      setErrors({})

      if(sessionUser) setFirstName(sessionUser.firstName)
      const newReview = {
        review,
        stars,
        firstName: firstName
      }

      await dispatch(createAReview(spotId, newReview))
      .then(closeModal)
      .catch(async (response) => {
        const data = await response.json();
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
        <h1>How was your stay?</h1>
        <form className='profileForm' onSubmit={handleSubmit}>
          {errors.review && <span className='errors'>{errors.review}</span>}
          {errors.stars && <span className='errors'>{errors.stars}</span>}
          <textarea
          className="input"
            placeholder='Leave your review here...'
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="4"
          />
          <div className="stars">

          <StarRating
            onChange={onChange}
            stars={stars}
            className='stars'
            />
          </div>
          <button type='submit' className='button' disabled={(review.length < 10) || (!stars)}>Submit Your Review</button>

        </form>
      </div>
    )
  }

export default ReviewSpotModal;
