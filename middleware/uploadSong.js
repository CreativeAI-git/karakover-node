require("../utils/env");

const fs=require('fs')
const multer=require('multer')
const path=require('path')  
const hash = require('random-hash'); 

const uploadStorage = process.env.UPLOAD_STORAGE || "local";
const liveSongUploadPath = process.env.LIVE_SONG_UPLOAD_PATH || "/home/karaoke-app/public/uploads/assets/songs/";
const localSongUploadPath = process.env.LOCAL_SONG_UPLOAD_PATH || path.join(__dirname, "..", "public","uploads", "assets", "songs");

const resolveUploadPath = () => {
  const uploadPath = uploadStorage === "live" ? liveSongUploadPath : localSongUploadPath;
  return path.isAbsolute(uploadPath)
    ? uploadPath
    : path.join(__dirname, "..", uploadPath);
};

const storage=multer.diskStorage({
  destination: (req,file,cb) => { 
    const uploadPath = resolveUploadPath();
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req,file,cb) => {
    let temp = file.originalname.replace(/\s+/g, '').split('.'); //temp[0] +
    const filename = hash.generateHash({length: 10}) + '.' + temp[1]
    cb(null, filename);
    //   cb(null, new Date().getTime() + path.extname(file.originalname))
  }  
}) 
const fileFilter= (req,file,cb,res) => {
  const ext = path.extname(file.originalname);
  const allowed = ['.png', '.jpg', '.jpeg', '.pdf','.mp4','.gif','.mkv','.mov','.ogg','.mp3','.webm','.csv','.xls','.xlsx','.docx','.xml','.txt','.svg','.zip'];

  if(allowed.includes(ext)){
    cb(null,true);
  }
else{

    cb(null,false)
   
}
}
const upload=multer({
    storage:storage,    
    // limits:{
    //     fileSize:1024*1024*10
    // },
    //fileFilter:fileFilter
   
})

module.exports=upload;
