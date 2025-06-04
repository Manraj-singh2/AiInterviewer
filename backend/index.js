const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;
const path = require("path");
const TTS = require(path.join(__dirname,"textAudio.js"))
const AI = require(path.join(__dirname,"AI.js"))

app.use(cors());

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null,'recording'+ path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

/*app.get("/api", async (req, res) => {
  
  try{
    const prompt = "What is your name";

    const response = await AI.response(prompt);
    
    await TTS.convertText(response);
    const fileName =  path.join(__dirname , '/output.mp3');
    
    const id = await TTS.uploadToCloudinary(fileName);

    await TTS.processAudio(id.url);
    
    await TTS.deleteFromCloudinary(id.id);

    

    res.json({ message: "Like this video!", people: ["Manraj", "Jack", "Barry"], response: response });
   
  }catch(err){
    res.json({err:"An Error occurred"})
  }  
  
});*/

app.post("/upload-audio", upload.single("audio"), async (req, res) => {
 
  console.log("upload_audio")
  if (!req.file) {
    return res.status(400).send("No audio file uploaded.");
  }
  console.log(req.file);
  console.log("Received audio file:", req.file.originalname);
  res.status(200).send("Audio uploaded successfully.");
  const id = await TTS.uploadToCloudinary(path.join(__dirname,'/uploads/recording.wav'));

  await TTS.processAudio(id.url);

});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`http://localhost:${PORT}/api`)
});


