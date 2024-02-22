import { ChangeEvent, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import dataService from '../../services/handleRequests'
import { BiCheck } from "react-icons/bi"
import { BiLeftArrowAlt } from "react-icons/bi"

const newPassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [reEnterPassword, setReEnterPassword] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [unmatching, setUnmatching] = useState('')
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

    const navigate = useNavigate()
    const location = useLocation()
    const token = new URLSearchParams(location.search).get('token')

    useEffect(() => {
        const validateToken = async () => {
            try {
                const isValid = await dataService.validateToken(token)
                if (isValid.valid) {
                    console.log('Valid token! ')
                } else {
                    navigate('/login')
                }
            } catch (error) {
                navigate('/login')
            }
        }

        validateToken()
    }, [])

    const handleNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value)
    }

    const handleReEnterPassword = (event: ChangeEvent<HTMLInputElement>) => {
        const enteredValue = event.target.value;
        setReEnterPassword(enteredValue);

        if (reEnterPassword.length > newPassword.length || (reEnterPassword.length === newPassword.length && newPassword !== reEnterPassword)) {
            setUnmatching('Las contraseñas no coinciden.')
        } else {
            setUnmatching('')
        }
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (newPassword !== '') {
            try {
                const restorePassword = await dataService.restorePasword(newPassword, token)
                if (restorePassword.message) {
                    setSuccessMessage(restorePassword.message)
                    setTimeout(() => {
                        setSuccessMessage('')
                    }, 5000)
                } else if (restorePassword.error) {
                    setErrorMessage(restorePassword.error)
                    setTimeout(() => {
                        setErrorMessage('')
                    }, 5000)
                }
            } catch(error) {
                console.log(error)
            }
        } else if (!regex.test(newPassword)) {
            setErrorMessage('Ingrese una contraseña válida.')
        } else {
            setErrorMessage('Debe ingresar una contraseña!')
        } 
    }

    const goBack = () => {
        navigate('/login')
    }

    return (
        <div className="flex flex-col justify-center">
            <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 underline underline-offset-">
                        Cambio de Contraseña
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="mt-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            Ingrese una nueva contraseña:
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            required={true}
                            onChange={handleNewPassword}
                            className="mb-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
                        />
                        <label htmlFor="reEnterPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            Re-ingrese la contraseña:
                        </label>
                        <input
                            type="password"
                            name="reEnterPassword"
                            id="reEnterPassword"
                            required={true}
                            onChange={handleReEnterPassword}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
                        />
                        {
                            unmatching !== ''
                            ? (
                                <p className="mt-2 text-red-600">{unmatching}</p>
                            ) : ''
                        }
                        <button
                            type="submit"
                            className="flex w-full justify-center mt-10 rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                            onClick={handleSubmit}
                            >
                            Reestablecer contraseña
                        </button>
                    </form>
                    <div>
                    <button
                        className="flex flex-row mt-5 cursor-pointer hover:text-amber-700 hover:underline hover:underline-offset-2"
                        onClick={goBack}
                    >
                        <BiLeftArrowAlt size={24} />
                        <span>Volver al Inicio de Sesión</span>
                    </button>
                </div>
                </div>
                <div className="flex items-center justify-center mt-10">
                    <ul className="flex flex-col list-disc text-sm mt-2 font-medium leading-6 text-gray-900">
                        <p className="text-base mb-2">La contraseña debe contener:</p>
                        <li>Mínimo 8 letras o números.</li>
                        <li>Al menos 1 mayúscula.</li>
                        <li>Al menos 1 minúscula.</li>
                        <li>Al menos 1 número.</li>
                        <li>Puede contener símbolos.</li>
                    </ul>
                </div>
                
                {
                    successMessage !== ''
                    ? (
                        <div className="flex flex-col bg-green-100 w-fit py-4 px-4 rounded-lg items-center border-2 border-green-300 m-auto">
                            <div className="flex flex-row gap-2 font-bold">
                                <BiCheck  size={24} />
                                <h1>{successMessage}</h1>
                            </div>
                            <p className="mt-4">Ya puede cerrar esta pestaña.</p>
                        </div>
                    ) : ''
                }
                {
                    errorMessage !== ''
                    ? (
                        <>
                            <div className="flex flex-col bg-red-100 w-fit py-4 px-4 rounded-lg items-center border-2 border-red-300 m-auto">
                                <div className="flex flex-row gap-2 font-bold">
                                    <BiCheck  size={24} />
                                    <h1>{errorMessage}</h1>
                                </div>
                            </div>
                        </>
                    ) : ''
                }
            </div>
        </div>
    )
}

export default newPassword