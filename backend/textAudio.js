//import assemblyAi
const {AssemblyAI} = require("assemblyai");

//import cloudinary
const cloudinary = require('cloudinary').v2;

const axios = require('axios');

const FormData = require('form-data');

const fs = require('fs');

//dotenv for .env
require("dotenv").config();

//google text to speech
const gTTS = require('gtts');

//using cloudinary to store audio files
cloudinary.config({ 

  cloud_name: process.env.CLOUDI_NAME, 

  api_key: process.env.CLOUDI_KEY, 

  api_secret: process.env.CLOUDI_SECRET, 

  secure: true

}); 

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

    /*if (transcript.utterances) {
      for (let utterance of transcript.utterances) {
        console.log(`Speaker ${utterance.speaker}: ${utterance.text}`);
      }
    }*/
  } catch (error) {
    console.error(`Error during transcription: ${error.message}`);
  }
};


