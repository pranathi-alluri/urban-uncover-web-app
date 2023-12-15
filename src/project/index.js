import Home from "./home"
import {Routes, Route, Link, Navigate} from "react-router-dom"
import {Provider} from "react-redux";
import Details from "./details";
import Search from "./search";
import Login from "./users/login";
import Signup from "./users/signup";
import Account from "./users/account";
import EditAccount from "./users/edit";
import UserDashboard from "./users/usersDashboard";
import ClaimBusiness from "./users/claimBusiness";
import store from "./store";
import CurrentUser from "./users/currentUser";

function Project() {
    return (
        <Provider store={store}>
            <CurrentUser>
                <div>
                    <Routes>
                        <Route path="/" element={<Navigate to="home"/>}/>
                        <Route path="home" element={<Home/>}/>
                        <Route path="search" element={<Search/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="register" element={<Signup/>}/>
                        <Route path="claimBusiness" element={<ClaimBusiness/>}/>
                        <Route path="profile" element={<Account/>}/>
                        <Route path="profile/:id" element={<Account/>}/>
                        <Route path="profile/edit" element={<EditAccount/>}/>
                        <Route path="details/:businessId" element={<Details/>}/>
                        <Route path="/admin/users" element={<UserDashboard/>}/>
                        <Route path="/admin/users/:userId" element={<UserDashboard/>}/>
                    </Routes>
                </div>
            </CurrentUser>
        </Provider>
    );
}

export default Project;