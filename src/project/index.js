import Home from "./home"
import {Routes, Route, Link} from "react-router-dom"

function Project() {
    return (
        <div>
            <h1>Urban Uncover</h1>
            <Routes>
                <Route path="/" element={<Home />}/>
            </Routes>
        </div>
    );
}

export default Project;