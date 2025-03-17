import React, { useState, useEffect } from "react";

const threshold = {
    "A+": 10, "A-": 8, "B+": 10, "B-": 8,
    "O+": 12, "O-": 6, "AB+": 7, "AB-": 5,
};

function Recipient() {
    const [location, setLocation] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [unitsRequired, setUnitsRequired] = useState("");
    const [bloodBanks, setBloodBanks] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [filteredBanks, setFilteredBanks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/bbRegistrations")
            .then(response => response.json())
            .then(data => setBloodBanks(data))
            .catch(error => console.error("Error fetching blood banks:", error));

        fetch("http://localhost:3000/bloodStock")
            .then(response => response.json())
            .then(data => setStockData(data))
            .catch(error => console.error("Error fetching blood stock:", error));
    }, []);

    const handleSearch = () => {
        if (!location || !bloodType || !unitsRequired) {
            alert("Please enter location, blood type, and required units.");
            return;
        }

        const normalizedLocation = location.trim().toLowerCase();
        const requiredUnits = parseInt(unitsRequired, 10);

        const availableBanks = stockData.filter(stock => {
            const availableUnits = parseInt(stock.stock[bloodType], 10);
            return availableUnits >= threshold[bloodType] && availableUnits >= requiredUnits;
        });

        const matchedBanks = availableBanks.map(stock => {
            const bank = bloodBanks.find(bb => 
                bb.id === stock.bloodBankId && 
                bb.city.trim().toLowerCase() === normalizedLocation
            );
            return bank ? { ...bank, availableUnits: stock.stock[bloodType] } : null;
        }).filter(bank => bank !== null);

        setFilteredBanks(matchedBanks);
    };

    return (
        <div className="container mt-4">
            <h2>Search for Blood Availability</h2>
            
            <div className="mb-3">
                <label className="form-label">Enter Your Location</label>
                <input 
                    type="text" className="form-control" 
                    value={location} onChange={(e) => setLocation(e.target.value)} 
                    placeholder="Enter city"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Select Required Blood Type</label>
                <select className="form-control" value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
                    <option value="">Select Blood Type</option>
                    {Object.keys(threshold).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Number of Units Required</label>
                <input 
                    type="number" className="form-control" 
                    value={unitsRequired} 
                    onChange={(e) => setUnitsRequired(e.target.value)} 
                    min="1"
                />
            </div>

            <button className="btn btn-primary" onClick={handleSearch}>Search</button>

            {filteredBanks.length > 0 ? (
                <div className="mt-4">
                    <h3>Available Blood Banks</h3>
                    <ul className="list-group">
                        {filteredBanks.map(bank => (
                            <li key={bank.id} className="list-group-item">
                                <strong>{bank.name}</strong> - {bank.address}, {bank.city}
                                <br />
                                <span>Available Units: {bank.availableUnits}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="mt-3">No matching blood banks found.</p>
            )}
        </div>
    );
}

export default Recipient;
