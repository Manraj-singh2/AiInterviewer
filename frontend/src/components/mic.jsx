import { ReactMediaRecorder } from "react-media-recorder";

export default function AudioRecorder() {
  const sendAudioToServer = async (blob) => {
    const audioFile = new File([blob], "recording.wav", { type: "audio/wav" });

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const res = await fetch("http://localhost:8080/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        console.log("Audio successfully uploaded!");
      } else {
        console.error("Error uploading audio:", await res.text());
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };


  return (
    <ReactMediaRecorder
      audio
      // This is the only place where blob is reliably ready
      onStop={(blobUrl, blob) => {
        console.log(" Recording stopped, blob ready.");
        sendAudioToServer(blob);
      }}
      render={({ status, startRecording, stopRecording }) => (
        <div>
          <p>Status: {status}</p>
          <button onClick={startRecording}>Start Recording</button>
          <button onClick={stopRecording}>Stop Recording</button>
        </div>
      )}
    />
  );
}
