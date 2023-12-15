import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom"
import "./search.css"
import "./users/login.css"
import {useSelector} from "react-redux";
import * as reviewClient from "./reviews/client";
import * as followClient from "./follows/client";
import * as likesClient from "./likes/client"
import * as likeClient from "./likes/client";
import * as userClient from "./users/client";
import "./home.css"
import Navbar from "./NavBar";

function Home() {
    const [search, setSearch] = useState({term: "", location: ""});
    const navigate = useNavigate();
    const {currentUser} = useSelector((state) => state.userReducer);
    const [userReviews, setUserReviews] = useState([]);
    const [userLikes, setUserLikes] = useState([]);
    const [recentUsers, setRecentUsers] = useState([])
    const [error, setError] = useState("");
    const [followBack, setFollowBack] = useState([])

    const fetchBusinessDynamic = async () => {
        try {
            const users = await likeClient.findUsersThatLikeBusiness(currentUser.claimedBusiness);
            const reviews = await reviewClient.findReviewsForBusiness(currentUser.claimedBusiness);
            setUserLikes(users)
            setUserReviews(reviews)
        } catch (err) {
            setError("Please claim business to view dashboard.")
        }
    }

    const fetchAdminDynamic = async () => {
        const users = await userClient.findAllUsers();
        setRecentUsers(users)
    }

    const fetchDynamic = async () => {
        if (currentUser) {
            if (currentUser.role === "USER") {
                const likes = await likesClient.findBusinessesThatUserLikes(currentUser._id)
                setUserLikes(likes);
                const followers = await followClient.findFollowersOfUser(currentUser._id)
                const following = await followClient.findFollowedUsersByUser(currentUser._id)
                const followersNotFollowedBack =
                    followers
                        .filter(follows => !following.some(
                            followed => followed.followed._id === follows.follower._id))
                setFollowBack(followersNotFollowedBack)
            }
            if (currentUser.role === "BUSINESS") {
                fetchBusinessDynamic()
            }
            if (currentUser.role === "ADMIN") {
                fetchAdminDynamic()
            }
        } else {
            const allLikes = await likesClient.findAllLikes()
            setUserLikes(allLikes)
        }
    };

    useEffect(() => {
        fetchDynamic()

    }, [currentUser]);

    return (
        <div>
            <Navbar/>
            <div className="homeContent">
                <div className="m-5">
                    <h2 className="hello text-center">Welcome to Urban Uncover!</h2>
                    <p className="homeSubheader text-center">The go to place to find and review
                        businesses near you!</p>
                </div>
            </div>
            <div className="row search-row">
                <div className="col mb-2">
                    <input
                        type="text"
                        className="form-control search-input "
                        placeholder="Search..."
                        value={search.term}
                        onChange={(event) => {
                            setSearch({...search, term: event.target.value});
                        }}
                    />
                </div>
                <div className="col mb-2">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Location"
                        value={search.location}
                        onChange={(event) => {
                            setSearch({...search, location: event.target.value});
                        }}
                    />
                </div>
                <button
                    onClick={() => navigate(
                        `/search?term=${search.term}&location=${search.location}`)}
                    className="btn btn-primary search-button"
                >
                    Search
                </button>
                {(!currentUser || currentUser.role === "USER") && (
                    <div className="content-container m-3">
                        {currentUser && currentUser.role === "USER" && (
                            <div>
                                {currentUser.role === "USER" && (
                                    <div className="m-2">
                                        <h4 className="section-header m-2">Follow These Users
                                            Back</h4>
                                        <hr/>
                                        {followBack.length === 0 && (
                                            <h6 className="m-2"> NO ONE TO FOLLOW BACK</h6>
                                        )}
                                        <ul className="list-group">
                                            {followBack.length > 0 && (
                                                followBack.map((user, index) => (
                                                    <Link
                                                        key={index}
                                                        className="list-group-item m-2"
                                                        to={`/profile/${user.follower._id}`}
                                                    >
                                                        <h6>{user.follower.username}</h6>
                                                    </Link>
                                                ))
                                            )}
                                        </ul>
                                    </div>)}
                                <h4 className="section-header mb-2">Your top businesses!</h4>
                            </div>
                        )}
                        {!currentUser &&
                         <h4 className="section-header mb-2">Businesses to check out!</h4>
                        }
                        <hr/>
                        {userLikes.length === 0 && (
                            <h6> Follow and like more users for personal recommendations</h6>
                        )}
                        <div className="row">
                            {userLikes.length > 0 && (
                                userLikes.slice(-5).map((like, index) => (
                                    <div key={index} className="col">
                                        <Link to={`/details/${like.businessId}`}
                                              className="card-link">
                                            <img src={like.businessImage}
                                                 alt={like.businessName}
                                                 className="card-img-top"
                                                 style={{height: '45%'}}/>
                                            <div className="card-body">
                                                <h5 className="card-title">{like.businessName}</h5>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}


                {currentUser.role === "ADMIN" && (
                    <div className="m-2">
                        <h4 className="section-header m-2">Recent Users</h4>
                        <hr/>
                        {recentUsers.length === 0 && (
                            <h6 className="m-2"> NO RECENT ACTIVITY</h6>
                        )}
                        <ul className="list-group">
                            {recentUsers.length > 0 && (
                                recentUsers.slice(-5).map((user, index) => (
                                    <Link
                                        key={index}
                                        className="list-group-item m-2"
                                        to={`/profile/${user._id}`}
                                    >
                                        <h6>{user.username}</h6>
                                    </Link>
                                ))
                            )}
                        </ul>

                    </div>)}
                {currentUser.role === "BUSINESS" && (
                    <div className="m-2">
                        {error && <div className="error">{error}</div>}
                        <h4 className="section-header m-2">Your Reviews</h4>
                        <hr/>
                        {userReviews.length === 0 && (
                            <h6 className="m-2"> NO REVIEWS YET</h6>
                        )}
                        <ul className="list-group">
                            {userReviews.length > 0 && (
                                userReviews.map((r, index) => (
                                    <Link
                                        key={index}
                                        className="list-group-item m-2"
                                        to={`/profile/${r.user._id}`}
                                    >
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


                        <h4 className="section-header m-2"> Your Likes</h4>
                        <hr/>
                        {userLikes.length === 0 && (
                            <h6 className="m-2"> NO LIKES YET</h6>
                        )}
                        <ul className="list-group">
                            {userLikes.length > 0 && (
                                userLikes.map((users, index) => (
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
        </div>
    )
        ;
}

export default Home;