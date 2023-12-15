import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./nav.css"

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.userReducer);

    return (
        <nav className="navbar navbar-urban">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    Urban Uncover
                </Link>

                <div className="d-flex align-items-end">
                    {currentUser ? (
                        <Link to="/profile" className="btn btn-primary btn-login me-3">
                            {currentUser.username}
                        </Link>
                    ) : (
                         <Link to="/login" className="btn btn-primary btn-login me-3">
                             Login
                         </Link>
                     )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;