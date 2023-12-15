import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom"
import * as client from "./client.js";
import "./search.css"
import Navbar from "./NavBar";

function Search() {
    const local = useLocation()
    const params = new URLSearchParams(local.search);

    const term = params.get('term')
    const address = params.get('location')

    const [search, setSearch] = useState({term: term, location: address} || {term: null, location: null});
    const [results, setResults] = useState(null)
    const navigate = useNavigate();

    const fetchBusinesses = async (search) => {
        const results = await client.searchBusinesses(search);
        setResults(results)
        setSearch(search)
    }

    useEffect(() => {
        if (term && address) {
            fetchBusinesses(search)
        }
    }, [])


    return (
        <div>
            <Navbar/>
            <h2 className="search-header text-center">Search</h2>
            <div className="row search-row">
                <div className="col mb-2">
                    <input
                        type="text"
                        className="form-control search-input "
                        placeholder="Search..."
                        value={search.term}
                        onChange={(event) => {
                            setSearch({...search, term: event.target.value});
                        }}
                    />
                </div>
                <div className="col mb-2">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Location"
                        value={search.location}
                        onChange={(event) => {
                            setSearch({...search, location: event.target.value});
                        }}
                    />
                </div>
                <button
                    onClick={() => navigate(`/search?term=${search.term}&location=${search.location}`)}
                    className="btn btn-primary search-button"
                >
                    Search
                </button>
            </div>

            <div className="container results-grid">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
                {results &&
                 results.map((business, index) => (
                     <div key={index} className="col mb-3">
                         <Link to={`/details/${business.id}`} className="card-link">
                             <img src={business.image_url} alt={business.name} className="card-img-top" />
                             <div className="card-body">
                                 <h5 className="card-title">{business.name}</h5>
                             </div>
                         </Link>
                     </div>
                 ))}
                </div>
            </div>
        </div>
    );
}

export default Search;