class ApiError extends Error {
    constructor(
        statusCode,
        message = 'Something went wrong', // Default message
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message=message;
        this.success = false;
        this.errors = errors;
        this.stack = stack || this.stack; // Maintain the stack trace
    }
}

// It's mandatory to export the ApiError
export { ApiError };
