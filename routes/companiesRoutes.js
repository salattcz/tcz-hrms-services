import express from 'express'
import {
    register,
    generateNewToken,
    login,
} from '../controllers/companiesController.js'

const router = express.Router()

router.post('/register', register)
router.post('/generate-token', generateNewToken)
router.post('/login', login)

export default router
