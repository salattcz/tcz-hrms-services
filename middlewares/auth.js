import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    console.log(req);
    try {
        const token = req.headers.authorization;

        let decodeData = jwt.verify(token, process.env.JWT_SECRET);
        req.body.role = decodeData?.role;

        next();
    } catch (error) {
        console.log(error);
    }
};

export default auth;
