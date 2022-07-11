import { Router } from 'express'
import transactionRouter from './transactionRouter'
import userRouter from './userRouter'
import { tokenRouter } from './tokenRouter'

const router = Router()

router.use(tokenRouter);

router.use('/user', userRouter)
router.use(transactionRouter)

export default router