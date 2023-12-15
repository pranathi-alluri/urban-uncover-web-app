import axios from "axios";
const client = axios.create({
                                withCredentials: true
                            });

export const BASE_API = process.env.REACT_APP_BASE_API_URL || `http://localhost:4000`;
const USERS_API = `${BASE_API}/api/users`;

export const userFollowsUser = async (followed) => {
    const response = await client.post(`${USERS_API}/${followed}/follows`);
    return response.data;
};

export const userUnfollowsUser = async (followed) => {
    const response = await client.delete(`${USERS_API}/${followed}/follows`);
    return response.data;
};

export const findFollowersOfUser = async (followed) => {
    const response = await client.get(`${USERS_API}/${followed}/followers`);
    return response.data;
};

export const findFollowedUsersByUser = async (follower) => {
    const response = await client.get(`${USERS_API}/${follower}/following`);
    return response.data;
};