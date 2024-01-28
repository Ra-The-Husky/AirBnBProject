import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { editReview } from "../../store/reviews";
import StarRating from './StarRating'

function ReviewSpotModal({reviewInfo, spotName}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector(state => state.session.user);

  const [firstName, setFirstName] = useState(sessionUser.name)
  const [review, setReview] = useState(reviewInfo.review);
  const [stars, setStars] = useState(reviewInfo.stars)
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

    await dispatch(editReview(reviewInfo.id, edits))
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
      <h1>How was your stay at {spotName}? </h1>
      <form onSubmit={handleSubmit}>
        {errors.review && <span className='errors'>{errors.review}</span>}
        {errors.stars && <span className='errors'>{errors.stars}</span>}
        <textarea
          placeholder='Leave your review here...'
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="4"
        />
        <StarRating
          onChange={onChange}
          stars={stars}
          />
        <button className='submitButton' type='submit' disabled={(review.length < 10) || (!stars)}>Submit Your Review</button>

      </form>
    </div>
  )
}

export default ReviewSpotModal;
