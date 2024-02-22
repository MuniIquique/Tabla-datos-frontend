// Importando componentes y módulos:
import { ColumnDef, useReactTable, getCoreRowModel, flexRender, RowData, createColumnHelper, VisibilityState } from '@tanstack/react-table'
import CreateDependency from '../../highAdmin/createDependency/createDependency'
import ExcelComponent from '../../highAdmin/HandleExcel/ExcelComponent'
import handleFilterRequest from '../../../services/handleFilterRequest'
import CreateUser from '../../highAdmin/createUser/createUser'
import dataService from '../../../services/handleRequests'
import { ChangeEvent, useEffect, useState } from 'react'
import { Message } from "../message/Message"

// Celdas editables:
import EditAdminCell from './superAdminEdit/EditAdminCell'
import TableCell from './tableCell/TableCell'
import EditCell from './adminEdit/EditCell'

// Iconos:
import { BiSolidChevronsRight } from "react-icons/bi"
import { BiSolidChevronRight } from "react-icons/bi"
import { BiSolidChevronsLeft } from "react-icons/bi"
import { BiSolidChevronLeft } from "react-icons/bi"
import { RiFileExcel2Fill } from "react-icons/ri";
import { BiSolidUserPlus } from "react-icons/bi"
import { BiImageAdd } from "react-icons/bi"

// Declaración de módulo para la tabla:
declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void,
        uploadData: any,
        newRows: any,
        setNewRows: any,
        revertData: any,
        removeRow: any,
        makeAdmin: any
    }
}

// Forma de la fila:
type Employee = {
    rut: string,
    nombres: string,
    apellidos: string,
    email: string,
    rol: string,
    dependencias: string,
    direcciones: string,
    numMunicipal: string,
    anexoMunicipal: number
}

// Editar info en una celda:
const defaultColumn: Partial<ColumnDef<Employee>> = {
    cell: ({ getValue }) => {
        const initialValue = getValue()
        const [value, setValue] = useState(initialValue)

        return (
            <input 
                value={value as string}
                onChange={e => setValue(e.target.value)}
            />
        )
    }
}

const columnhelper = createColumnHelper<Employee>()

// Interfaces (definen los tipos de un elemento):
interface adminTable {
    rol: string
}

interface arrayInterface {
    rowIndex: number,
    columnId: string,
    value: unknown
}

