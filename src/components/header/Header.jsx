import React, { useState } from 'react';
import { Link, useLocation,useNavigate} from 'react-router-dom';
import { MdCampaign } from 'react-icons/md';
import { BiSolidDonateBlood } from 'react-icons/bi';
import { MdBloodtype } from 'react-icons/md';
import { CgProfile } from "react-icons/cg";
import { IoHome } from "react-icons/io5";
import { SiGnuprivacyguard } from "react-icons/si";
import { FaSignInAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { useContext } from 'react';
import { BankLoginContext } from '../../contexts/BankLoginContext';
import './Header.css'

function Header() {
    const location = useLocation();
    const { userLoginStatus, logoutUser, currentUser } = useContext(BankLoginContext);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const navigate=useNavigate();

    let navLinks;

    if (location.pathname.startsWith('/donorRegistration') || location.pathname === '/' || location.pathname === '/campaigns' || location.pathname === '/drive' || location.pathname === '/recipient' || location.pathname ==='/campRegister')
        {
        // Default homepage links (before login)
        navLinks = (
            <>
                <li className='nav-item'>
                    <Link to='/campaigns' className='nav-link text-dark a'>
                        <MdCampaign className='icon fs-3' /> Campaigns
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link to='/drive' className='nav-link text-dark a'>
                        <BiSolidDonateBlood className='icon' /> Donate Drive
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link to='/recipient' className='nav-link text-dark a'>
                        <MdBloodtype className='icon' /> Find Blood
                    </Link>
                </li>
            </>
        );
    } else if (!userLoginStatus) {
        // Before login (Register/Login pages)
        navLinks = (
            <>
                <li className='nav-item'>
                    <Link to='/' className='nav-link text-dark a'> <IoHome className='icon'/>Home</Link>
                </li>
                <li className='nav-item'>
                    <Link to='/bbRegister' className='nav-link text-dark a'><SiGnuprivacyguard className='icon'/>Register</Link>
                </li>
                <li className='nav-item'>
                    <Link to='/bbLogin' className='nav-link text-dark a'><FaSignInAlt className='icon'/>Login</Link>
                </li>
            </>
        );
    } else {
        // After login (Dashboard)
        navLinks = (
            <>
                <li className='nav-item'>
                    <Link to='/' className='nav-link text-dark a'><IoHome className='icon'/>Home</Link>
                </li>
                <li className='nav-item'>
                    <Link to='/bbRegister' className='nav-link text-dark a'><SiGnuprivacyguard className='icon'/>Register</Link>
                </li>
                <li className='nav-item'>
                    <button className='btn btn-primary' onClick={() => setShowProfileModal(true)}><CgProfile className='profile' /></button>
                </li>
            </>
        );
    }

    return (
        <div className='header'>
            <Link to='/' className='nav-link'>
                <h1 className='p-2'>
                    <img
                        src='https://cdn.vectorstock.com/i/500p/17/26/blood-drop-red-vector-2051726.jpg'
                        alt=''
                        style={{ width: '50px', height: '50px' }}
                    />{' '}
                    BloodBridge
                </h1>
            </Link>
            <ul className='nav p-2'>{navLinks}</ul>

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Profile</h3>
                        <p><strong>Name:</strong> {currentUser?.name}</p> 
                        <Link to='/viewProfile' onClick={() => setShowProfileModal(false)}><MdOutlineRemoveRedEye />View Profile</Link>
                        <Link to='/editProfile' onClick={() => setShowProfileModal(false)}><FaRegEdit />Edit Profile</Link>
                        <button className='btn btn-danger' onClick={() => { logoutUser(); setShowProfileModal(false);navigate('/bbLogin'); }}>
                        <TbLogout2 className='icon' />Logout
                        </button>
                        <button className='btn btn-secondary' onClick={() => setShowProfileModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
