import mongoose from 'mongoose'

const holidayCalendarSchema = mongoose.Schema({
    holidays: [
        {
            date: { type: Date, required: true },
            occasion: { type: String, required: true },
            typeOfHoliday: { type: String, required: true },
        },
    ],
    createdBy: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
    calendarName: { type: String },
})

export default mongoose.model('holidays', holidayCalendarSchema)
