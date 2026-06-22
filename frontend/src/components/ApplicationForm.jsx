import { useState } from "react";
import "../styles/applicationForm.css";

function ApplicationForm({ onAdd }) {

    const [formData, setFormData] = useState({
        company_name: "",
        role: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onAdd(formData);

        setFormData({
            company_name: "",
            role: ""
        });
    };

    return (
        <form onSubmit={handleSubmit} className="application-form" >

            <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="text"
                name="role"
                placeholder="Role"
                value={formData.role}
                onChange={handleChange}
            />

            <br /><br />

            <button type="submit">
                Add Application
            </button>

        </form>
    );
}

export default ApplicationForm;