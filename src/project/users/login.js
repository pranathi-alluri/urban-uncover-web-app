import * as client from "./client";
import Nav from "./Nav";
import React, {useEffect, useState} from "react";
import "./login.css"
import { useNavigate } from "react-router-dom";
import {setCurrentUser} from "./reducer";
import {useDispatch} from "react-redux";
function Login() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const login = async () => {
        try {
            const user = await client.signin(credentials);
            dispatch(setCurrentUser(user))
            navigate("/home");
        } catch (error) {
            setError(error.response.data.message)
        }
    };

    const signout = async () => {
        const status = await client.signout();
        dispatch(setCurrentUser(null))
    };

    useEffect(() => {
        signout()
    })
    return (
        <div className="container">
            <Nav/>
            <div className="form-container">
            <h1 className="login-heading">Login</h1>
            {error && <div className="error">{error}</div>}
            <input className="form-control login-input"
                   value={credentials.username}
                   placeholder="Username"
                   onChange={(e) => setCredentials({...credentials, username: e.target.value})}/>
            <input
                type="password"
                className="form-control login-input"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}/>
            <button className="btn btn-primary login-button" onClick={login}> Signin </button>
            </div>
        </div>
    );
}
export default Login;