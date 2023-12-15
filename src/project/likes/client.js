import axios from "axios";
const request = axios.create({
                                 withCredentials: true,
                             }

);

export const BASE_API = process.env.REACT_APP_BASE_API_URL || `http://localhost:4000`;

const USERS_API = `${BASE_API}/api/users`;
const LIKES_API = `${BASE_API}/api/likes`;

export const findAllLikes = async () => {
    const response = await request.get(`${LIKES_API}`)
    return response.data;
};
export const createUserLikesBusiness = async (userId, businessId, businessName, businessUrl) => {
    const response = await request.post(`${USERS_API}/${userId}/likes/${businessId}?name=${businessName}&url=${businessUrl}`);
    return response.data;
};
export const deleteUserLikesBusiness = async (userId, businessId) => {
    const response = await request.delete(`${USERS_API}/${userId}/likes/${businessId}`);
    return response.data;

};
export const findUsersThatLikeBusiness= async (businessId) => {
    const response = await request.get(`${LIKES_API}/${businessId}/users`);
    return response.data;
};
export const findBusinessesThatUserLikes = async (userId) => {
    const response = await request.get(`${USERS_API}/${userId}/likes`);
    return response.data;
};