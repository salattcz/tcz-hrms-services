import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import companiesRoutes from './routes/companiesRoutes.js'
import userRoutes from './routes/userRoutes.js'
import holidayRoutes from './routes/holidayRoutes.js'

const app = express()
dotenv.config()
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

app.get('/', (req, res) => {
    res.send('This is a shopping site API')
})

app.use('/companies', companiesRoutes)
app.use('/user', userRoutes)
app.use('/holidays', holidayRoutes)

const PORT = process.env.PORT || 5000
const DB_URL = process.env.CONNECTION_URL

mongoose
    .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    )
    .catch((err) => console.log(err.message))
