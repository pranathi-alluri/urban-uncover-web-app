import * as client from "./client";
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {
    FaCity,
    FaEdit,
    FaEnvelope,
    FaMap,
    FaMapMarker,
    FaPhone,
    FaSignOutAlt,
    FaUser
} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import './account.css'
import {setCurrentUser} from "./reducer";
import * as LikesClient from "../likes/client"
import * as FollowsClient from "../follows/client"
import "../details.css"
import * as likeClient from "../likes/client";
import * as reviewClient from "../reviews/client";
import Navbar from "../NavBar";

function Account() {
    const {id} = useParams();
    const {currentUser} = useSelector((state) => state.userReducer);
    const [account, setAccount] = useState(null);
    const [usersLike, setUsersLike] = useState([])
    const [reviews, setReviews] = useState([])
    const [userReviews, setUserReviews] = useState([])
    const [likes, setLikes] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const fetchLikes = async () => {
        const likes = await LikesClient.findBusinessesThatUserLikes(account._id);
        setLikes(likes);
    };

    const followUser = async () => {
        const status = await FollowsClient.userFollowsUser(id)
    }

    const unfollowUser = async () => {
        const status = await FollowsClient.userUnfollowsUser(id);

    };

    const fetchFollowers = async () => {
        const followers = await FollowsClient.findFollowersOfUser(account._id);
        setFollowers(followers);
    };

    const fetchFollowing = async () => {
        const following = await FollowsClient.findFollowedUsersByUser(account._id);
        setFollowing(following);
    };

    const alreadyFollowing = () => {
        return currentUser && followers.some((follows) => {
            return follows.follower._id === currentUser._id;
        });
    };

    const fetchBusinessLikes = async () => {
        const users = await likeClient.findUsersThatLikeBusiness(account.claimedBusiness);
        setUsersLike(users)
    }

    const fetchReviews = async () => {
        const reviews = await reviewClient.findReviewsForBusiness(account.claimedBusiness)
        setReviews(reviews)
    }

    const fetchUserReview = async() => {
        const reviews = await reviewClient.findBusinessesThatUserReviewed(account._id);
        setUserReviews(reviews)
    }

    const fetchAccount = async () => {
        const account = await client.account();
        setAccount(account);
    };

    const findUserById = async (id) => {
        const user = await client.findUserById(id);
        setAccount(user);
    };
    const signout = async () => {
        const status = await client.signout();
        navigate("/login");
    };

    const claim = () => {
        navigate("/claimBusiness")
    }

    useEffect(() => {
        if (id) {
            findUserById(id);
        } else {
            fetchAccount();
        }
    }, [id]);

    useEffect(() => {
        // Now, fetchLikes only after account is fetched
        if (account && account._id) {
            fetchLikes();
            fetchFollowers();
            fetchFollowing();
            fetchUserReview();
        }
        if (account && account.claimedBusiness) {
            fetchBusinessLikes();
            fetchReviews();
        }
    }, [account]);
    return (
        <div>
            <Navbar/>
            {!currentUser && !id && (
                navigate("/login")
            )}
            {account && (
                <div>
                    <div className="row justify-content-start top-profile">
                        <div className="col-3">
                            <div className="row text-center profile-container">
                                <FaUser className="profile-icon"/>
                                <h2 className="username">{account.username}</h2>
                                <p>{account.role}</p>
                            </div>
                            {id && currentUser._id !== id && currentUser.role === "USER" && (
                                <div className="row account-info-container">
                                    {alreadyFollowing() ? (
                                        <button onClick={unfollowUser}
                                                className="btn btn-danger float-end">
                                            Unfollow
                                        </button>
                                    ) : (
                                         <button onClick={followUser}
                                                 className="btn btn-warning float-end">
                                             Follow
                                         </button>
                                     )}
                                </div>
                            )}
                            {((account._id === currentUser._id) || (currentUser.role === "ADMIN")) && (
                                <div className="row account-info-container">
                                    <h4 className="account-header"> Account Details:</h4>
                                    <p>
                                        <strong>First Name: </strong>
                                        {account.firstName}
                                    </p>
                                    <p>
                                        <strong>Last Name: </strong>
                                        {account.lastName}
                                    </p>
                                    {account.email && (
                                        <p>
                                            <FaEnvelope className="me-2"/>
                                            <strong>Email:</strong> {account.email}
                                        </p>
                                    )}
                                    {account.phoneNumber && (
                                        <p>
                                            <FaPhone className="me-2"/>
                                            <strong>Phone:</strong> {account.phoneNumber}
                                        </p>
                                    )}
                                    {account.address && (
                                        <div>
                                            <p>
                                                <FaMapMarker className="me-2"/>
                                                <strong>Address:</strong> {account.address.street}
                                            </p>
                                            <p>
                                                <FaCity className="me-2"/>
                                                <strong>City:</strong> {account.address.city}
                                            </p>
                                            <p>
                                                <FaMap className="me-2"/>
                                                <strong>State:</strong> {account.address.state}
                                            </p>
                                        </div>
                                    )}
                                    {(account._id === currentUser._id) && (
                                    <div className="row">
                                        <div className="col">
                                            <Link to={`/profile/edit`}
                                                  className="btn btn-primary me-2 mb-2">
                                                <FaEdit className="me-2"/>
                                                Edit
                                            </Link>
                                            <button className="btn btn-danger" onClick={signout}>
                                                <FaSignOutAlt className="me-2"/>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div> )}
                                </div>
                            )}
                        </div>
                        <div className="col content-container">
                            {account.role === 'USER' && (
                                <div>
                                    <h4 className="section-header m-2">Reviews</h4>
                                    <hr/>
                                    {userReviews.length === 0 && (
                                        <div>
                                        <h6 className="m-2"> NO REVIEWS YET</h6>
                                        </div>
                                    )}
                                    <ul className="list-group">
                                        {userReviews.length > 0 && (
                                            userReviews.map((review, index) => (
                                                <Link
                                                    key={index}
                                                    className="list-group-item m-2"
                                                    to={`/details/${review.businessId}`}
                                                >
                                                    <h5 >{account.username}'s review for {review.businessName}</h5>
                                                    <p>
                                                        <strong
                                                            className="me-2">Rating:</strong>
                                                        {review.rating}
                                                    </p>
                                                    <p>
                                                        <strong
                                                            className="me-2">Comment:</strong>
                                                        {review.comment}
                                                    </p>
                                                </Link>
                                            )
                                        ))}
                                    </ul>

                                    <h4 className="section-header mb-2">Likes</h4>
                                    <hr/>
                                    {likes.length === 0 && (
                                        <h6> NO LIKES YET</h6>
                                    )}
                                    <div className="row row-cols-1 ">
                                        {likes.length > 0 && (
                                            likes.map((like, index) => (
                                                <div key={index} className="col mb-3">
                                                    <Link to={`/details/${like.businessId}`}
                                                          className="card-link">
                                                        <img src={like.businessImage}
                                                             alt={like.businessName}
                                                             className="card-img-top"
                                                             style={{height: '300px'}}/>
                                                        <div className="card-body">
                                                            <h5 className="card-title">{like.businessName}</h5>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <h4 className="section-header mb-2">Following</h4>
                                    <hr/>
                                    {following.length === 0 && (
                                        <h6> NOT FOLLOWING ANYONE YET</h6>
                                    )}
                                    <ul className="list-group">
                                        {following.length > 0 && (
                                            following.map((follow, index) => (
                                                <Link
                                                    key={index}
                                                    className="list-group-item"
                                                    to={`/profile/${follow.followed._id}`}
                                                >
                                                    {follow.followed.username}
                                                </Link>
                                            ))
                                        )}
                                    </ul>
                                    <h4 className="section-header mb-2">Followers</h4>
                                    <hr/>
                                    {followers.length === 0 && (
                                        <h6> NO FOLLOWERS YET</h6>
                                    )}
                                    <ul className="list-group">
                                        {followers.length > 0 && (
                                            followers.map((f, index) => (
                                                <Link
                                                    key={index}
                                                    className="list-group-item"
                                                    to={`/profile/${f.follower._id}`}
                                                >
                                                    {f.follower.username}
                                                </Link>
                                            ))
                                        )}
                                    </ul>

                                </div>
                            )}
                            {account.role === 'ADMIN' && (
                                <Link to="/admin/users" className="btn btn-warning m-3">
                                    Manage all Users
                                </Link>
                            )}
                            {account.role === 'BUSINESS' && account.claimedBusiness && (
                                <div>
                                    <Link to={`/details/${account.claimedBusiness}`}
                                          className="btn btn-warning m-2">
                                        Go to Business Page
                                    </Link>
                                    <div className="m-2">
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
                                                        <h4>{r.user.username}'s review </h4>
                                                        <p>
                                                            <strong
                                                                className="me-2">Rating:</strong>
                                                            {r.rating}
                                                        </p>
                                                        <p>
                                                            <strong
                                                                className="me-2">Comment:</strong>
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
                                </div>
                            )}
                            {currentUser.role === 'BUSINESS' && !currentUser.claimedBusiness
                             && (
                                 <button className="btn btn-warning" onClick={claim}>
                                     Claim business
                                 </button>
                             )}
                        </div>
                        )}
                    </div>
                </div>
            )}
        </div>)
};

export default Account;