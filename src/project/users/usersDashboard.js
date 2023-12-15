import React, {useState, useEffect} from "react";
import * as client from "./client";
import {BsFillCheckCircleFill, BsPencil, BsPlusCircleFill, BsTrash3Fill} from "react-icons/bs";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {FaSignOutAlt} from "react-icons/fa";
import Navbar from "../NavBar";

function UserDashboard() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({username: "", password: "", role: "USER", firsName: "", lastName:""});
    const [error, setError] = useState("");
    const [account, setAccount] = useState (null)

    const local = useLocation()
    const query = new URLSearchParams(local.search);

    const find = query.get('find')

    const [findTerm, setFindTerm] = useState(null);
    const navigate = useNavigate();

    const fetchAccount = async () => {
        const account = await client.account();
        setAccount(account);
    };

    const fetchUser = async (find) => {
        const users = await client.findUser(find);
        setUsers(users)
        setFindTerm(find)
    }

    useEffect(() => {
        fetchAccount();
        if (find) {
            fetchUser(find)
        }
    }, [find])

    const createUser = async () => {
        try {
            const newUser = await client.createUser(user);
            setUsers([newUser, ...users]);
        } catch (err) {
            setError(err.response.data.message)
        }
    };

    const selectUser = async (user) => {
        try {
            const u = await client.findUserById(user._id);
            setUser(u);
        } catch (err) {
            setError(err.response.data.message)
        }
    };
    const updateUser = async () => {
        try {
            const status = await client.updateUserAdmin(user);
            setUsers(users.map((u) => (u._id === user._id ? user : u)));
        } catch (err) {
            setError(err.response.data.message)
        }
    };

    const deleteUser = async (user) => {
        try {
            await client.deleteUser(user);
            setUsers(users.filter((u) => u._id !== user._id));
        } catch (err) {
            setError(err.response.data.message)
        }
    };
    return (
        <div>
            <Navbar/>
            {!account && (
                <button className="btn btn-danger" onClick={() => {navigate('/login')}}>
                    <FaSignOutAlt className="me-2"/>
                    Log in
                </button>
            )}
            {account && account.role !== "ADMIN"  && (
                <h2>Unauthorized</h2>
            )}
            {account && account.role === "ADMIN" && (
                <div>
            <h1 className="m-2">User Dashboard</h1>
            <h2 className="m-3">User Search</h2>
            <div>
                <button
                    onClick={() => navigate(
                        `/admin/users?find=${findTerm}`)}
                    className="btn btn-primary float-end me-3"
                >
                    Search
                </button>
                <input
                    type="text"
                    className="form-control w-75 m-3"
                    placeholder="Search for users ..."
                    value={findTerm}
                    onChange={(event) => {
                        setFindTerm(event.target.value);
                    }}
                />
            </div>
            <h2 className="m-4">Results</h2>
            {error && <div className="alert alert-danger w-50">{error}</div>}
            <table className="table m-3">
                <thead>
                <tr>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="text-nowrap">
                        <div className="row">
                            <div className="col">
                                <input placeholder="Username" className="form-control"
                                       value={user.username}
                                       onChange={(e) => setUser(
                                    {...user, username: e.target.value})}
                                requried/>
                            </div>
                            <div className="col">
                                <input placeholder="Password" className="form-control"
                                       type="password" value={user.password}
                                       onChange={(e) => setUser(
                                           {...user, password: e.target.value})}
                                required/>
                            </div>
                        </div>
                    </td>
                    <td>
                        <input className="form-control" value={user.firstName}
                               onChange={(e) => setUser({...user, firstName: e.target.value})} required/>
                    </td>
                    <td>
                        <input className="form-control" value={user.lastName}
                               onChange={(e) => setUser({...user, lastName: e.target.value})} required/>
                    </td>
                    <td>
                        <select className="form-select" value={user.role}
                                onChange={(e) => setUser({...user, role: e.target.value})}>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="BUSINESS">Business</option>
                        </select>
                    </td>
                    <td className="text-nowrap">
                        <BsPlusCircleFill onClick={createUser}
                                          className="text-primary fs-1 text me-2"/>
                        <BsFillCheckCircleFill onClick={updateUser}
                                               className="text-success fs-1 text"/>
                    </td>
                </tr>
                {users.map((user) => (
                    <tr key={user._id}>
                        <td>
                            <Link to={`/profile/${user._id}`}>
                                {user.username}
                            </Link>
                        </td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td className="text-nowrap">
                            <button className="btn btn-danger me-2">
                                <BsTrash3Fill onClick={() => deleteUser(user)}/>
                            </button>
                            <button className="btn btn-warning me-2">
                                <BsPencil onClick={() => selectUser(user)}/>
                            </button>
                        </td>
                    </tr>))}
                </tbody>
            </table>
                </div>
                )}
        </div>
    );
}

export default UserDashboard;