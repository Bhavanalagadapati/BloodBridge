import React from "react";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Drive() {
    const [lowStockBanks, setLowStockBanks] = useState([]);
    const [visibleBank, setVisibleBank] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3000/bloodStock")
            .then(response => response.json())
            .then(bloodStockData => {
                fetch("http://localhost:3000/bbRegistrations")
                    .then(response => response.json())
                    .then(bbRegistrationsData => {
                        const threshold = {
                            "A+": 10, "A-": 8, "B+": 10, "B-": 8,
                            "O+": 12, "O-": 6, "AB+": 7, "AB-": 5
                        };

                        const bloodBankMap = {};
                        bbRegistrationsData.forEach(bank => {
                            bloodBankMap[bank.id] = bank.name;
                        });

                        const filteredBanks = bloodStockData
                            .map(bank => {
                                const lowStockTypes = Object.keys(bank.stock)
                                    .filter(type => parseInt(bank.stock[type]) < threshold[type]);

                                if (lowStockTypes.length > 0) {
                                    return {
                                        bloodBankName: bloodBankMap[bank.bloodBankId] || "Unknown Blood Bank",
                                        bloodBankId: bank.bloodBankId,
                                        lowStockTypes
                                    };
                                }
                                return null;
                            })
                            .filter(bank => bank !== null);

                        setLowStockBanks(filteredBanks);
                    })
                    .catch(error => console.error("Error fetching blood banks:", error));
            })
            .catch(error => console.error("Error fetching blood stock:", error));
    }, []);

    function handleViewBlood(bloodBankId) {
        setVisibleBank(visibleBank === bloodBankId ? null : bloodBankId);
    }

    function handleRegister(bloodBankId) {
        navigate(`/donorRegistration/${bloodBankId || ''}`);
    }

    return (
        <div className="container mt-4">
            <h2>Donation Drive</h2>
            {lowStockBanks.length > 0 ? (
                <div className="row">
                    {lowStockBanks.map(bank => (
                        <div key={bank.bloodBankId} className="col-md-6 mb-3">
                            <div className="card p-3">
                                <h5>BloodBank Name: <strong>{bank.bloodBankName}</strong></h5>
                                <button className="btn btn-danger me-2" onClick={() => handleViewBlood(bank.bloodBankId)}>
                                    View Blood
                                </button>
                                <button className="btn btn-danger" onClick={() => handleRegister(bank.bloodBankId)}>
                                    Register
                                </button>
                                {visibleBank === bank.bloodBankId && (
                                    <div className="mt-3">
                                        <p>Low Stock Blood Types:</p>
                                        <ul>
                                            {bank.lowStockTypes.map((type, index) => (
                                                <li key={index}>{type}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No blood banks have low stock currently.</p>
            )}
        </div>
    );
}

export default Drive;