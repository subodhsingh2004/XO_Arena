class ApiError extends Error {
    
    public statusCode: number;
    public data: null;
    public success: false;
    public error: any[];

    constructor(
        statusCode: number,
        message: string,
        error: [],
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.error = error
    }

}

export { ApiError }