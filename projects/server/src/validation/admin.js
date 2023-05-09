const { check, validationResult } = require("express-validator")

exports.validationRun = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: errors.array().map(err => ({
                msg: err.msg
            }))
        })
    }
    next();
}

exports.validationAdminBranch = [
    check('name', 'name is required').notEmpty(),
    check('email', 'email is required').notEmpty(),
    check('password', 'password is required').notEmpty(),
    check('role', 'role is required').notEmpty(),
    check('isActive', 'isActive is required').notEmpty(),
]