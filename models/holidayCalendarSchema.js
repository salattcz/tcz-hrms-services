import mongoose from 'mongoose'

const holidayCalendarSchema = mongoose.Schema({
    holidays: { type: Array, default: [] },
    createdBy: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
    calendarName: { type: String },
})

export default mongoose.model('holidayCalendar', holidayCalendarSchema)
