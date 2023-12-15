import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import * as client from "./client";
import * as userClient from "./users/client"
import * as reviewClient from "./reviews/client"
import * as likeClient from "./likes/client"
import {useDispatch, useSelector} from "react-redux";
import {BiMap, BiPhone} from "react-icons/bi";
import "./details.css"
import Navbar from "./NavBar";

function Details() {
    const [business, setBusiness] = useState(null);
    const [usersLike, setUsersLike] = useState([])
    const [reviews, setReviews] = useState([])
    const [reviewState, setReviewState] = useState({rating: 0, comment: null})
    const {businessId} = useParams();
    const { currentUser } = useSelector((state) => state.userReducer);

    const fetchBusiness = async () => {
        const business = await client.findBusinessById(businessId);
        setBusiness(business)
    }

    const likeBusiness = async() => {
        const like = await likeClient.createUserLikesBusiness(
            currentUser._id, businessId, business.name, business.image_url
        )
    }

    const unlikeBusiness = async() => {
        const status = await likeClient.deleteUserLikesBusiness(
            currentUser._id, businessId
        )
    }

    const fetchLikes = async () => {
        const users = await likeClient.findUsersThatLikeBusiness(businessId);
        setUsersLike(users)
    }

    const reviewBusiness = async() => {
        const review = await reviewClient.createUserReviewsBusiness(currentUser._id, businessId, business.name, reviewState)
    }

    const deleteReview = async() => {
        const status = await reviewClient.deleteUserReview(currentUser._id, businessId)
    }

    const fetchReviews = async() => {
        const reviews = await reviewClient.findReviewsForBusiness(businessId)
        setReviews(reviews)
    }


    const alreadyLiked = () => {
        return usersLike.some((users) => {
            return users.user._id === currentUser._id;
        });
    };

    const alreadyReviewed = () => {
        return reviews.some((users) => {
            return users.user._id === currentUser._id;
        });
    }

    useEffect(() => {
        fetchBusiness();
        fetchLikes();
        fetchReviews();

    }, [businessId]);


    return (
        <div>
            <Navbar/>
            {business && (
                <div>
                    {currentUser && currentUser.role === "USER" && (
                        <div className="float-end me-3">
                            {alreadyLiked() ? (
                                <button onClick={unlikeBusiness} className="btn btn-danger me-2">
                                    Unlike
                                </button>
                            ) : (
                                 <button onClick={likeBusiness} className="btn btn-warning me-2">
                                     Like
                                 </button>
                             )}
                        </div>
                    )}
                    <div className="details-container">
                        <div className="row">
                            <div className="col">
                                <img src={business.image_url}
                                     alt={business.name}
                                     className="img-fluid"
                                     />
                            </div>
                            <div className="col">
                                <h1 className="detailName">{business.name}</h1>
                                {business.display_phone && (
                                    <p>
                                        <BiPhone className="me-2 detail-label" />
                                        {business.display_phone}
                                    </p>

                                )}
                                {business.categories && (
                                    <ul className="list-group mb-3">
                                        <strong className="detail-label"> Offered Cuisine: </strong>
                                        {business.categories.map((category, index) => (
                                            <li key={index} className="list-group-item">
                                                {category.title}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {business.location && (
                                    <p>
                                        <BiMap className="me-2 detail-label" />
                                        {business.location.display_address.join(", ")}
                                    </p>
                                )}
                                {business.price && (
                                    <p>
                                        <strong className="detail-label">Price: </strong>
                                        {business.price}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <hr/>
                    {currentUser && currentUser.role === "USER" && (
                        <div className="m-3">
                            <input
                                value={reviewState.rating}
                                className="form-control login-input"
                                placeholder="Rating out of 5"
                                onChange={(e) => setReviewState({
                                                                    ...reviewState,
                                                                    rating: e.target.value })}/>
                            <input
                                value={reviewState.comment}
                                className="form-control login-input"
                                placeholder="Review comment"
                                onChange={(e) => setReviewState({
                                                                    ...reviewState,
                                                                    comment: e.target.value })}/>
                            {alreadyReviewed() ? (
                                <button onClick={deleteReview} className="btn btn-danger me-2">
                                    Delete Review
                                </button>
                            ) : (
                                 <button onClick={reviewBusiness} className="btn btn-warning me-2">
                                     Review Business
                                 </button>
                             )}
                        </div>
                    )}
                    <h4 className="section-header m-2">Reviews</h4>
                    <hr/>
                    {reviews.length === 0 && (
                        <h6 className="m-2"> NO REVIEWS YET</h6>
                    )}
                    <ul className="list-group">
                        {reviews.length > 0 && (
                            reviews.map((r, index) => (
                                <Link
                                    key={index}
                                    className="list-group-item m-2"
                                    to={`/profile/${r.user._id}`}
                                >
                                    <h5 >{r.user.username}'s review for {business.name}</h5>
                                    <p>
                                        <strong className="me-2">Rating:</strong>
                                        {r.rating}
                                    </p>
                                    <p>
                                        <strong className="me-2">Comment:</strong>
                                        {r.comment}
                                    </p>
                                </Link>
                            ))
                        )}
                    </ul>


                    <h4 className="section-header m-2">Likes</h4>
                    <hr/>
                    {usersLike.length === 0 && (
                        <h6 className="m-2"> NO LIKES YET</h6>
                    )}
                    <ul className="list-group">
                        {usersLike.length > 0 && (
                            usersLike.map((users, index) => (
                                <Link
                                    key={index}
                                    className="list-group-item m-2"
                                    to={`/profile/${users.user._id}`}
                                >
                                    {users.user.username}
                                </Link>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    )





}

export default Details;