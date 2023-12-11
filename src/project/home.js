import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom"
import * as client from "./client.js";

function Home() {
    const [search, setSearch] = useState({term: "food", location: "nyc"});
    const [results, setResults] = useState(null)
    const navigate = useNavigate();

    const fetchBusinesses = async () => {
        const results = await client.searchBusinesses(search);
        setResults(results)
    }


    return (
        <div>
            <h1>Search</h1>
            <button
                onClick={() => navigate(`/search/${search.term}`)}
                onClick={fetchBusinesses}
                className="btn btn-primary float-end me-2"
            >
                Search
            </button>
            <input
                type="text"
                className="form-control w-75 ms-2"
                placeholder="Search..."
                value={search.term}
                onChange={(event) => {
                    setSearch({...search, term: event.target.value});
                }}
            />
            <h2>Results</h2>
            <ul className="list-group">
                {results &&
                 results.map((business, index) => (
                     <li key={index} className="list-group-item">
                         {/*<Link to={`/project/details/${business.id}`}>*/}
                             <h3>{business.name}</h3>
                             <img
                                 src={business.image_url}
                                 alt={business.name}
                             />
                     </li>
                 ))}
            </ul>
            <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
    );
}

export default Home;