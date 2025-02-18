const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;
const path = require("path");
const TTS = require(path.join(__dirname,"textAudio.js"))
const AI = require(path.join(__dirname,"AI.js"))

app.use(cors());

app.get("/api", async (req, res) => {
  
  try{
    const prompt = "Explain how ai work in 20 words";

    const response = await AI.response(prompt);

    await TTS.convertText(response);
    const fileName =  path.join(__dirname + '/ai.mp3');
    const id = await TTS.uploadToCloudinary(fileName);

    await TTS.processAudio(id.url);
    
    await TTS.deleteFromCloudinary(id.id);

    

    res.json({ message: "Like this video!", people: ["Manraj", "Jack", "Barry"], response: response });
   
  }catch(err){
    res.json({err:"An Error occurred"})
  }  
  
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`http://localhost:${PORT}/api`)
});


