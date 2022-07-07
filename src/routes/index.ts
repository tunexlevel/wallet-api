import { Router } from 'express'
import transactionRouter from './transactionRouter'
import userRouter from './userRouter'

const router = Router()

router.use('/user', userRouter)
router.use(transactionRouter)

export default router