import React, { useState, useEffect } from 'react';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function ViewStock() {
    const [bloodStock, setBloodStock] = useState(null);
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const bloodBankId = localStorage.getItem("bloodBankId");
    const navigate = useNavigate();

    // Define threshold values for each blood type
    const threshold = {
        "A+": 10,
        "A-": 8,
        "B+": 10,
        "B-": 8,
        "O+": 12,
        "O-": 6,
        "AB+": 7,
        "AB-": 5,
    };

    useEffect(() => {
        if (!bloodBankId) return;

        fetch(`http://localhost:3000/bloodStock?bloodBankId=${bloodBankId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    setBloodStock(data[0].stock);

                    // Find blood types below the threshold
                    const lowStockTypes = Object.keys(data[0].stock)
                        .filter((type) => data[0].stock[type] < threshold[type])
                        .map((type) => ({ type, units: data[0].stock[type] }));

                    setLowStock(lowStockTypes);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching stock:", error);
                setLoading(false);
            });
    }, [bloodBankId]);

    function dashboard() {
        navigate('/bbDash');
    }

    return (
        <div className="container mt-4">
            <div className='fs-2 ms-4 mt-2 back' onClick={dashboard}>
                <IoArrowBackCircleSharp />
            </div>
            <h2>View Blood Stock</h2>

            {loading ? (
                <p>Loading...</p>
            ) : bloodStock ? (
                <>
                    {/* Blood Stock Section */}
                    <div className="row">
                        {Object.keys(bloodStock).map((type) => (
                            <div key={type} className="col-md-3 mb-3">
                                <div className="card p-3 text-center">
                                    <h5>Blood Type:{type}</h5>
                                    <p className="fw-bold">Available Units:{bloodStock[type]}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Alert Section - Low Stock Blood Types */}
                    {lowStock.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-danger">⚠ Alert: Low Stock Blood Types</h3>
                            <div className="row">
                                {lowStock.map(({ type, units }) => (
                                    <div key={type} className="col-md-3 mb-3">
                                        <div className="card p-3 text-center border border-danger">
                                            <h5 className="text-danger">Blood Type:{type}</h5>
                                            <p className="fw-bold text-danger">Available Units:{units} </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p>No stock added yet for this Blood Bank.</p>
            )}
        </div>
    );
}

export default ViewStock;
