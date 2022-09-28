import APIService from './APIService'

export default class SupportService extends APIService {
    base_path="/question"

    addAnswer(answer) {
        return this.axios.post(`/answer`, answer)
    }


}
