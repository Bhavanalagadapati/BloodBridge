import React, { useState, useEffect } from "react";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function AddStock() {
    const [stock, setStock] = useState({
        "A+": "",
        "A-": "",
        "B+": "",
        "B-": "",
        "O+": "",
        "O-": "",
        "AB+": "",
        "AB-": "",
    });

    const [stockExists, setStockExists] = useState(false);
    const [stockId, setStockId] = useState(null); // Store stock ID for updates
    const bloodBankId = localStorage.getItem("bloodBankId");
    const navigate = useNavigate(); 

    // Fetch existing stock on component mount
    useEffect(() => {
        if (!bloodBankId) return;

        fetch(`http://localhost:3000/bloodStock?bloodBankId=${bloodBankId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    setStock(data[0].stock);
                    setStockId(data[0].id); // Store the ID for future updates
                    setStockExists(true);
                }
            })
            .catch(error => console.error("Error fetching stock:", error));
    }, [bloodBankId]);

    const handleInputChange = (e) => {
        setStock({ ...stock, [e.target.name]: e.target.value });
    };

    const handleSaveStock = () => {
        const stockData = {
            bloodBankId,
            stock,
        };

        if (stockExists) {
            // Update existing stock using PUT
            fetch(`http://localhost:3000/bloodStock/${stockId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(stockData),
            })
                .then(response => response.json())
                .then(() => alert("Stock updated successfully!"))
                .catch(error => console.error("Error updating stock:", error));
        } else {
            // Add new stock using POST
            fetch("http://localhost:3000/bloodStock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(stockData),
            })
                .then(response => response.json())
                .then(data => {
                    setStockId(data.id); // Store new stock ID
                    setStockExists(true);
                    alert("Stock added successfully!");
                })
                .catch(error => console.error("Error adding stock:", error));
        }
    };
    
    function dashboard(){
        navigate('/bbDash')
    }   
    function view(){
        navigate('/ViewStock')
    }


    return (
        <div className="container mt-4">
            <div className='fs-2 ms-4 mt-2 back' onClick={dashboard}>
                    <IoArrowBackCircleSharp />
                  </div>
            <h2>{stockExists ? "Update Blood Stock" : "Add Blood Stock"}</h2>
            <div className="row">
                {Object.keys(stock).map((type) => (
                    <div key={type} className="col-md-3 mb-3">
                        <div className="card p-3 text-center">
                            <h5>Blood Type:{type}</h5>
                            <p>Add Units:</p>
                            <input
                                type="number"
                                name={type}
                                value={stock[type]}
                                onChange={handleInputChange}
                                className="form-control text-center"
                                min="0"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn btn-primary mt-3" onClick={handleSaveStock}>
                {stockExists ? "Update Stock" : "Add Stock"}
            </button>
            <button className="btn btn-primary mt-3" onClick={view}>viewStock</button>
        </div>
    );
}

export default AddStock;
