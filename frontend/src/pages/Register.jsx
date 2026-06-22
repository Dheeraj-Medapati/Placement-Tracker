import { useState } from "react";
import api from "../services/api";
import "../styles/register.css";
import { Link ,useNavigate } from "react-router-dom";


function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/register",
                formData
            );

            alert(response.data.message);

            navigate("/login");

            console.log(response.data);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );

        }
    };

    return (
        <div className="register-container">
            <div className="register-card">

                <h1>Register</h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Register
                    </button>

                </form>

                <div className="register-footer">
                    <p>Already have an account?</p>
                    <Link to="/login">Login</Link>
                </div>

            </div>
        </div>
    );
}

export default Register;