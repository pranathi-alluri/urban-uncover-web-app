import { Link, useLocation} from "react-router-dom";
function Nav() {
    const {pathname} = useLocation();
    return (
        <nav className="nav nav-tabs mt-2">
            <Link className={`nav-link ${pathname.includes("login") ? "active" : ""}`} to="/login">Login</Link>
            <Link className={`nav-link ${pathname.includes("register") ? "active" : ""}`} to="/register">Sign up</Link>
        </nav>
    );
}
export default Nav;