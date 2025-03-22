import { useState } from 'react'
import './App.css'
import { Register, Login } from './pages'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Register />
      <Login />
    </>
  )
}

export default App
