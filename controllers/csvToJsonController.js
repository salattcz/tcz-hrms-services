import csv from 'csvtojson';
import csvwriter from 'csv-writer';
import Blob from 'buffer';


var createCsvWriter = csvwriter.createObjectCsvWriter;

export const csvtojson = async (req, res) => {
    const filePath = req.file.path;
    // const blob = new Blob([JSON.stringify(req.file)], {type : 'text/csv'});
    // console.log(blob)
    const csvWriter = createCsvWriter({
        // Output csv file name is geek_data
        path: 'user_data_summary.csv',
        header: [
            // Title of the columns (column_names)
            { id: 'Sr', title: 'Sr' },
            { id: 'name', title: 'name' },
            { id: 'role', title: 'role' },
            { id: 'gender', title: 'gender' },
            { id: 'dob', title: 'dob' },
            { id: 'email', title: 'email' },
            { id: 'username', title: 'username' },
            { id: 'mobileNumber', title: 'mobileNumber' },
            { id: 'jobTitle', title: 'jobTitle' },
            { id: 'department', title: 'department' },
            { id: 'reportingManager', title: 'reportingManager' },
            { id: 'permanentAddress', title: 'permanentAddress' },
            { id: 'mailingAddress', title: 'mailingAddress' },
            { id: 'about', title: 'about' },
            { id: 'currentProjects', title: 'currentProjects' },
            { id: 'bloodGroup', title: 'bloodGroup' },
            { id: 'status', title: 'status' },
        ],
    });
    try {
        const status = 'success';
        const objs = await csv()
            .fromFile(filePath)
            .then((jsonObj) => {
                return jsonObj;
            });

        var newField = { status: status };
        var records = objs.map((obj) => {
            return { ...obj, ...newField };
        });

        csvWriter
            .writeRecords(records)
            .then(() => console.log('Data uploaded into csv successfully'));
        return res.status(200).json({ message: 'Converted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
};
