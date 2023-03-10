// Import Multer
const { multerUpload } = require("./../lib/multer");
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
          throw { message: "your image not png, gif, jpg" };
        }
        console.log(req.files.images[0].size);

        if (req.files.images[0].size > 1000000) {
          deleteFiles(req.files.images);
          console.log("haha");
          throw { message: "your image is to large, max 1 mb " };
        }
      }
      console.log("ini harusnya ga masuk");

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
