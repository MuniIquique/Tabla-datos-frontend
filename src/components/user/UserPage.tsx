import GeneralTable from "../tables/adminTable/GeneralTable"
import dataService from '../../services/handleRequests'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

const UserPage = () => {
    // Estados para manejar el comportamiento del componente:
    const [userName, setUserName] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const token = localStorage.getItem('jwt')

    const greetingsArray = ['Bienvenido', 'Buenas', 'Saludos']
    const greeting = greetingsArray[Math.floor(Math.random() * 3)]

    useEffect(() => {
        const getData = async () => {
            try {
                const user = await dataService.getUserData(token)
                setUserName(user.nombres)
            } catch(error: any) {
                console.log(error.response.data.error)
            }
        }
        getData()
    }, [])

    // Revisando si hay un usuario loggeado:
    useEffect(() => {
        const loggedUser = window.localStorage.getItem('loggedUser')
        if (loggedUser) {
            const user = JSON.parse(loggedUser)
            setUserName(user.nombres)
        }
    }, [])

    // Función para manejar el logout:
    const handleLogout = async () => {
        setLoading(true)
        try {
            await dataService.logout(token)
            // console.log(logout.message)
            localStorage.removeItem('jwt')
            navigate('/login')
        } catch(error: any) {
            console.log(error.response.data.error)
        }
        setLoading(false)
    }

    return (
        <div className="bg-gradient-to-b from-white to-slate-200 h-fit min-h-screen">
            <h2 className="text-3xl font-bold text-gray-900 underline underline-offset-4 ml-24 mb-2">Conectado como usuario</h2>
            <h3 className="text-xl font-bold text-gray-900 ml-24">{greeting}, <i className="not-italic text-indigo-700">{userName}</i></h3>
            <button
                className={!loading ? "block w-fit ml-24 mt-4 py-1.5 text-l text-center items-center rounded-md bg-indigo-200 px-2 font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 hover:cursor-pointer hover:ring-indigo-800 hover:bg-indigo-300" : "block w-fit ml-24 mt-4 py-1.5 text-l text-center items-center rounded-md bg-gray-200 px-2 font-medium text-black ring-1 ring-inset ring-gray-700/10"}
                onClick={handleLogout}
            >
                <span>Cerrar sesión</span>
            </button>
            {
                loading ? <p className="ml-24">Cerrando sesión...</p> : ''
            }
            <GeneralTable rol={"user"} />
        </div>
    )
}

export default UserPage