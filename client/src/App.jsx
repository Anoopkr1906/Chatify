import React , {lazy, Suspense} from 'react'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute'
import { LayoutLoader } from './components/Layout/Loaders'

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
  

let user = true;

function App() {
  return (
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
    </BrowserRouter>
  )
}

export default App

