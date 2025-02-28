import { useState } from "react";
import { ReactMic } from "react-mic";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);

  const onData = (recordedBlob) => {
    console.log("Recording...", recordedBlob);
  };

  const onStop = async (recordedBlob) => {
    console.log("Recording stopped:", recordedBlob);

    // Convert Blob to File
    const audioFile = new File([recordedBlob.blob], "recording.wav", {
      type: "audio/wav",
    });

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const response = await fetch("http://localhost:8080/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Audio successfully uploaded!");
      } else {
        console.error("Error uploading audio:", await response.text());
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div>
      <ReactMic
        record={recording}
        onStop={onStop}
        onData={onData}
        mimeType="audio/wav"
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />
      <button onClick={() => setRecording(!recording)}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
