import {Router, Request, Response } from "express";
import { Query, ParamsDictionary } from 'express-serve-static-core';
import userController from "../controllers/userController";
import { checkSchema,  validationResult } from 'express-validator';
import { Transfer } from "../schema/transaction";
import transactionController from "../controllers/transactionController";

const transactionRouter = Router()


transactionRouter.post("/transfer", checkSchema(Transfer()), async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const txn = new transactionController()

    const reply = await txn.transfer(req.body);

    res.status(reply.status).send(reply);
});

transactionRouter.get("/history/:id", async (req: Request, res: Response) => {

    if (!req.params.id) {
        return res.status(400).json({ error: "The  id is required" });
    }
    const txn = new transactionController()
    const reply = await txn.txnHistory(parseInt(req.params.id));

    return res.status(reply.status).json(reply);
});

transactionRouter.post("/jobs", async (req: Request, res: Response) => {

    const txn = new transactionController()

    const reply = await txn.txnJobs();

    res.status(reply.status).send(reply);
});


export default transactionRouter;
