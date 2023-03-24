const admins = require("../models/admins")

// const adminOnly = (req, res, next) => {
//     const user = await admins.findOne({
//         where: {
//             role: { role }
//         }
//     });
//     if(!user) return res.status(404).send({
//         isSuccess: false,
//         message: "User tidak ditemukan",
//       });
//       if(user.role !== "super admin" && user.role !== "admin branch") return res.status(403).send({
//         isSuccess: false,
//         message: "Akses Terlarang",
//       });
//       next();
// }

// module.exports = adminOnly

const adminOnly = async (req, res, next) => {
    try {
        const user = await admins.findOne({
            where: {
                id: req.user.id,
                role: req.user.role
            }
        });
        if (!user) {
            return res.status(404).send({
                isSuccess: false,
                message: "User tidak ditemukan",
            })
        }
        if (user.role !== "super admin" && user.role !== "admin branch"){
            return res.status(403).send({
                isSuccess: false,
                message: "Akses Terlarang",
            })
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            isSuccess: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = adminOnly