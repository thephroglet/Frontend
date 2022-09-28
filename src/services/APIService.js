import axios from  "axios";
import authService from "./authService";

export default class APIService {
    
    base_url = "http://localhost:8080"
    base_path = ""

    constructor() {
        this.axios = axios
        this.axios.defaults.baseURL = this.base_url
        this.axios.defaults.headers = {
            token : authService.getCurrentUser().token
        }
    }

    request(config={}) {
        return this.axios.request(config)
    }

    all(config={}) {
        return this.axios.get(this.base_path, config)
    }

    get(id, config={}) {
        if (id == undefined || id == null || !id) {
            return this.all()
        }
        id = this.getEntityId(id)
        return this.axios.get(`${this.base_path}/${id}`, config)
    }

    save(body, config={}) {
        if (body.id) {
            return this.put(body, config)
        }
        return this.post(body, config)
    }

    post(body, config={}) {
        return this.axios.post(this.base_path, body, config)
    }

    put(body, config={}) {
        return this.axios.put(this.base_path, body, config)
    }

    delete(id, config={}) {
        id = this.getEntityId(id)
        return this.axios.delete(`${this.base_path}/${id}`, config)
    }

    getMine(config={}) {
        return this.axios.get(`${this.base_path}/user`, config)
    }

    getByUserId(idUser,config={}) {
        idUser = this.getEntityId(idUser)
        idUser = idUser!= null ? idUser : authService.getCurrentUser().id

        return this.axios.get(`${this.base_path}/user/${idUser}`, config)
    }

    /**
     * *****************************************************************
     * Utilities
     * *****************************************************************
     */

    getEntityId(id) {
        const isValidData = (data, type) => data !== undefined && data !== null && typeof data === type
        const idIsValidString = (id) => isValidData(id, "string") &&  id.length
        if (idIsValidString(id)) {
            return id
        } else if (isValidData(id, "object") && idIsValidString(id.id)) {
            return id.id
        }
        return null
    }

}
