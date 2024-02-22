import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import handleRequest from '../../services/handleRequests'
import rutFormater from '../../services/rutFormater'

const Login = () => {
    // Estados para manejar el comportamiento del componente:
    const [rut, setRut] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [rutError, setRutError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    
    const handleRut = (event: ChangeEvent<HTMLInputElement>) => {        
        if (rutFormater(event.target.value)) {
            setRut(event.target.value)
            setRutError('')
        } else {
            return
        }
    }
    
    // Cambiando el valor de la password cuando se ingresa un valor al input:
    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
        setPasswordError('')
    }

    // Verificando las credenciales del login y navegando a otro componente:
    const handleAuth = async (rut: string, password: string) => {
        try {
            const res = await handleRequest.verify(rut, password)
            localStorage.setItem('jwt', res.token)

            if (res.access === 'admin') {
                navigate('/data/admin')
                localStorage.setItem('userRol', 'admin')
            } else if (res.access === 'superAdmin') {
                navigate('/data/superadmin ')
                localStorage.setItem('userRol', 'superAdmin')
            } else if (res.access === 'user') {
                navigate('/data/user')
                localStorage.setItem('userRol', 'user')
            }
            window.localStorage.setItem('loggedUser', JSON.stringify(res))
        } catch(error: any) {
            if (error.response.data.rut) {
                setRutError(error.response.data.rut)
            } else if (error.response.data.password) {
                setPasswordError(error.response.data.password)
            } else {
                console.log(error.response.data)
            }
        }
    }

    // Componente para cambiar la contraseña:
    const recoverPassword = () => {
        navigate('/recoverPassword')
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setLoading(true)
        await handleAuth(rut, password)
        setLoading(false)
    }

    return (
        <div className="flex">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 underline underline-offset-2">
                        Ingresar al sistema
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="rut" className="block text-sm font-medium leading-6 text-gray-900">
                                Rut
                            </label>
                            <div className="mt-2">
                                <input
                                    id="rut"
                                    name="rut"
                                    type="rut"
                                    autoComplete="rut"
                                    required
                                    className="block w-full rounded-md border-0 mb-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                    placeholder="Ingrese su rut..."
                                    value={rut}
                                    onChange={handleRut}
                                />
                            </div>
                            {
                                rutError !== '' ? (
                                    <p className="text-rose-600 text-sm font-medium">{rutError}</p>
                                ) : ''
                            }
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Contraseña:
                                </label>
                                <div className="text-sm">
                                    <button onClick={recoverPassword} className="font-semibold text-cyan-600 hover:text-cyan-500 cursor-pointer">
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2">
                                    <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 mb-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Ingrese su contraseña..."
                                    onChange={handlePassword}
                                    />
                            </div>
                            {
                                passwordError !== '' ? (
                                    <p className="text-rose-600 text-sm font-medium">{passwordError}</p>
                                ) : ''
                            }
                        </div>

                        <button
                        type="submit"
                        className={!loading ? "flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline" : "flex w-full justify-center rounded-md bg-gray-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"}
                        onClick={handleSubmit}
                        disabled={loading}
                        >
                            Ingresar
                        </button>
                    </form>
                    {
                        loading ? <p>Cargando...</p> : ''
                    }
                </div>
            </div>
        </div>
    )
}

export default Login