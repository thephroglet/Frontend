import APIService from './APIService'
import authService from './authService'

export default class BlogService extends APIService {
    base_path = "/post"

    put(id, body, config={}) {
        return this.axios.put(`${this.base_url}${this.base_path}/${id}`, body, config)
    }

    getCommentsByUserId(id, config={}) {
        return this.axios.get(`${this.base_url}/comment/user/${id}`, config)
    }

    getVotesByUserId(id, config={}) {
        return this.axios.get(`${this.base_url}/comment/user/${id}/votes`, config)
    }

    getCommentById(id, config={}) {
        return this.axios.get(`${this.base_url}/comment/${id}`, config)
    }

    updateComment(id, config={}) {
        id = this.getEntityId(id)
        return this.axios.put(`${this.base_url}/comment/${id}`, null, config)
    }

    deleteComment(idComment) {
        idComment = this.getEntityId(idComment)
        return this.axios.delete(`/comment/${idComment}`)
    }

    addComment(comment) {
        return this.axios.post(`/comment`, comment)
    }

    upvoteComment(idComment) {
        idComment = this.getEntityId(idComment)
        return this.axios.post(`/comment/${idComment}/upvote`, null, {
            params: {
                idUser : authService.getCurrentUser().id
            }
        })
    }
    
    downvoteComment(idComment) {
        idComment = this.getEntityId(idComment)
        return this.axios.post(`/comment/${idComment}/downvote`, null, {
            params: {
                idUser : authService.getCurrentUser().id
            }
        })
    }
}
