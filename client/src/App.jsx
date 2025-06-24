import React , {lazy} from 'react'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute'

const Home = lazy( () => import("./pages/Home") ) // Lazy loading Home component
const Login = lazy( () => import("./pages/Login") ) // Lazy loading 
const Chat = lazy( () => import("./pages/Chat") ) // Lazy loading 
const Groups = lazy( () => import("./pages/Groups") ) // Lazy loading 
const NotFound = lazy( () => import("./pages/NotFound") ) // Lazy loading 

let user = true;

function App() {
  return (
    <BrowserRouter>
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

