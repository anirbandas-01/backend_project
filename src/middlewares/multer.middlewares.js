import multer from "multer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/tmp")
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname) //later change the file, and convert unique file name
  }
})

export const upload = multer({ 
    storage: storage 
 }) 