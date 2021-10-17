export const successResponse = (res, code, message, data = null, token) => {
    return res.status(code).json({
        message,
        data,
        token
      });
}

export const errorResponse = (res, code, error) => {
    return res.status(code).json({
        error
      });
}
