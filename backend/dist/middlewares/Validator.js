"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = validator;
function validator(schema) {
    return function (req, res, next) {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: result.error.errors,
            });
        }
        req.body = result.data; // overwrite with validated data
        next();
    };
}
