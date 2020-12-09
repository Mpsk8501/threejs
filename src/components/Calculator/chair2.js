import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useGLTFLoader } from 'drei'

// This component was auto-generated from GLTF by: https://github.com/react-spring/gltfjsx

function Bird({ url }) {
  // const { nodes, materials, animations } = useLoader(GLTFLoader, url)
  const scene = useLoader(GLTFLoader, url)

  const { nodes, materials, animations } = useGLTFLoader(url, true)

  const group = useRef()
  const [mixer] = useState(() => new THREE.AnimationMixer())
  useEffect(
    () => void mixer.clipAction(animations[0], group.current).play(),
    []
  )
  useFrame(() => {
    mixer.update(0.05)
  })

  return (
    <group key={1} position={[1, 1, 1]} dispose={null}>
      <scene name="Scene">
        <mesh
          ref={group}
          name="Object_0"
          morphTargetDictionary={nodes.Object_0.morphTargetDictionary}
          morphTargetInfluences={nodes.Object_0.morphTargetInfluences}
          rotation={[1.5707964611537577, 0, 0]}
          geometry={nodes.Object_0.geometry}
          material={materials.Material_0_COLOR_0}
        />
      </scene>
    </group>
  )
}

const Asset = ({ url }) => {
  const ref = useRef()
  const gltf = useLoader(GLTFLoader, url)
  const [mixer] = useState(() => new THREE.AnimationMixer())
  useFrame(() => {
    mixer.update(0.05)
  })
  const animate = () => {
    console.log(gltf)
    mixer.clipAction(gltf.animations[0], ref.current).play()
  }
  return <primitive ref={ref} onClick={() => animate()} object={gltf.scene} />
}

const chair2 = () => {
  return (
    <Canvas camera={{ position: [700, 250, 100] }}>
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      <Suspense fallback={null}>
        {/* <Bird url={'./motor.glb'} /> */}
        <Asset url={'./motor.glb'} />
        {/* <Bird url={'./FA1g-Flamingo.glb'} /> */}
      </Suspense>
    </Canvas>
  )
}

export default chair2
