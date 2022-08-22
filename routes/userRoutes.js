import express from 'express'
import multer from 'multer'

import { csvtojson } from '../controllers/csvToJsonController.js'

const router = express.Router()
const storage = multer.diskStorage({
    destination:"/files"
})
const app = express();

var upload = multer({ storage: storage })
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

router.post('/csvtojson', upload.single('file'), csvtojson)

export default router;