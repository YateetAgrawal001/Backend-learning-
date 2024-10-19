class ApiResponse { 
    constructor(statuscode,
        data,
        message = "success"){
            this.statuscode = statuscode
            this.code = code 
            this.message = message
            this.success = statuscode < 400
        }
}

export {ApiResponse}