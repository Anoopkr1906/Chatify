import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectRoute = ({children , user , redirect="/login"}) => {

    console.log("ProtectRoute - user:", user, "redirect:", redirect);

    if (!user) {
        return <Navigate to={redirect} replace/>
    }

    return children ? children : <Outlet />;
    
//   return (
//     <div>
      
//     </div>
//   )
}

export default ProtectRoute
