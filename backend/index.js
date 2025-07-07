const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;
const path = require("path");
const TTS = require(path.join(__dirname, "textAudio.js"));
const AI = require(path.join(__dirname, "AI.js"));
const Mp32Wav = require("mp3-to-wav");
const fs = require("fs");
var response = "";

app.use(cors());

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, "recording" + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.get("/api", async (req, res) => {
  TTS.createLipSync("Hello World");
  res.json({ Hello: __dirname });
});

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

app.get("/get-audio", async (req, res) => {
  try {
    const jsonPath = path.join(__dirname, "output.json");
    const wavPath = path.join(__dirname, "output.wav");

    const outputJson = fs.readFileSync(jsonPath, "utf-8");
    const outputWav = fs.readFileSync(wavPath); // binary buffer

    const response = {
      message: "Here is your audio and lip sync data",
      json: JSON.parse(outputJson),
      wavBase64: outputWav.toString("base64"), // Send as base64
    };

    res.json(response);
  } catch (err) {
    console.error("Error in /get-audio:", err);
    //res.status(500).send("Internal server error");
  }
});

app.post("/upload-audio", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No audio file uploaded.");
  }
  //console.log(req.file);
  //console.log("Received audio file:", req.file.originalname);
  res.status(200).send("Audio uploaded successfully.");
  const id = await TTS.uploadToCloudinary(
    path.join(__dirname, "/uploads/recording.wav")
  );

  const prompt = await TTS.processAudio(id.url);

  response = await AI.response(prompt);

  await TTS.deleteFromCloudinary(id.id);

  await TTS.convertText(response);

  await TTS.convertMp3ToWav(
    path.join(__dirname, "/output.mp3"),
    path.join(__dirname, "/output.wav"),
    __dirname
  );

  await TTS.createLipSync(__dirname);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`http://localhost:${PORT}/api`);
});
