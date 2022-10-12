import csv from 'csvtojson';
import moment from 'moment';

import holidayCalendar from '../models/holidayCalendarSchema.js';

export const addHolidayCalendar = async (req, res) => {
    const filePath = req.file.path;
    const { createdBy, calendarName } = req.body;
    try {
        const holidayDetails = await csv()
            .fromFile(filePath)
            .then((jsonObj) => {
                return jsonObj;
            });

        let newArray = [];
        for (var y in holidayDetails) {
            const obj = holidayDetails[y];
            newArray.push({
                date: obj.date,
                occasion: obj.occasion,
                typeOfHoliday: obj.typeOfHoliday,
            });
        }
        // console.log(newArray)
        const newList = {
            holidays: newArray,
            createdBy: createdBy,
            calendarName: calendarName,
        };
        // console.log(newList)
        const holidays = await holidayCalendar.create(newList);
        holidays.save();

        res.send('success');
    } catch (error) {
        console.log(error);
    }
};

export const getAllCalendars = async (req, res) => {
    const { limit: limit, skip: skip } = req.params;
    try {
        const allCalendars = await holidayCalendar
            .find()
            .skip(skip)
            .limit(limit);
        res.status(200).json(allCalendars);
    } catch (error) {
        console.log(error);
    }
};
