//import assemblyAi
const {AssemblyAI} = require("assemblyai");

//import cloudinary
const cloudinary = require('cloudinary').v2;

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
exports.convertText = (speech) => {
    
    const  gtts = new gTTS(speech, 'en');
 
    gtts.save('Voice.mp3', function (err, result){
    if(err) { throw new Error(err); }
    console.log("Text to speech converted!");
});
}

//for uploading audio file to cloudinary
exports.uploadToCloudinary = async (filePath) => {
  try {

    // Use Cloudinary's uploader.upload method to upload a local file
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video", //file type
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

    if (result.result === "ok") {
      console.log("File deleted successfully from Cloudinary!");
    } else {
      console.log("File deletion failed or file not found:", result.result);
    }

    return result;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    throw error;
  }
};

//using assemblyAi for speech to text
exports.processAudio = async (url) => {

    try {
        
      // Initialize AssemblyAI with the API key from the environment
const client = new AssemblyAI({ apiKey: process.env.ASSEMBLY_KEY, });
    
        // Define the audio file path and configuration
        
        const config = { audio_url: url };
    
        // Run the transcription process
        const transcript = await client.transcripts.transcribe(config);
    
        // Log and return the transcribed text
        console.log("Transcription result:", transcript.text);
        return Promise.resolve(transcript.text);
      } catch (error) {
        console.error("Error processing audio:", error.message);
        return Promise.reject(error);
      }
    
}
