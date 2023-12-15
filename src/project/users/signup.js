import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as client from "./client";
import Nav from "./Nav";
import {useDispatch} from "react-redux";
import {setCurrentUser} from "./reducer";
import "./login.css"
function Signup() {
    const [error, setError] = useState("");
    const [credentials, setCredentials] = useState({
                                                       username: "", password: "" , firstName: "", lastName: ""});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const signup = async () => {
        try {
            const user = await client.signup(credentials);
            dispatch(setCurrentUser(user))
            navigate("/profile");
        } catch (err) {
            setError(err.response.data.message);
        }
    };
    return (
        <div className="container">
            <Nav/>
            <div className="form-container">
            <h1 className="login-heading">Signup</h1>
            {error && <div className="error">{error}</div>}
            <div className="row">
                <div className="col">
                    <input type="text"
                           className="form-control login-input"
                           name="firstName"
                           placeholder="Fist Name"
                           value={credentials.firstName}
                           onChange={(e) => setCredentials({
                                                               ...credentials,
                                                               firstName: e.target.value })}
                           required/>
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="form-control login-input"
                        name="lastName"
                        placeholder="Last name"
                        onChange={(e) => setCredentials({
                                                            ...credentials,
                                                            lastName: e.target.value })}
                        required/>
                </div>
            </div>

            <input
                value={credentials.username}
                className="form-control login-input"
                placeholder="Username"
                onChange={(e) => setCredentials({
                                                    ...credentials,
                                                    username: e.target.value })}
            required/>

            <input
                value={credentials.password}
                className="form-control login-input"
                type="password"
                placeholder="Password"
                onChange={(e) => setCredentials({
                                                    ...credentials,
                                                    password: e.target.value })}
            required/>

            <div>
                <label className="form-label me-3"> Role: </label>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="role" id="userRadio"
                           value="USER"
                           onChange={(e) => setCredentials({
                                                               ...credentials,
                                                               role: e.target.value})}/>
                        <label className="form-check-label" for="userRadio">User</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="role"
                           id="businessRadio" value="BUSINESS"
                           onChange={(e) => setCredentials({
                                                               ...credentials,
                                                               role: e.target.value})}/>
                        <label className="form-check-label" for="businessRadio">Business</label>
                </div>
            </div>
            <button className="btn btn-primary login-button" onClick={signup}>
                Signup
            </button>
            </div>
        </div>
    );
}
export default Signup;