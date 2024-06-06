import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BASE_URL } from '../../helpers/config'
import useValidation from '../custom/useValidation'
import Spinner from '../layouts/Spinner'
import { AuthContext } from '../context/authContext'
import './Login.css'


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState(null)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { accessToken, setAccessToken, setCurrentUser} = useContext(AuthContext)


    useEffect(() => {
        if (accessToken) navigate('/')
    }, [accessToken])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors(null)
        setLoading(true)
        const data = { email, password}

        try {
            const response = await axios.post(`${BASE_URL}/user/login`, data)
            if (response.data.error) {
                setLoading(false)
                toast.error(response.data.error)
            }else {
                localStorage.setItem('currentToken', JSON.stringify(response.data.currentToken))
                setAccessToken(response.data.currentToken)
                setCurrentUser(response.data.user)
                setLoading(false)
                setEmail('')
                setPassword('')
                toast.success(response.data.message)
                navigate('/')
            }
        } catch (error) {
            setLoading(false)
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors)
            }
            console.log(error)
        }
    }

    return (

        <div className="main">
            <h1>Daily project</h1>
            <h3>Ingrese sus credenciales</h3>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="username">Email:</label>
                <input 
                    type="email" 
                    id="username" 
                    name="username" 
                    
                    placeholder="Ingrese email" 
                    // required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    
                />
                { useValidation(errors, 'email')}
                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Ingrese Password" 
                    // required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                { useValidation(errors, 'password')}
                
                { 
                loading ? 
                <Spinner />
                :
                <div className="wrap">
                    <button type="submit">
                        Submit
                    </button>
                </div>
            }
            </form>
        </div>
    )
}