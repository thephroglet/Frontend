const setObject = (key, object) => {
    sessionStorage.setItem(key, JSON.stringify(object))
}

const getObject = (key) => {
    return JSON.parse(sessionStorage.getItem(key))
}

export default {
    setObject,
    getObject
}