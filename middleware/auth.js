const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');
    console.log(token)

    // Check if no token
    if (token == "") {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    console.log('Received token:', token);
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user from payload
        req.user = decoded;
        res.json({ AuthToken: token}).status(200);
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
