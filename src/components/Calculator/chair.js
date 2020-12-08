import { Section } from '../section'
import React, { useRef, Suspense } from 'react'
// R3F
import { Canvas, useFrame } from 'react-three-fiber'
import { useGLTFLoader } from 'drei'

function Model({ url }) {
  const gltf = useGLTFLoader(url, true)
  console.log(gltf)

  return <primitive object={gltf.scene} dispose={null} />
}

const Lights = () => {
  return (
    <>
      {/* Ambient Light illuminates lights for all objects */}
      <ambientLight intensity={0.3} />
      {/* Diretion light */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* Spotlight Large overhead light */}
      <spotLight intensity={1} position={[1000, 0, 0]} castShadow />
    </>
  )
}

const HTMLContent = ({ modelPath, position, data }) => {
  const ref = useRef()

  useFrame(() => {
    return (ref.current.rotation.y += data.speed)
  })

  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, position, 0]}>
        <mesh ref={ref} position={[0, -35, 50]}>
          <Model url={modelPath} />
        </mesh>
      </group>
    </Section>
  )
}

export default function Chair({ data }) {
  const domContent = useRef()
  return (
    <>
      {/* R3F Canvas */}
      <Canvas
        concurrent
        colorManagement
        camera={{ position: [0, 0, 120], fov: 70 }}
      >
        {/* Lights Component */}
        <Lights />
        <Suspense fallback={null}>
          <HTMLContent
            data={data}
            domContent={domContent}
            bgColor="#f15946"
            modelPath="/ElectricMotor_0263.gltf"
            // modelPath="/armchairGreen.gltf"
            position={250}
          ></HTMLContent>
        </Suspense>
      </Canvas>
    </>
  )
}
