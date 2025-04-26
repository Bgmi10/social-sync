// middlewares/Validator.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validator(schema: ZodSchema<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
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
