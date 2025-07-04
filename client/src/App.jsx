import React , {lazy, Suspense} from 'react'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from "react-hot-toast"
import { server } from './constants/config'
import ProtectRoute from './components/auth/ProtectRoute'
import { LayoutLoader } from './components/Layout/Loaders'
import { userNotExists } from './redux/reducers/auth' // Importing userNotExists action

const Home = lazy( () => import("./pages/Home") ) // Lazy loading Home component
const Login = lazy( () => import("./pages/Login") ) // Lazy loading 
const Chat = lazy( () => import("./pages/Chat") ) // Lazy loading 
const Groups = lazy( () => import("./pages/Groups") ) // Lazy loading 
const NotFound = lazy( () => import("./pages/NotFound") ) // Lazy loading 
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin")) // Lazy loading AdminLogin
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement")) 
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement")) 
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement")) 



const  App = () => {

  const {user , loader} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {

    axios.get(`${server}/api/v1/user/me`)
      .then((res) => {console.log(res)})
      .catch((err) => dispatch(userNotExists()));
 
  },[dispatch]);


  return loader ? (
    <LayoutLoader />
  ) :
   (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={<ProtectRoute user={user}/>}>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
          
          <Route path="/login" 
            element={
            <ProtectRoute user={!user} redirect='/'>
              <Login />
            </ProtectRoute>} 
          />

          <Route path="/admin" element={<AdminLogin />}/>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/chat-management" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center"/>
    </BrowserRouter>
  )
}

export default App

