import express from 'express';
import multer from 'multer';

// import validate from '../helpers/Validation.js';
// import paramValidation from '../config/paramValidations.js';

import { csvtojson } from '../controllers/csvToJsonController.js';
import { addUsers } from '../controllers/userController.js';

const router = express.Router();
const storage = multer.diskStorage({
    destination: '/files',
});
const app = express();

var upload = multer({ storage: storage });
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

router.post('/csvtojson', upload.single('file'), csvtojson);
router.post('/add-users', upload.single('file'), addUsers);

export default router;
