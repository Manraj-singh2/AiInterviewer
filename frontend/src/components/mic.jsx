import { ReactMediaRecorder } from "react-media-recorder";

export default function AudioRecorder() {
  const sendAudioToServer = async (mediaBlobUrl) => {
    
    const response = await fetch(mediaBlobUrl);
    const blob = await response.blob();

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
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        <div>
          <p>Status: {status}</p>
          <button onClick={startRecording}>Start Recording</button>
          <button
            onClick={() => {
              stopRecording();
              console.log("Stop recording")
              setTimeout(() => {
                if (mediaBlobUrl) sendAudioToServer(mediaBlobUrl);
              }, 1000);
            }}
          >
            Stop Recording
          </button>
          {mediaBlobUrl && <audio src={mediaBlobUrl} controls />}
        </div>
      )}
    />
  );
}
