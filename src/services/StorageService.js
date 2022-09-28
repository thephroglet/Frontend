const setObject = (key, object) => {
    localStorage.setItem(key, JSON.stringify(object))
}

const getObject = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

export default {
    setObject,
    getObject
}