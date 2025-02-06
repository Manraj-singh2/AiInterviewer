//import assemblyAi
const {AssemblyAI} = require("assemblyai");;

//google text to speech
const gTTS = require('gtts');


//using gtts to convert text to speech
exports.convertText = (speech) => {
    
    const  gtts = new gTTS(speech, 'en');
 
    gtts.save('Voice.mp3', function (err, result){
    if(err) { throw new Error(err); }
    console.log("Text to speech converted!");
});
}


//using assemblyAi for speech to text
exports.processAudio = async () => {

    try {
        
      // Initialize AssemblyAI with the API key from the environment
const client = new AssemblyAI({ apiKey: process.env.ASSEMBLY_KEY, });
    
        // Define the audio file path and configuration
        const audioUrl = `${__dirname}/Voice.mp3`;
        const config = { audio_url: audioUrl };
    
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
