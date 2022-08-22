import csv from 'csvtojson';

export const csvtojson = async (req, res) => {
    const filePath = req.file.path;
    try {
        await csv()
            .fromFile(filePath)
            .then((jsonObj) => console.log(jsonObj));
        return res.status(200).json({ message: 'Converted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
}
