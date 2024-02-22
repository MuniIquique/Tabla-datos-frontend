import { ChangeEvent, useEffect, useState } from "react"

// Interfaz para el componente:
interface tableCell {
    getValue: () => '',
    row: any,
    column: any,
    table: any
}

const TableCell: React.FC<tableCell> = ({ getValue, row, column, table }) => {
    const initialValue = getValue()
    const tableMeta = table.options.meta
    const [value, setValue] = useState('')
    const [newValue, setNewValue] = useState<string | null>(null)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        setNewValue(event.target.value)
        table.options.meta?.updateData(row.index, column.id, event.target.value)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewValue(event.target.value)
        table.options.meta?.updateData(row.index, column.id, event.target.value)
    }

    // Generando un saludo aleatorio para mostrar:
    const dependencies = ['Municipalidad norte', 'Municipalidad centro', 'Municipalidad sur']
    const generateDependencies = dependencies.filter(item => item !== value)

    const userValue = ['user', 'admin', 'superAdmin']
    const generateUserValue = userValue.filter(item => item !== value)

    // Renderizando distintos inputs dependiendo de la columna y del rol del usuario:
    if (tableMeta?.newRows[row.id]) {
        return column.id === 'dependencias' ? (
            // Renderizando dependencias generadas con generateDependencies():
            <select className="items-center py-0.5 pl-1 max-w-fit" onChange={handleSelect}>
                <option value="">{value}</option>
                {
                    generateDependencies.map(item => {
                        return <option key={`dependencyItem${item}`} value={`${item}`}>{item}</option>
                    })
                }
            </select>
        ) : column.id === 'rol' && localStorage.getItem('userRol') === 'superAdmin' ? (
            // Renderizando valores de usuario generados con generateUserValue():
            <select className="items-center py-0.5 pl-1 w-fit" onChange={handleSelect}>
                <option value={value}>{value}</option>
                {
                    generateUserValue.map(item => {
                        return <option key={`userValueItem${item}`} value={`${item}`}>{item}</option>
                    })
                }
            </select>
        ) : column.id === 'rol' && localStorage.getItem('userRol') === 'admin' ? (
            <span>{value}</span>
        ) : (
            <input
                value={newValue ?? value}
                onChange={handleChange}
                type={column.columnDef.meta?.type || "text"}
                className='items-center py-0.5 px-1 w-[96%] max-w-36'
            />
        )
    }
    return <span>{value}</span>
    
}

export default TableCell