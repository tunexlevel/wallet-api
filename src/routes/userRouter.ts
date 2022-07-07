import {Router, Request, Response } from "express";
import { Query, ParamsDictionary } from 'express-serve-static-core';
import userController from "../controllers/userController";
import { checkSchema,  validationResult } from 'express-validator';
import { createAccount } from "../schema/user";

const userRouter = Router()

export interface TypedRequestBodyQuery<T, B extends Query> extends Request {
    body: T,
    query: B
}

export interface TypedRequestParamQuery<T extends ParamsDictionary, B extends Query> extends Request {
    params: T,
    query: B
}

export interface TypedRequestBody<T> extends Request {
    body: T,
}

userRouter.post("/new", checkSchema(createAccount()), async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = new userController()
    const reply = await user.createUser(req.body);

    res.status(reply.status).send(reply);
});



userRouter.get("/:wallet_id", async (req: Request, res: Response) => {

    if (!req.params.wallet_id) {
        return res.status(400).json({ error: "The wallet id is required" });
    }
    const user = new userController()
    const reply = await user.getUserByWalletId(parseInt(req.params.wallet_id));

    return res.status(reply.status).json(reply);
});



export default userRouter;
