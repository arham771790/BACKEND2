class ApiResponse
{
    constructor(
        statusCode,
        data,
        message="Success"
    )
    {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        // Status codes less than 400 typically indicate successful or expected responses from the server.
        this.success=statusCode <400;
    }
}