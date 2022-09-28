import APIService from './APIService'
import authService from './authService'

export default class FileService extends APIService {
    base_path = "/file"

    getAnalysedFile (uploadedFileId) {
        return this.axios.get(`/chart/${uploadedFileId}`)
    }

   
    FilterByDate (from, to) {
        return this.axios.post(`/file/filterDate`, null, {
            params: {
                from,
                to,
            },
                headers: {
                    token: authService.getCurrentUser().token
                }
            
        })
    }
}

