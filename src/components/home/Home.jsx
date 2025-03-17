import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  let navigate = useNavigate();

  function donate() {
    navigate('/drive');
  }

  function receive() {
    navigate('/recipient');
  }

  function register() {
    navigate('/bbRegister');
  }

  return (
    <div className='Home'>
      <div className="main">
        <div className="class1">
          <img src="https://t4.ftcdn.net/jpg/05/92/22/13/360_F_592221341_qpC8lxfSn9EXNZsNXaQ76ehmhBoreAFv.jpg" alt="" className="img1" />
          <h2 className='tagLine1'>Your Gift Of <span className='highlight'>Blood</span></h2>
          <h2 className='tagLine2'>Their Gift Of <span className='highlight'>Life</span></h2>
        </div>
        <div className='c4'>
          <div className='ch1'>
            <p>Donate Blood, Save Lives - Join a Drive Now!</p>
            <button className='btn fs-4' onClick={donate}>Donate Now</button>
          </div>
          <div className='ch2'>
            <p>Need Blood? Find a Donor Near You!</p>
            <button className='btn fs-4' onClick={receive}>Find Now</button>
          </div>
        </div>
        <img src="https://freepngimg.com/save/108995-picture-red-wave-free-clipart-hq/1600x470" alt="" className="img3" />
        <div className='class3'>
          <img src="https://cdn-icons-png.flaticon.com/512/7918/7918340.png" alt="" style={{ width: '100px', height: '100px' }} className='img4' />
          <p>Register your Blood Bank</p>
          <button className='btn fs-3' onClick={register}>Register</button>
        </div>
        <div className="class2">
          <img src="https://www.shutterstock.com/image-vector/human-heart-venous-system-anatomy-600nw-1896767095.jpg" alt="" className="img2" />
        </div>
      </div>
    </div>
  );
}

export default Home;
