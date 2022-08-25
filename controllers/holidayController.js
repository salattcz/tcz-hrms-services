import csv from 'csvtojson'
import moment from 'moment'

import holidayCalendar from '../models/holidayCalendarSchema.js'

export const addHolidayCalendar = async (req, res) => {
    const filePath = req.file.path
    try {
        const holidayDetails = await csv()
            .fromFile(filePath)
            .then((jsonObj) => {
                return jsonObj
            })

        let newArray = []
        for (var y in holidayDetails) {
            const obj = holidayDetails[y]
            newArray.push({
                date: obj.date,
                occasion: obj.occasion,
                typeOfHoliday: obj.typeOfHoliday,
            })
        }
        // console.log(newArray)
        const newList = {
            holidays:newArray,
            createdBy: holidayDetails[0].createdBy,
            calendarName: holidayDetails[0].calendarName,
        }
        // console.log(newList)
        const holidays = await holidayCalendar.create(
            newList,
        )
        holidays.save()

        res.send('success')
    } catch (error) {
        console.log(error)
    }
}
