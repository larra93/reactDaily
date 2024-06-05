import { BrowserRouter, Route, Routes } from "react-router-dom"

import  axios  from 'axios'
import './App.css'
import Home from "./Components/Home"
import Header from "./Components/layouts/Header"
import Register from "./Components/auth/Register"
import { getConfig, BASE_URL } from "./helpers/config"
import { AuthContext } from "./Components/context/authContext"
import { useEffect, useState } from "react"
import Login from "./Components/auth/Login"









function App() {

  const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem('currentToken')))
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const fetchCurrentlyLoggedInUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user`, getConfig(accessToken))
        setCurrentUser(response.data.user)
      } catch (error) {
          if (error?.response?.status === 401) {
              localStorage.removeItem('currentToken')
              setCurrentUser(null)
              setAccessToken('')
          }
          console.log(error)
      }
    }
    if (accessToken) fetchCurrentlyLoggedInUser()
  }, [accessToken])

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, currentUser, setCurrentUser}}>
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={ <Home /> } />
      <Route path="/login" element={ <Login /> } />
      <Route path="/register" element={ <Register /> } />
    </Routes>
  </BrowserRouter>
  </AuthContext.Provider>
  )
}

export default App
