import APIService from './APIService';

export default class ReportService extends APIService {

    base_path="/reports"

    
    
    getReportById(id, config={}) {
        return this.axios.get(`${this.base_url}/reports/${id}`, config)
    }

    
    closeReport (id) {
        return this.axios.put(`${this.base_url}/reports`, null, {
            params: {
                id,
            }
        })
    }

}