import React from 'react'
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import RootLayout from './RootLayout'
import Home from './components/home/Home'
import Drive from './components/drive/Drive'
import Recipient from './components/recipient/Recipient'
import Camp from './components/campaigns/Camp'
import BBRegister from './components/bbRegister/BBRegister'
import BBLogin from './components/bbLogin/BBLogin'
import BBDash from './components/bbDash/BBDash'
import ViewProfile from './components/viewProfile/ViewProfile';
import EditProfile from './components/editProfile/EditProfile';
import AddStock from './components/addStock/AddStock'
import ViewStock from './components/viewStock/ViewStock'
import DonorRegistration from './components/donorRegistration/DonorRegistration';
import BBCamp from './components/bbCamp/BBCamp';
import CreateCamp from './components/createCamp/CreateCamp';
import CampRegister from './components/campRegister/CampRegister'
import RegisteredUsers from './components/registeredUsers/RegisteredUsers';

function App() {
    const browserRouter=createBrowserRouter([
        {
            path:'',
            element:<RootLayout/>,
            children:[
              {
                path:'/',
                element:<Home />
              },
              {
                path:'drive',
                element:<Drive/>
              },
              {
                path:'recipient',
                element:<Recipient/>
              },
              {
                path:'campaigns',
                element:<Camp/>
              },
              {
                path:'bbRegister',
                element:<BBRegister/>
              },
              {
                path:'bbLogin',
                element:<BBLogin/>
              },
              {
                path:'bbDash',
                element:<BBDash/>
              },
              {
                path:'viewProfile',
                element:<ViewProfile/>
              },
              {
                path:'editProfile',
                element:<EditProfile/>
              },
              {
                path:'addStock',
                element:<AddStock/>
              },
              {
                path:'viewStock',
                element:<ViewStock/>
              },
              {
                path:'donorRegistration/:bloodBankId',
                element:<DonorRegistration/>
              },
              {
                path:'bbCamp',
                element:<BBCamp/>
              },
              {
                path:'createCamp',
                element:<CreateCamp/>
              },
              {
                path:'campRegister',
                element:<CampRegister/>
              },
              {
                path:'registeredUsers',
                element:<RegisteredUsers/>
              }
            ]
        }
    ])
  return (
    <RouterProvider router={browserRouter} />
  )
}

export default App