import { useNavigate } from "react-router-dom";
import "./../styles/navbar.css";


function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    return (
        <nav  className="navbar" >
            <h2>Placement Tracker</h2>

            <button onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
}

export default Navbar;