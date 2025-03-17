import React, { useState, useEffect, useContext } from "react";
import { BankLoginContext } from "../../contexts/BankLoginContext";

function RegisteredUsers() {
    const { currentUser } = useContext(BankLoginContext);
    const loggedInEmail = currentUser?.email || "";

    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [donors, setDonors] = useState([]);
    const [bloodBankId, setBloodBankId] = useState(null);
    const [expandedUserId, setExpandedUserId] = useState(null);

    useEffect(() => {
        if (!loggedInEmail) {
            console.error("No logged-in user found.");
            return;
        }

        // Fetch blood bank registrations
        fetch("http://localhost:3000/bbRegistrations")
            .then(response => response.json())
            .then(data => {
                const loggedInBloodBank = data.find(bank => bank.email === loggedInEmail);
                setBloodBankId(loggedInBloodBank ? loggedInBloodBank.id : null);
            })
            .catch(error => console.error("Error fetching blood bank:", error));

        // Fetch campaigns
        fetch("http://localhost:3000/campaigns")
            .then(response => response.json())
            .then(data => setCampaigns(data))
            .catch(error => console.error("Error fetching campaigns:", error));

        // Fetch registered users for campaigns
        fetch("http://localhost:3000/campRegisters")
            .then(response => response.json())
            .then(data => setRegisteredUsers(data))
            .catch(error => console.error("Error fetching campaign users:", error));

        // Fetch donor registrations
        fetch("http://localhost:3000/donors")
            .then(response => response.json())
            .then(data => setDonors(data))
            .catch(error => console.error("Error fetching donors:", error));

    }, [loggedInEmail]);

    if (!loggedInEmail) {
        return (
            <div className="container mt-4">
                <h2>Registered Users</h2>
                <p>Please log in to view registered users.</p>
            </div>
        );
    }

    if (bloodBankId === null) {
        return (
            <div className="container mt-4">
                <h2>Registered Users</h2>
                <p>You are not associated with any blood bank.</p>
            </div>
        );
    }

    // Get only the campaigns belonging to the logged-in blood bank
    const bloodBankCampaigns = campaigns.filter(camp => camp.bloodBankId === bloodBankId);
    const campaignIds = bloodBankCampaigns.map(camp => camp.id);

    // Group users by campaign
    const campaignUsersMap = bloodBankCampaigns.reduce((acc, camp) => {
        acc[camp.id] = registeredUsers.filter(user => user.campaignId === camp.id);
        return acc;
    }, {});

    // Get donors registered for the logged-in blood bank
    const filteredDonors = donors.filter(donor => String(donor.bloodBankId) === String(bloodBankId));

    return (
        <div className="container mt-4">
            <h2>Registered Users</h2>

            {/* Campaign Registrations Section */}
            <h3 className="mt-4">Campaign Registrations</h3>
            {bloodBankCampaigns.length === 0 ? (
                <p>You have not created any campaigns yet.</p>
            ) : (
                bloodBankCampaigns.map(campaign => (
                    <div key={campaign.id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">
                                <strong>Campaign:</strong> {campaign.name}
                            </h5>
                            {campaignUsersMap[campaign.id].length === 0 ? (
                                <p>No users have registered for this campaign.</p>
                            ) : (
                                campaignUsersMap[campaign.id].map(user => (
                                    <div key={user.id} className="mt-3 border-bottom pb-2">
                                        <p><strong>User:</strong> {user.name}</p>
                                        <button className="btn btn-info btn-sm" 
                                            onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                                        >
                                            {expandedUserId === user.id ? "Hide Details" : "View"}
                                        </button>
                                        {expandedUserId === user.id && (
                                            <div className="mt-2">
                                                <p><strong>Age:</strong> {user.age}</p>
                                                <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
                                                <p><strong>Contact:</strong> {user.contact}</p>
                                                <p><strong>Email:</strong> {user.email}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))
            )}

            {/* Donation Registrations Section */}
            <h3 className="mt-4">Donation Registrations</h3>
            {filteredDonors.length === 0 ? (
                <p>No users have registered for blood donation.</p>
            ) : (
                filteredDonors.map(donor => (
                    <div key={donor.id} className="card mb-3">
                        <div className="card-body">
                            <p><strong>User:</strong> {donor.name}</p>
                            <button className="btn btn-info btn-sm" 
                                onClick={() => setExpandedUserId(expandedUserId === donor.id ? null : donor.id)}
                            >
                                {expandedUserId === donor.id ? "Hide Details" : "View"}
                            </button>
                            {expandedUserId === donor.id && (
                                <div className="mt-2">
                                    <p><strong>Age:</strong> {donor.age}</p>
                                    <p><strong>Blood Group:</strong> {donor.bloodGroup || donor.bloodType}</p>
                                    <p><strong>Contact:</strong> {donor.contact || donor.phone}</p>
                                    <p><strong>Email:</strong> {donor.email}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default RegisteredUsers;
