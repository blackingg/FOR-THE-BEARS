import {
  CameraControls,
  Environment,
  Float,
  MeshReflectorMaterial,
  OrbitControls,
  Text,
  useFont,
} from "@react-three/drei";
import { Forest } from "./Forest";
import { degToRad } from "three/src/math/MathUtils.js";
import { useEffect, useRef } from "react";
import { RenderTexture } from "@react-three/drei";
import { Color } from "three";
import { currentPageAtom } from "./UI";
import { useAtom } from "jotai";
import { Physics } from "@react-three/rapier";
import { Character } from "./Character";
import { Mesh } from "three";

const bloomColor = new Color("#fff");
bloomColor.multiplyScalar(1.5);

export const Experience = () => {
  const controls = useRef<CameraControls | null>(null);
  const meshFitCameraHome = useRef<Mesh | null>(null);
  const meshFitCameraExplore = useRef<Mesh | null>(null);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  const intro = async () => {
    if (!controls.current) return;
    controls.current.dolly(-22);
    controls.current.smoothTime = 1.2;
    setTimeout(() => {
      setCurrentPage("home");
    }, 800);
    fitCamera();
  };

  const fitCamera = async () => {
    if (!controls.current) return;
    
    if (currentPage === "explore") {
      controls.current.smoothTime = 2.0;

      await controls.current.dolly(12, true);

      const currentCameraPosition = controls.current.camera.position;

      await Promise.all([
        controls.current.rotate(degToRad(-45), 0, true),
        controls.current.setLookAt(
          currentCameraPosition.x,
          currentCameraPosition.y,
          currentCameraPosition.z,
          1,
          0.6,
          0,
          true
        ),
      ]);
    } else {
      controls.current.smoothTime = 1.0;
      if (meshFitCameraHome.current) {
        controls.current.fitToBox(meshFitCameraHome.current, true);
      }
    }
  };

  useEffect(() => {
    intro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fitCamera();
    window.addEventListener("resize", fitCamera);
    return () => {
      window.removeEventListener("resize", fitCamera);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <Physics>
      <OrbitControls />
      <CameraControls ref={controls} />
      <mesh
        ref={meshFitCameraHome}
        position={[-3, 0.1, 2.5]}
        visible={false}
      >
        <boxGeometry args={[8, 2, 2]} />
        <meshBasicMaterial
          color="orange"
          transparent
          opacity={0.3}
        />
      </mesh>
      <Text
        font={"fonts/Poppins-Black.ttf"}
        position={[-5, 0.1, 2.5]}
        lineHeight={0.9}
        fontSize={0.4}
        anchorY={"bottom"}
      >
        FOR THE {"\n"}BERA BADDIES
        <meshBasicMaterial
          color={bloomColor}
          toneMapped={false}
        >
          <RenderTexture attach={"map"}>
            <color
              attach="background"
              args={["#fff"]}
            />
            <Environment preset="forest" />
            <Float
              floatIntensity={4}
              rotationIntensity={2}
            >
              <Forest
                scale={0.005}
                rotation-y={-degToRad(25)}
                rotation-x={degToRad(40)}
                position-y={-0.5}
              />
            </Float>
          </RenderTexture>
        </meshBasicMaterial>
      </Text>
      <group>
        <Forest
          scale={0.005}
          rotation-y={degToRad(-75)}
          position={[1, 0.6, 0]}
        />
        <mesh
          ref={meshFitCameraExplore}
          rotation-y={degToRad(90)}
          position={[1, 0.6, 0]}
          visible={false}
        >
          <boxGeometry args={[5, 1, 2]} />
          <meshBasicMaterial
            color="red"
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
      <mesh
        position={[0, 0, 0]}
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[100, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={10}
          roughness={1}
          depthScale={1}
          opacity={0.5}
          transparent
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333"
          metalness={0.5}
        />
      </mesh>

      <Character position={[-1.9, 0.04, 1.9]} />

      <Environment preset="forest" />
    </Physics>
  );
};

useFont.preload("fonts/Poppins-Black.ttf");
