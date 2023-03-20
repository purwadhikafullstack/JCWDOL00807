// Import Multer
const { multerUpload } = require("./../lib/multerAdmin");
//import delete files
const deleteFiles = require("../helper/deleteFile");

const uploadImages = (req, res, next) => {
  const multerResult = multerUpload.fields([{ name: "images", maxCount: 3 }]);
  multerResult(req, res, function (err) {
    try {
      if (req.files.images) {
        if (err) throw err;
        const ext = /\.(PNG|png|GIF|gif|JPG|jpg)/;

        if (!req.files.images[0].originalname.match(ext)) {
          deleteFiles(req.files.images);
          throw { message: "your image extension should be png or gif or jpg" };
        }
        console.log(req.files.images[0].size);

        if (req.files.images[0].size > 1000000) {
          deleteFiles(req.files.images);
          throw {
            message: "your image size is too large, maximum image size : 1MB ",
          };
        }
      }

      next();
    } catch (error) {
      if (req.files.images) {
      }
      res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  });
};

module.exports = uploadImages;
