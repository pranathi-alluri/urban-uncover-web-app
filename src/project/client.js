import axios from "axios";
const request = axios.create({
                                 withCredentials: true,
                             }

);
export const BASE_API = process.env.REACT_APP_BASE_API_URL || `http://localhost:4000`;
// `http://localhost:4000`
export const YELP_API = `${BASE_API}/api/yelp`

export const searchBusinesses = async (searchParams) => {
    const response = await request.post(`${YELP_API}/businesses`, searchParams);
    return response.data;
}

export const findBusinessById = async(businessId) => {
    const response = await request.get(`${YELP_API}/businesses/${businessId}`);
    return response.data
}

export const verifyBusiness = async(verifyParams) => {
    console.log(verifyParams)
    const response = await request.post(`${YELP_API}/business`, verifyParams);
    return response.data
}