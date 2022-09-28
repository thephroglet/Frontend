import APIService from './APIService';

export default class ClaimService extends APIService {
    base_path = "/help"

    getByIdUser (idUser) {
        return this.all({
            params: {
                idUser
            }
        })
    }
}
