interface obj {
    rut: string,
    nombres: string,
    apellidos: string,
    email: string,
    passHash: string,
    rol: string,
    dependencias: string,
    direcciones: string,
    numMunicipal: string,
    anexoMunicipal: string
}

const checkObject = (user: obj) => {
    if (Object.values(user).includes("")) {
        return false
    } else {
        return true
    }
}

export default { checkObject }