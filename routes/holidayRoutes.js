import express from 'express';
import multer from 'multer';

import {
    addHolidayCalendar,
    getAllCalendars,
} from '../controllers/holidayController.js';

const router = express.Router();
const storage = multer.diskStorage({
    destination: '/files',
});
const app = express();

var upload = multer({ storage: storage });
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

router.post('/addCalendar', upload.single('file'), addHolidayCalendar);
router.get('/get-all-calendar/:skip/:limit', getAllCalendars);

export default router;
