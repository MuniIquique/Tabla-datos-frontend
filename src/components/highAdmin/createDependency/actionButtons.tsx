import dataService from '../../../services/handleRequests'

// Interfaz para el componente:
interface actionButtons {
    toggleEdit: () => void,
    edit: boolean,
    index: number,
    number: number | null,
    rerender: () => void
}

const ActionButtons: React.FC<actionButtons> = ({ toggleEdit, edit, index, number, rerender }) => {
    // Función para eliminar una dependencia:
    const handleDelete = async () => {
        if (confirm('¿Quieres eliminar esta dependencia?')) {
            try {
                const jwtToken = localStorage.getItem('jwt')
                const deletion = await dataService.deleteDependency(index, jwtToken)
                console.log(deletion.message)
                rerender()
            } catch(error: any) {
                console.log(error.response.data.error)
            }
        }
    }
        
    return (
        <>
            <button
                className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mr-1 hover:bg-indigo-200"
                onClick={toggleEdit}
            >
                {edit && index === number
                    ? 'Cancelar'
                    : 'Editar'
                }
            </button>
            <button
                className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 mr-1 hover:bg-red-200"
                onClick={handleDelete}    
            >
                Eliminar dependencia
            </button>
        </>
    )
}

export default ActionButtons