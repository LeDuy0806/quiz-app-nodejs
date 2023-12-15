export const wrapRequestHandler = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (error) {
            res.status(500);
            next(error);
        }
    };
};
