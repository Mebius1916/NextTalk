import React, { Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../components/CanvasLoader";

const Earth = () => {
  const earth = useGLTF('/planet/scene.gltf');
  useEffect(() => {
    earth.scene.rotation.y = 0.1; // 设置初始旋转角度
  }, []);
  // 在每一帧中更新模型的旋转
  useFrame(() => {
    earth.scene.rotation.y += 0.001; // 调整旋转速度
  });

  return (
    <primitive object={earth.scene} scale={2} position-y={0} rotation-y={0} />
  );
};

const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop='always'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.3}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
