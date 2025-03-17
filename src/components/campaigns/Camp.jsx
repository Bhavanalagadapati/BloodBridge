import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Camp() {
    const [campaigns, setCampaigns] = useState([]);
    const [bloodBanks, setBloodBanks] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3000/campaigns")
            .then(res => res.json())
            .then(data => setCampaigns(data))
            .catch(err => console.error("Error fetching campaigns:", err));
        
        fetch("http://localhost:3000/bbRegistrations")
            .then(res => res.json())
            .then(data => setBloodBanks(data))
            .catch(err => console.error("Error fetching blood banks:", err));
    }, []);

    // Function to get the blood bank name based on bloodBankId in the campaign
    const getBloodBankName = (bloodBankId) => {
        const bank = bloodBanks.find(bb => bb.id === bloodBankId);
        return bank ? bank.name : "Unknown Blood Bank";
    };

    const toggleView = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <div className="container mt-4">
            <h2>Available Blood Donation Campaigns</h2>
            {campaigns.map((campaign) => (
                <div key={campaign.id} className="card p-3 my-2">
                    <h5>{campaign.name}</h5>
                    <p><strong>Organized By:</strong> {getBloodBankName(campaign.bloodBankId)}</p>
                    <button className="btn btn-danger me-2" onClick={() => toggleView(campaign.id)}>
                        {expanded === campaign.id ? "Hide" : "View"}
                    </button>
                    <button className="btn btn-primary me-2" onClick={() => navigate("/campRegister", { state: { campaignId: campaign.id } })}>Register</button>

                    {expanded === campaign.id && (
                        <div className="mt-3">
                            <p><strong>Date:</strong> {campaign.date}</p>
                            <p><strong>Time:</strong> {campaign.time}</p>
                            <p><strong>Location:</strong> {campaign.location}</p>
                            <p><strong>Description:</strong> {campaign.description}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Camp;
