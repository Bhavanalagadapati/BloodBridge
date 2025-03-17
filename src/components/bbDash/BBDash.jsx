import React from 'react'
import { useNavigate } from 'react-router-dom'

function BBDash() {
    let navigate=useNavigate();

    function add(){
        navigate('/addStock')
    }
    function view(){
        navigate('/ViewStock')
    }
    function camp(){
      navigate('/bbCamp')
  }
  function users(){
    navigate('/registeredUsers')
}

  return (
    <div><button onClick={add}>AddStock</button>
    <button onClick={view}>viewStock</button>
    <button onClick={camp}>Camps</button>
    <button onClick={users}>RegisteredUsers</button>
    </div>
  )
}

export default BBDash