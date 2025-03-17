import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DonorRegistration() {
    const { bloodBankId } = useParams();
    const [bloodBankName, setBloodBankName] = useState("");
    const [lowStockBloodTypes, setLowStockBloodTypes] = useState([]);
    const [selectedBloodType, setSelectedBloodType] = useState("");
    const [userDetails, setUserDetails] = useState({
        name: "",
        age: "",
        phone: "",
        email: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchBloodBankData() {
            try {
                const bankRes = await fetch("http://localhost:3000/bbRegistrations");
                const bankData = await bankRes.json();
                const selectedBank = bankData.find(bank => String(bank.id) === String(bloodBankId));

                setBloodBankName(selectedBank ? selectedBank.name : "Unknown Blood Bank");

                const stockRes = await fetch("http://localhost:3000/bloodStock");
                const stockData = await stockRes.json();
                const selectedStock = stockData.find(stock => String(stock.bloodBankId) === String(bloodBankId));

                if (selectedStock) {
                    const threshold = {
                        "A+": 10, "A-": 8, "B+": 10, "B-": 8,
                        "O+": 12, "O-": 6, "AB+": 7, "AB-": 5
                    };

                    const lowStockTypes = Object.keys(selectedStock.stock)
                        .filter(type => parseInt(selectedStock.stock[type]) < threshold[type]);

                    setLowStockBloodTypes(lowStockTypes);
                    if (lowStockTypes.length === 1) {
                        setSelectedBloodType(lowStockTypes[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching blood bank details:", error);
            }
        }

        fetchBloodBankData();
    }, [bloodBankId]);

    function handleChange(e) {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    }

    async function handleRegister() {
        const { name, age, phone, email } = userDetails;

        if (!name || !age || !phone || !email || !selectedBloodType) {
            alert("Please fill in all fields.");
            return;
        }

        if (age < 18 || age > 65) {
            alert("Age must be between 18 and 65");
            return;
        }

        try {
            await fetch("http://localhost:3000/donors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    age,
                    phone,
                    email,
                    bloodType: selectedBloodType,
                    bloodBankId
                })
            });

            alert("Registered successfully!");
            navigate("/drive");
        } catch (error) {
            console.error("Error registering donor:", error);
            alert("Registration failed. Please try again.");
        }
    }

    return (
        <div className="container mt-4">
            <h2>Donor Registration</h2>
            <h4>Blood Bank: <strong>{bloodBankName}</strong></h4>

            <div className="mt-3">
                <label>Name:</label>
                <input type="text" className="form-control" name="name" value={userDetails.name} onChange={handleChange} required />

                <label className="mt-2">Age:</label>
                <input type="number" className="form-control" name="age" value={userDetails.age} onChange={handleChange} required />

                <label className="mt-2">Phone:</label>
                <input type="text" className="form-control" name="phone" value={userDetails.phone} onChange={handleChange} required />

                <label className="mt-2">Email:</label>
                <input type="email" className="form-control" name="email" value={userDetails.email} onChange={handleChange} required />
            </div>

            {lowStockBloodTypes.length > 0 ? (
                <div className="mt-3">
                    <label>Select Blood Type:</label>
                    <select className="form-control" value={selectedBloodType} onChange={(e) => setSelectedBloodType(e.target.value)} required>
                        <option value="" disabled>Select a blood type</option>
                        {lowStockBloodTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button className="btn btn-success mt-3" onClick={handleRegister}>Register</button>
                </div>
            ) : (
                <p className="mt-3">No low stock blood types available for this blood bank.</p>
            )}
        </div>
    );
}

export default DonorRegistration;
