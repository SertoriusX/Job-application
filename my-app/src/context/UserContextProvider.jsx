import React, { useState } from 'react'
import UserContext from './UserContext'

export default function UserContextProvider({ children }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(localStorage.getItem('role'))

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const saveToken = (newToken, newRole) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('role', newRole)
    setToken(newToken)
    setRole(newRole)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken(null)
    setRole(null)
  }

  return (
    <UserContext.Provider
      value={{ form, setForm, saveToken, logout, token, role, handleChange }}
    >
      {children}
    </UserContext.Provider>
  )
}