// Componente principal:
const GeneralTable: React.FC<adminTable> = ({ rol }) => {
    // Info de la tabla:
    const [data, setData] = useState<Employee[]>([])
    const [cancelChange, setCancelChange] = useState<Employee[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    // Funcionamiento de la tabla:
    const [newRows, setNewRows] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ 'edit': false, 'rut': false, 'rol': false })

    // Valores para los filtros:
    const [searchValue, setSearchValue] = useState('')
    const [searchColumn, setSearchColumn] = useState('')
    const [filterColumn, setFilterColumn] = useState('')
    const [filterOrder, setFilterOrder] = useState('normal')
    const [showMessage, setShowMessage] = useState(false)
    
    // Estado para guardar temporáneamente datos editados:
    const [tempData, setTempData] = useState<arrayInterface[]>([])

    // Función para rerenderizar la tabla. Se usa al cambiar de página:
    const rerender = async () => {
        const token = localStorage.getItem('jwt')
        if (filterColumn !== '') {   
            try {
                const users = await dataService.getFilteredUsers(filterColumn, filterOrder, pageSize, page, token)
                setData(users.content)
                setCancelChange(users.content)
                setTotal(users.totalData)
            } catch(error: any) {
                console.log(error.response.data.error)
            }
        } else {
            try {
                const users = await dataService.getUsers(searchValue, searchColumn, pageSize, page, token)
                setData(users.content)
                setCancelChange(users.content)
                setTotal(users.totalData)
            } catch(error: any) {
                console.log(error.response.data.error)
            }
        }
    }

    // Función inicial que trae datos desde el servidor a la tabla:
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('jwt')
                const data = await dataService.getUsers(searchValue, searchColumn, pageSize, page, token)
                setData(data.content)
                setCancelChange(data.content)
                setTotal(data.totalData)
                rol !== 'user' ? setColumnVisibility({ 'edit': true }) : ''
            } catch(error: any) {
                console.error(error.response.data.error)
            }
        }
        fetchData()
    }, [])

    // Rerenderizando la tabla cada vez que cambia {page}:
    useEffect(() => {
        rerender()
    }, [page])
    
    // Definición de las columnas:
    const columns = [
        columnhelper.group({
            id: 'Persona',
            header: () => <span>Persona</span>,
            columns: [
                columnhelper.accessor('rut', {
                    header: 'Rut',
                    id: 'rut',
                    cell: TableCell,
                    meta: {
                        type: "text"
                    }
                }),
                columnhelper.accessor('nombres', {
                    header: 'Nombres',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                }),
                columnhelper.accessor('apellidos', {
                    header: 'Apellidos',
                    cell: TableCell,
                    meta: {
                        type: "text"
                    }
                }),
                columnhelper.accessor('email', {
                    header: 'Correo',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                })
            ]
        }),
        columnhelper.group({
            id: 'Muni info',
            header: () => <span>Muni info</span>,
            columns: [
                columnhelper.accessor('rol', {
                    header: 'Rol',
                    id: 'rol',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                }),
                columnhelper.accessor('dependencias', {
                    header: 'Dependencias',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                }),
                columnhelper.accessor('direcciones',{
                    header: 'Dirección',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                }),
                columnhelper.accessor('numMunicipal',{
                    header: 'N° Municipal',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                }),
                columnhelper.accessor('anexoMunicipal',{
                    header: 'Anexo Municipal',
                    cell: TableCell,
                    meta: {
                        type: 'number'
                    }
                })
            ]
        }),
        columnhelper.display({
            header: 'Acciones',
            id: "edit",
            cell: rol === 'superAdmin'
                ? EditAdminCell
                : rol === 'admin' ? EditCell : ''
        }),
    ]

    // Definición de la tabla:
    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        state: {
            columnVisibility
        },
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        meta: {
            newRows,
            setNewRows,
            revertData: (rowIndex: number, revert: boolean) => {
                if (revert) {
                    setData((old) =>
                        old.map((row, index) =>
                            index === rowIndex ? cancelChange[rowIndex] : row
                        )
                    );
                } else {
                    setCancelChange((old) =>
                        old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))    
                    )
                }
                rerender()
            },
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
                const newData: arrayInterface = {
                    rowIndex,
                    columnId,
                    value
                }
                
                setTempData(prev => [
                    ...prev,
                    newData
                ])
            },
            uploadData: async () => {
                if (confirm('¿Quieres actualizar este usuario?')) {
                    const jwtToken = localStorage.getItem('jwt')

                    const filteredData = Object.values(
                        tempData.reduce((acc: any, item: any) => {
                          const key = `${item.rowIndex}_${item.columnId}`
                          acc[key] = item
                          return acc
                        }, {})
                      )
                    try {
                        const update = await dataService.updateUser(filteredData, pageSize, page, jwtToken)
                        console.log(update.message)
                        rerender()
                    } catch(error: any) {
                        console.log(error.response.data.error)
                    }
                }
            },
            removeRow: async (rowIndex: number) => {
                const decision = window.confirm('¿Quieres eliminar este usuario?')
                if (decision) {
                    try {
                        const token = localStorage.getItem('jwt')
                        const deletion = await dataService.deleteUser(cancelChange[rowIndex].rut, token)
                        console.log(deletion.message)
                    } catch(error: any) {
                        console.log(error.response.data.error)
                    }
                }
                rerender()
            },
            makeAdmin: async (rowIndex: number) => {
                const decision = window.confirm(cancelChange[rowIndex].rol === 'user' ? `¿Quieres que este usuario se convierta en admin?` : `¿Quieres que este usuario deje de ser admin?`)
                if (decision) {
                    try {
                        const token = localStorage.getItem('jwt')
                        const request = await dataService.makeAdmin(cancelChange[rowIndex].rut, token)
                        console.log(request.message)
                    } catch(error: any) {
                        console.log(error.response.data.error)
                    }
                    rerender()
                }
            }
        }
    })

    // Actualizando el orden de una columna de la tabla:
    const handleFilter = (column: string) => {
        setFilterColumn(column)
        const token = localStorage.getItem('jwt')
        if (filterOrder === 'asc') {
            handleFilterRequest.toggleFilter(column, 'desc', searchValue, searchColumn, pageSize, page, token)
                .then(res => {
                    setData(res.content)
                    setCancelChange(res.content)
                })
            setFilterOrder('desc')
        } else if (filterOrder === 'desc') {
            handleFilterRequest.toggleFilter(column, 'normal', searchValue, searchColumn, pageSize, page, token)
                .then(res => {
                    setData(res.content)
                    setCancelChange(res.content)
                })
            setFilterOrder('normal')
        } else if (filterOrder === 'normal') {
            handleFilterRequest.toggleFilter(column, 'asc', searchValue, searchColumn, pageSize, page, token)
                .then(res => {
                    setData(res.content)
                    setCancelChange(res.content)
                })
            setFilterOrder('asc')
        }
    }

    // Cambiando el valor de filtrado de una columna de la tabla:
    const handleSearchFilter = (event: ChangeEvent<HTMLInputElement>, column: any) => {
        setSearchValue(event.target.value)
        setSearchColumn(column)
        
        const timeout = setTimeout(async () => {
            const token = localStorage.getItem('jwt')
            const res = await handleFilterRequest.searchFilter(column, event.target.value, pageSize, page, token)
            res.content.length === 0 ? setShowMessage(true) : setShowMessage(false)

            setData(res.content)
            setCancelChange(res.content)
            setTotal(res.totalData)
        }, 500)
        return () => clearTimeout(timeout)
    }

    // Cambiando el tamaño de la página:
    const handlePageSize = async (event: ChangeEvent<HTMLSelectElement>) => {
        try {
            const token = localStorage.getItem('jwt')
            const req = await dataService.getUsers(searchValue, searchColumn, Number(event.target.value), page, token)
            console.log(req.message)
            setData(req.content)
            setCancelChange(req.content)
    
            table.setPageSize(Number(event.target.value))
            setPageSize(Number(event.target.value))
        } catch(error: any) {
            console.log(error.response.data.error)
        }
    }

    // Funciones para mostrar/ocultar las secciones de excel, dependencias y creación de usuario:
    const handleNewUser = () => {
        document.getElementById('newUserContainer')?.classList.toggle('invisible')
        document.getElementById('newUserFormBG')?.classList.toggle('opacity-0')
        document.getElementById('newUserFormBG')?.classList.toggle('opacity-50')
        document.getElementById('newUserForm')?.classList.toggle('translate-x-full')
        rerender()
    }

    const handleNewDependency = () => {
        document.getElementById('newDependencyContainer')?.classList.toggle('invisible')
        document.getElementById('newDependencyBG')?.classList.toggle('opacity-0')
        document.getElementById('newDependencyBG')?.classList.toggle('opacity-50')
        document.getElementById('newDependency')?.classList.toggle('translate-x-full')
        rerender()
    }

    const handleExcelFiles = () => {
        console.log('yo')
        document.getElementById('handleExcelContainer')?.classList.toggle('invisible')
        document.getElementById('handleExcelBG')?.classList.toggle('opacity-0')
        document.getElementById('handleExcelBG')?.classList.toggle('opacity-50')
        document.getElementById('handleExcel')?.classList.toggle('translate-x-full')
        rerender()
    }

    // Tabla principal:
    return (
       <div className="p-2">
            <table className="border-solid border-1 border-gray-100 block w-fit border-collapse my-6 mx-auto text-base shadow-md">
                <thead>
                    {table.getHeaderGroups().map(group => (
                        <tr key={group.id}>
                            {group.headers.map(header => (
                                <th key={header.id} colSpan={header.colSpan} className="bg-zinc-200 border-2 border-solid border-gray-300 py-0.5 px-1">
                                    {header.isPlaceholder ? null : (
                                    <>
                                        <div className={header.id === 'edit' || header.id === '1_Muni info_rol' || header.id === '1_Persona_rut' ? '' : 'cursor-pointer select-none hover:underline hover:underline-offset-2'}
                                        onClick={() => header.id === 'edit' || header.id === '1_Muni info_rol' || header.id === '1_Persona_rut' ? '' : handleFilter(header.id)}
                                        title={header.id === 'edit' || header.id === '1_Muni info_rol' || header.id === '1_Persona_rut' ? '' :  `Filtrar por ${header.id}`}
                                        >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        </div>
                                        {header.column.getCanFilter() ? (
                                        <div>
                                            {/* header.column */}
                                            <input
                                                type="text"
                                                onChange={event => handleSearchFilter(event, header.column.id)}
                                                placeholder='Buscar...'
                                                className="w-28 p-1 rounded my-2"
                                            />
                                        </div>
                                        ) : null}
                                    </>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="border-b border-solid border-gray-100">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="border-b border-solid border-gray-300 odd:bg-white even:bg-#f3f3f3" >
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className={ (row.original.rol === 'admin' || row._valuesCache.rol === 'superAdmin') && rol !== 'user'
                                    ? "text-left py-2 px-2.5 border-r border-solid border-gray-300 bg-cyan-50 wax-w-1 max-h-2"
                                    : "text-left py-2 px-2.5 border-r border-solid border-gray-300 wax-w-1 max-h-2"}
                                >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={rol === 'user' ? 2 : 5}>
                            <div className="flex justify-start p-2">
                                <p className="font-medium">
                                    Mostrando <span className="underline decoration-1 underline-offset-2">{data.length}</span> de <span className="underline decoration-1 underline-offset-2">{total}</span> registros
                                </p>
                            </div>
                        </td>
                        <td colSpan={rol === 'user' ? 6 : 5}>
                            <div className="flex justify-end p-2 gap-6">
                                <span className="flex items-center gap-2">
                                    <p>Página actual:</p>
                                    <strong>
                                        { page === 0 ? 1 : page } de {' '}
                                        { Math.floor(total / pageSize) + 1 }
                                    </strong>
                                </span>
                                <span className="flex items-center gap-2">
                                    Ir a la página:
                                    <input
                                        type="text"
                                        value={page}
                                        onChange={event => {
                                            const inputValue = event.target.value
                                            const newPage = Number(inputValue)
                                          
                                            if (!Number.isNaN(newPage) && newPage > -1) {
                                              const totalPages = Math.ceil(total / pageSize)
                                              const validPage = Math.min(newPage, totalPages)
                                          
                                              setPage(validPage)
                                              rerender()
                                            }
                                          }}
                                        className={ Number(page) < 10 ? "px-2 py-1 rounded w-10" : "px-1 py-1 rounded w-10" }
                                    />
                                </span>
                                <select onChange={handlePageSize} className="px-2 py-1 rounded w-32">
                                    {[10, 20, 30, 40, 50].map((number) => (
                                        <option key={number} value={number}>
                                        Mostrar {number}
                                        </option>
                                    ))}
                                </select>
                                <span className="flex items-center gap-1">
                                    <button
                                        className={page - 1 <= 0 ? "cursor-default py-1 px-1 border text-gray-300 border-slate-300 bg-white rounded" : "cursor-pointer py-1 px-1 border border-slate-300 bg-white hover:bg-gray-100 rounded"}
                                        onClick={() => setPage(1)}
                                        disabled={page - 1 <= 0 ? true : false}
                                        title={page - 1 <= 0 ? '' : "Ir al principio"}
                                    >
                                        <BiSolidChevronsLeft size={24} />
                                    </button>
                                    <button
                                        className={page - 1 <= 0 ? 'cursor-default py-1 px-1 border text-gray-300 border-slate-300 bg-white rounded' : "cursor-pointer py-1 px-2 border border-slate-300 bg-white hover:bg-gray-100 rounded nav-button"}
                                        onClick={() => setPage(page - 1 < 1 ? 1 : page - 1)}
                                        disabled={page - 1 <= 0 ? true : false}
                                        title={page - 1 <= 0 ? '' : "Ir a la anterior página"}
                                        >
                                        <BiSolidChevronLeft size={24} />
                                    </button>
                                    <button
                                        className={page + 1 > Math.floor(total / pageSize) + 1 ? 'cursor-default py-1 px-1 border text-gray-300 border-slate-300 bg-white rounded' : "cursor-pointer py-1 px-2 border border-slate-300 bg-white hover:bg-gray-100 rounded nav-button"}
                                        onClick={() => {
                                            setPage(page + 1)
                                            
                                        }}
                                        disabled={page + 1 > Math.floor(total / pageSize) + 1 ? true : false}
                                        title={page + 1 > Math.floor(total / pageSize) + 1 ? '' : "Ir a la siguiente página"}
                                    >
                                        <BiSolidChevronRight size={24} />
                                    </button>
                                    <button
                                        className={page + 1 > Math.floor(total / pageSize) + 1 ? 'cursor-default py-1 px-1 border text-gray-300 border-slate-300 bg-white rounded' : "cursor-pointer py-1 px-2 border border-slate-300 bg-white hover:bg-gray-100 rounded nav-button"}
                                        onClick={() => setPage(Math.floor(total / pageSize) + 1)}
                                        disabled={page + 1 > Math.floor(total / pageSize) + 1 ? true : false}
                                        title={page + 1 > Math.floor(total / pageSize) + 1 ? '' : "Ir a la última página"}
                                    >
                                        <BiSolidChevronsRight size={24} />
                                    </button>
                                </span>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
            {rol === 'superAdmin' ?
                <span className="flex flex-row justify-center">
                    <div className="flex justify-start pt-2 min-w-fit">
                        <button className="flex mr-2 gap-1 rounded-md bg-lime-50 px-1 py-1 ring-1 ring-inset ring-lime-600/20 hover:bg-lime-200 hover:ring-lime-500" onClick={handleExcelFiles}>
                            <RiFileExcel2Fill className="text-lime-700" size={22} />
                            <span className="text-base text-lime-700 pr-1">Gestionar Excel</span>
                        </button>
                    </div>

                    <div className="flex justify-start pt-2 min-w-fit">
                        <button className="flex mr-2 gap-1 rounded-md bg-yellow-50 px-1 py-1 ring-1 ring-inset ring-yellow-600/20 hover:bg-yellow-200 hover:ring-yellow-500" onClick={handleNewDependency}>
                            <BiImageAdd className="text-yellow-700" size={24} />
                            <span className="text-base text-yellow-700 pr-1">Gestionar Dependencias</span>
                        </button>
                    </div>

                    <div className="flex justify-start pt-2 min-w-fit">
                        <button className="flex mr-2 gap-1 rounded-md bg-green-50 px-1 py-1 ring-1 ring-inset ring-green-600/20 hover:bg-green-200 hover:ring-green-500" onClick={handleNewUser}>
                            <BiSolidUserPlus className="text-green-700" size={24} />
                            <span className="text-base text-green-700 pr-1">Crear Usuario</span>
                        </button>
                    </div>
                </span>
            : ''}
            {/* Secciones: */}
            <div id="newUserContainer" className="fixed inset-0 w-full h-full invisible">
                <div id="newUserFormBG" className="w-full h-full duration-500 ease-out transition-all inset-0 absolute bg-gray-900 opacity-0" onClick={handleNewUser}></div>
                <div id="newUserForm" className="w-2/5 h-full duration-150 ease-out transition-all absolute bg-gradient-to-tl from-bg-slate-400 to-bg-white right-0 top-0 translate-x-full">
                    <CreateUser onFinish={handleNewUser} />
                </div>
            </div>
            <div id="newDependencyContainer" className="fixed inset-0 w-full h-full invisible">
                <div id="newDependencyBG" className="w-full h-full duration-500 ease-out transition-all inset-0 absolute bg-gray-900 opacity-0" onClick={handleNewDependency}></div>
                <div id="newDependency" className="w-2/5 h-full duration-150 ease-out transition-all absolute bg-gradient-to-tl from-bg-slate-400 to-bg-white right-0 top-0 translate-x-full">
                    <CreateDependency onFinish={handleNewDependency} />
                </div>
            </div>
            <div id="handleExcelContainer" className="fixed inset-0 w-full h-full invisible">
                <div id="handleExcelBG" className="w-full h-full duration-500 ease-out transition-all inset-0 absolute bg-gray-900 opacity-0" onClick={handleExcelFiles}></div>
                <div id="handleExcel" className="w-2/5 h-full duration-150 ease-out transition-all absolute bg-gradient-to-tl from-bg-slate-400 to-bg-white right-0 top-0 translate-x-full">
                    <ExcelComponent onFinish={handleExcelFiles} />
                </div>
            </div>
            { showMessage ? 
            <div className="flex justify-center mb-5">
                <Message />
            </div>
            : '' }
       </div>
    )
}

export default GeneralTable