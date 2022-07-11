
import { Router, Request, Response, NextFunction } from "express";
import userController from "../controllers/userController";



export const tokenRouter = async (req: Request, res: Response, next: NextFunction) => {

    if (req.originalUrl === "/v1/user/login" || req.originalUrl === "/v1/user/new") {
        next();
    }
    else if (req.headers.token && typeof req.headers.token === 'string') {
        const user = new userController()
        try {
            const check = await user.validateToken(req.headers.token)
            if (check?.status == 200) {
                next();
            }
            else {
                return res.status(400).send({status:400, message: "Invalid token", reason: check?.message})
            }
        }
        catch (e) {
            return res.status(200).send({ message: "Token validation failed", reason: e })
        }

    }
    else {
        return res.status(400).send({ message: "No token specified", status: 400 })
    }
}