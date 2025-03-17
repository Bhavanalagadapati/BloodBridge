import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CampRegister() {
    const location = useLocation();
    const navigate = useNavigate();
    const campaignId = location.state?.campaignId; // Get campaign ID from navigation state

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        bloodGroup: "",
        contact: "",
        email: "",
    });

    const MIN_AGE = 18;
    const MAX_AGE = 65;

    // Fetch campaign details from API
    useEffect(() => {
        if (campaignId) {
            fetch(`http://localhost:3000/campaigns/${campaignId}`)
                .then(response => response.json())
                .then(data => {
                    setCampaign(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching campaign:", error);
                    setLoading(false);
                });
        }
    }, [campaignId]);

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "age") {
            value = parseInt(value, 10);
            if (isNaN(value)) value = "";
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { age } = formData;

        // Validate age
        if (age < MIN_AGE || age > MAX_AGE) {
            alert(`Age must be between ${MIN_AGE} and ${MAX_AGE} to donate blood.`);
            return;
        }

        const newRegistration = { ...formData, campaignId };

        // Save the registration to the local API
        fetch("http://localhost:3000/campRegisters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRegistration),
        })
        .then(response => response.json())
        .then(() => {
            alert("Registered successfully!");
            navigate("/campaigns");
        })
        .catch(error => console.error("Error registering:", error));
    };

    if (loading) {
        return <p>Loading campaign details...</p>;
    }

    if (!campaign) {
        return <p>Campaign not found.</p>;
    }

    return (
        <div className="container mt-4">
            <h2>Register for {campaign.name}</h2>
            <p><strong>Location:</strong> {campaign.location}</p>
            <p><strong>Date:</strong> {campaign.date} | <strong>Time:</strong> {campaign.time}</p>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} required />
                    {formData.age && (formData.age < MIN_AGE || formData.age > MAX_AGE) && (
                        <p className="text-danger">Age must be between {MIN_AGE} and {MAX_AGE}.</p>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Blood Group</label>
                    <select className="form-control" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input type="text" className="form-control" name="contact" value={formData.contact} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <button type="submit" className="btn btn-success">Register</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/campaigns")}>Cancel</button>
            </form>
        </div>
    );
}

export default CampRegister;
