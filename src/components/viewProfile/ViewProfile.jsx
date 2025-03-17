import React, { useContext } from 'react';
import { BankLoginContext } from '../../contexts/BankLoginContext';
import './ViewProfile.css';
import { useNavigate } from 'react-router-dom';
import { ImProfile } from "react-icons/im";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";

const ViewProfile = () => {
    const { currentUser } = useContext(BankLoginContext);
    const navigate = useNavigate(); 
0
    function dashboard(){
        navigate('/bbDash')
    }    

    return (
      <div className="viewuser">
        <div className='image'>
        </div>
        <div className='fs-2 ms-4 mt-2 back' onClick={dashboard}>
        <IoArrowBackCircleSharp />
      </div>
        <div className="view-user-container">
            <div className="user-info-section">
                <h1><ImProfile /> Profile Overview</h1>
                <div className="user-card">
                    <p className='fs-3 mt-4'><strong>BloodBank Name:</strong> {currentUser.name}</p>
                    <p className='fs-3 mt-4'><strong>Contact Person:</strong> {currentUser.contactPerson}</p>
                    <p className='fs-3 mt-4'><strong>Email Address:</strong> {currentUser.email}</p>
                    <p className='fs-3 mt-4'><strong>Mobile Number:</strong> {currentUser.phone}</p>
                </div>
            </div>
            <div className='but mt-4'>
                <button className="btn btn1 fs-5 btn-secondary" onClick={() => navigate('/editProfile')}><FaRegEdit /> Edit Profile</button>
            </div>
        </div>
      </div>
    );
};

export default ViewProfile;