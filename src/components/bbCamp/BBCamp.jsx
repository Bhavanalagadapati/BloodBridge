import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BBCamp() {
    const [campaigns, setCampaigns] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    // Retrieve the logged-in blood bank's ID from localStorage
    const loggedInBloodBankId = localStorage.getItem("bloodBankId");

    useEffect(() => {
        fetch("http://localhost:3000/campaigns")
            .then(response => response.json())
            .then(data => {
                // Filter campaigns based on the logged-in blood bank's ID
                const filteredCampaigns = data.filter(camp => camp.bloodBankId === loggedInBloodBankId);
                setCampaigns(filteredCampaigns);
            })
            .catch(error => console.error("Error fetching campaigns:", error));
    }, [loggedInBloodBankId]);

    const toggleView = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEdit = (campaign) => {
        navigate("/createCamp", { state: { campaign } });
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
    };

    const handleDelete = () => {
        fetch(`http://localhost:3000/campaigns/${deleteId}`, { method: "DELETE" })
            .then(() => {
                setCampaigns(campaigns.filter(c => c.id !== deleteId));
                setDeleteId(null);
            })
            .catch(error => console.error("Error deleting campaign:", error));
    };

    return (
        <div className="container mt-4">
            <h2>Blood Donation Campaigns</h2>
            {campaigns.length === 0 ? (
                <p>No campaigns found.</p>
            ) : (
                campaigns.map((campaign) => (
                    <div key={campaign.id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{campaign.name}</h5>
                            <div>
                                <button className="btn btn-info me-2" onClick={() => toggleView(campaign.id)}>
                                    {expandedId === campaign.id ? "Hide" : "View"}
                                </button>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(campaign)}>
                                    Edit
                                </button>
                                <button className="btn btn-danger" onClick={() => confirmDelete(campaign.id)}>
                                    Delete
                                </button>
                            </div>
                            {expandedId === campaign.id && (
                                <div className="mt-3">
                                    <p><strong>Date:</strong> {campaign.date}</p>
                                    <p><strong>Time:</strong> {campaign.time}</p>
                                    <p><strong>Location:</strong> {campaign.location}</p>
                                    <p><strong>Description:</strong> {campaign.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}

            <button className="btn btn-primary" onClick={() => navigate("/createCamp")}>Create New</button>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteId(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this campaign?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BBCamp;
