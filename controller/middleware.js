const jwt = require('jsonwebtoken');

const withAuth = (req, res, next) => {
     const token = req.cookies.token;
     if (!token) {
          res.status(401).send('Unauthorized: No token provided');
     } else {
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
               if (err) {
                    console.log("Unauthorized: Invalid token")
                    res.status(401).send('Unauthorized: Invalid token');
               } else {
                    req.username = decoded.username;
                    next();
               }
          });
     }
}

module.exports = withAuth;