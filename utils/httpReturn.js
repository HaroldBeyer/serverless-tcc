const httpReturn = (statusCode, message, input) => {
    return {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message,
            input
        })
    };
}


module.exports = {
    httpReturn
}