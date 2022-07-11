
import { Router, Request, Response, NextFunction } from "express";



export const tokenRouter = async (req: Request, res: Response, next: NextFunction) => {

    if (req.originalUrl === "/users/login") {
        next();
    }
    if (req.headers.token) {
        res.status(200).send({message: "Token seen", token: req.headers.token})
        return true;
        
    }
    else {
        res.status(400).send({message: "No token specified", status: 400})
        return false;
    }
}