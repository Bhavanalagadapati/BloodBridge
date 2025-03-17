import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function CreateCamp() {
    const navigate = useNavigate();
    const location = useLocation();
    const campaignData = location.state?.campaign || null;
    const isEditing = !!campaignData;

    // Get bloodBankId from localStorage (Assuming blood banks are logged in)
    const bloodBankId = localStorage.getItem("bloodBankId") || null;

    const [campaign, setCampaign] = useState({
        name: "",
        date: "",
        time: "",
        location: "",
        description: "",
        bloodBankId: bloodBankId // Associate campaign with the logged-in blood bank
    });

    useEffect(() => {
        if (isEditing) {
            setCampaign(campaignData);
        }
    }, [isEditing, campaignData]);

    const today = new Date().toISOString().split("T")[0];

    const handleChange = (e) => {
        setCampaign({ ...campaign, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!bloodBankId) {
            alert("Error: No blood bank is logged in!");
            return;
        }

        const url = isEditing ? `http://localhost:3000/campaigns/${campaign.id}` : "http://localhost:3000/campaigns";
        const method = isEditing ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(campaign)
        })
            .then(response => response.json())
            .then(() => {
                alert(isEditing ? "Campaign Updated Successfully!" : "Campaign Posted Successfully!");
                navigate("/bbcamp"); // Navigate back after submit
            })
            .catch(error => console.error("Error posting/updating campaign:", error));
    };

    return (
        <div className="container mt-4">
            <h2>{isEditing ? "Edit Blood Donation Campaign" : "Post a Blood Donation Campaign"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Campaign Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={campaign.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={campaign.date}
                        min={today}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input
                        type="time"
                        className="form-control"
                        name="time"
                        value={campaign.time}
                        min={campaign.date === today ? new Date().toTimeString().slice(0, 5) : ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={campaign.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={campaign.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                    {isEditing ? "Update Campaign" : "Post Campaign"}
                </button>
            </form>
        </div>
    );
}

export default CreateCamp;
