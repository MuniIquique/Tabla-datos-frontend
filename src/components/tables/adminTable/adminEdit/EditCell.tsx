import { BiX, BiSolidSave, BiEdit } from "react-icons/bi";

// Interfaz para la tabla:
interface editCell {
    row: any,
    table: any,
}

const EditCell: React.FC<editCell> = ({ row, table }) => {
    // Esta definición permite acceder a las funciones de la definición de la tabla (en generalTable.tsx):
    const meta = table.options.meta
    

    const setNewRows = (name: string) => {
        meta?.setNewRows((old: []) => ({
            ...old,
            [row.id]: !old[row.id]
        }))

        if (name !== 'editar') {
            meta?.revertData(row.index, name === 'cancelar')
        }
    }

    // Renderizando distintos botones de acción dependiendo de si se está editando o visualizando (como admin):
    return meta?.newRows[row.id] ? (
        <div className="flex flex-row justify-center">
            <a className="cursor-pointer py-0 px-2" onClick={() => setNewRows('cancelar')} title="Cancelar">
                <BiX size={26} className="hover:text-rose-700" />
            </a>
            {" "}
            <a className="cursor-pointer py-0 px-2" onClick={() => setNewRows('guardar')} title="Guardar">
                <BiSolidSave size={26} className="hover:text-lime-600" />
            </a>
        </div>
    ) : row.original.rol === 'admin' || row.original.rol === 'superAdmin' ? '' : (
        <div className="flex flex-row justify-center">
            <a className="cursor-pointer py-0 px-2" onClick={() => setNewRows('editar')} title="Editar">
                <BiEdit size={26} className="hover:text-green-500" />
            </a>
        </div>
    )
}

export default EditCell