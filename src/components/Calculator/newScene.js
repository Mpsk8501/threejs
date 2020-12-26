import React, { Suspense, useEffect, useState, useRef } from 'react'
import { Canvas } from 'react-three-fiber'

import {
  useGLTF,
  useAnimations,
  OrbitControls,
  PerspectiveCamera,
  ContactShadows,
  softShadows,
  Plane,
  Sphere,
  Box,
} from '@react-three/drei'

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

softShadows()

const NewScene = () => {
  return (
    <Canvas
      colorManagement
      shadowMap
      className={'lss'}
      camera={{ position: [1.5, 1.5, 1.5], fov: 25 }}
    >
      <pointLight position={[-10, 0, -20]} color="red" intensity={2.5} />
      <pointLight position={[0, -10, 0]} intensity={1.5} />
      <directionalLight
        castShadow
        position={[2.5, 8, 5]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight color={'red'} castShadow position={[10, 10, 10]} />
      <group position={[0, -3.5, 0]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.5, 0]}
          receiveShadow
        >
          <planeBufferGeometry attach="geometry" args={[100, 100]} />
          <shadowMaterial attach="material" transparent opacity={0.4} />
        </mesh>
      </group>

      <Box castShadow receiveShadow>
        <meshBasicMaterial attach="material" color="green" />
      </Box>

      <OrbitControls />
    </Canvas>
  )
}

export default NewScene
