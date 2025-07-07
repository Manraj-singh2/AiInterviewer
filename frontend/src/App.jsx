import {Canvas} from '@react-three/fiber'
import Experience from './components/Experience'; 
import AudioRecorder from './components/mic';


function App() {

  return (
    <>
      <Canvas shadows camera={{position:[0,0,10], fov:42}}>
        <Experience />
      </Canvas>
      <AudioRecorder />
    </>
  )
}

export default App
