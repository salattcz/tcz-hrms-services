import csv from 'csvtojson'

import holidayCalendar from "../models/holidayCalendarSchema.js";

export const addHolidayCalendar = async (req,res) => {
    const filePath = req.file.path
    try {
        const holidayDetails = await csv()
            .fromFile(filePath)
            .then((jsonObj) => {
                return jsonObj
            })
        console.log(holidayDetails)
    } catch (error) {
        console.log(error);
    }
}