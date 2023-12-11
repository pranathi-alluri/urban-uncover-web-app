import axios from "axios";
const request = axios.create({
                                 withCredentials: true,
                             }

);
export const BASE_API = process.env.REACT_APP_BASE_API_URL;
export const YELP_API = `${BASE_API}/api/yelp`

export const searchBusinesses = async (searchParams) => {
    const response = await request.post(`${YELP_API}/businesses`, searchParams);
return response.data;
};