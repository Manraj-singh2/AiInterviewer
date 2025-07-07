const {AssemblyAI} = require("assemblyai");
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const ffmpeg = require("fluent-ffmpeg");
require("dotenv").config();
const gTTS = require('gtts');  //google text to speech
const { exec } = require("child_process");


//using cloudinary to store audio files
cloudinary.config({ 

  cloud_name: process.env.CLOUDI_NAME, 

  api_key: process.env.CLOUDI_KEY, 

  api_secret: process.env.CLOUDI_SECRET, 

  secure: true

}); 

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};


//using gtts to convert text to speech
exports.convertText = async (text) => {
  try{
    const apiKey = process.env.VOICE_RSS;
  const url = `https://api.voicerss.org/?key=${apiKey}&hl=en-us&src=${encodeURIComponent(text)}`;

  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync('output.mp3', response.data);
  console.log('Audio saved as output.mp3');
  }catch(err){
    console.log(err.message);
  }
}

//for uploading audio file to cloudinary
exports.uploadToCloudinary = async (filePath) => {
  try {

    //console.log(filePath);
    // Use Cloudinary's uploader.upload method to upload a local file
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      format: "wav" //file type
    });



    console.log("File uploaded to Cloudinary successfully!");
    console.log("Cloudinary URL:", result.secure_url);
    console.log(result.public_id);

    return {url:result.secure_url,id:result.public_id}; // Return the secure URL of the uploaded file
  } catch (error) {

    console.error("Error uploading file to Cloudinary:", error.message);
    
    throw new Error(error);
  }
};

exports.deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video", // Automatically detects the resource type
    });

      console.log("Deleted");
    return result;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    throw error;
  }
};


// Process audio file (upload and transcribe)
exports.processAudio = async (audioUrl) => {
  const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLY_KEY,
  });

  const params = {
    audio: audioUrl,
    speaker_labels: true
  };

  try {
    const transcript = await client.transcripts.transcribe(params);

    if (transcript.status === 'error') {
      console.error(`Transcription failed: ${transcript.error}`);
      return;
    }

    console.log(transcript.text);
    return transcript.text;

    /*if (transcript.utterances) {
      for (let utterance of transcript.utterances) {
        console.log(`Speaker ${utterance.speaker}: ${utterance.text}`);
      }
    }*/
  } catch (error) {
    console.error(`Error during transcription: ${error.message}`);
  }
};

exports.convertMp3ToWav = async(inputPath,outputPath,__dirname) => {
  
  ffmpeg.setFfmpegPath(__dirname+"/ffmpeg/bin/ffmpeg.exe");

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat("wav")
      .audioFrequency(16000)
      .audioChannels(1)          // Mono
      .audioCodec("pcm_s16le")
      .on("end", () => {
        console.log("Conversion completed.");
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("Error during conversion:", err.message);
        reject(err);
      })
      .save(outputPath);
  });
}


exports.createLipSync = async (__dirname) =>{
  

exec(".\\rhubarb\\rhubarb.exe -f json -o .\\output.json .\\output.wav -r phonetic", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(` stderr: ${stderr}`);
    return;
  }
  console.log(`Output:\n${stdout}`);
});
} 

