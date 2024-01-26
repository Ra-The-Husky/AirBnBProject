import { useDispatch } from "react-redux"
import OpenModalButton from "../../OpenModalButton/OpenModalButton"
import { useEffect } from "react"
import { getUserReviews } from "../../../store/reviews"

function UserReviews(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserReviews())
    }, [])

    return (
        <h1>Here lies all the user reviews to manage</h1>
    )
}

export default UserReviews
