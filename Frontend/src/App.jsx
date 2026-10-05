  import React from 'react'
  import {BrowserRouter as Router,Routes,Route, Navigate} from 'react-router-dom'
  import CreatePost from './pages/CreatePost.jsx'
  import Feed from './pages/Feed.jsx'
  import Profile from './pages/profile.jsx'
  import Login from './pages/Login.jsx'
  import Register from './pages/Register.jsx'
  import Message from './pages/Message.jsx'
  import ProtectedRoutes from './components/ProtectedRoute.jsx'
  import AppLayout from './components/AppLayout.jsx'

  const App = () => {
    return (
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/Login"/>}></Route>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/create-post' element={<ProtectedRoutes><CreatePost /></ProtectedRoutes>} />

          

          <Route
              element={
                <ProtectedRoutes>
                  <AppLayout />
                </ProtectedRoutes>
              }
          > 

            <Route path='/profile' element={<Profile /> } />
            <Route path='/feed' element={<Feed />} />
            <Route path='/messages' element={<Message />} />
          </Route>
          
        </Routes>
      </Router>
    )
  }

  export default App
