const rutFormater = (rut: string) => {
    const filterCharacters = /[^0-9\.k-]/g
    if (filterCharacters.test(rut) || rut.length + 1 === 14) {
        return false
    } else if (!filterCharacters.test(rut)) {
        return true
    }
}

export default rutFormater