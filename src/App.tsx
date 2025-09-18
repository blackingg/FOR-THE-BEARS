import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { UI } from "./components/UI";
import { LoadingScreen } from "./components/LoadingScreen";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [started, setStarted] = useState<boolean>(false);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [3, 4, 8], fov: 20 }}
      >
        <color
          attach="background"
          args={["#171720"]}
        />
        <Suspense>
          <Experience />
        </Suspense>

        <EffectComposer>
          <Bloom
            mipmapblur
            intensity={0.2}
          />
        </EffectComposer>
      </Canvas>

      {started && <UI />}

      <LoadingScreen
        started={started}
        setStarted={setStarted}
      />
      <Analytics />
    </>
  );
}

export default App;
