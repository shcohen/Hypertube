let jwt = require('jsonwebtoken');
let secret = 'hypertube';

module.exports = {
    getUserInfos: function (authorization) {
        let data = {
            acc_id: -1,
            email: -1,
            username: -1,
            iat: -1,
            exp: -1,
        };
        jwt.verify(authorization, secret, (err, decoded) => {
            if (err) return -1;
            else {
                data = {...decoded};
            }
            if (data.acc_id === -1 || typeof data === "undefined")
                return false;
            else
                return data;
        });
        return data;
    }
};