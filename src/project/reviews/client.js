import axios from "axios";
const request = axios.create({
                                 withCredentials: true,
                             }

);

export const BASE_API = process.env.REACT_APP_BASE_API_URL || `http://localhost:4000`;

const USERS_API = `${BASE_API}/api/users`;
const REVIEW_API = `${BASE_API}/api/reviews`;

export const findAllReviews = async () => {
    const response = await request.get(`${USERS_API}`)
    return response.data
};
export const createUserReviewsBusiness = async (userId, businessId, businessName, review) => {
    const response = await request.post(`${USERS_API}/${userId}/reviews/${businessId}?name=${businessName}`, review);
    return response.data;
};
export const deleteUserReview = async (userId, businessId) => {
    const response = await request.delete(`${USERS_API}/${userId}/reviews/${businessId}`);
    return response.data;

};
export const findReviewsForBusiness= async (businessId) => {
    const response = await request.get(`${REVIEW_API}/${businessId}`);
    return response.data;
};
export const findBusinessesThatUserReviewed = async (userId) => {
    const response = await request.get(`${USERS_API}/${userId}/reviews`);
    return response.data;
};