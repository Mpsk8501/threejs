import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import {
  useGLTF,
  useTexture,
  useAnimations,
  OrbitControls,
  Stars,
  Sky,
  Shadow,
  TrackballControls,
} from '@react-three/drei'

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

const Asset = ({ url, animType }) => {
  const { animations, scene, nodes } = useGLTF(url)
  const { ref, mixer, names, actions, clips } = useAnimations(animations)

  const [update, setUpdate] = useState(0.01)

  useFrame(() => {
    //nodes.RotorAxis.rotation.y += 0.05

    ref.current.rotation.y += 0.005
    mixer.update(update)
  })

  console.log(nodes, ref)

  useEffect(() => {
    animate()
  }, [animType])
  const animate = async () => {
    for (let i in actions) {
      actions[i].reset()
      actions[i].stop()
    }

    actions[names[animType]].clampWhenFinished = true
    actions[names[animType]].repetitions = 1
    actions[names[animType]].reset().play()

    await delay(1000)
    setUpdate(-0.05)
    actions[names[animType]].reset().play()
    await delay(1000)
    setUpdate(0.01)
  }
  return <primitive ref={ref} onClick={() => animate()} object={scene} />
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

const chair2 = ({ animType = 2 }) => {
  return (
    <Canvas camera={{ position: [1, 1, 1], far: 1000 }}>
      <Lights />
      <Suspense fallback={null}>
        <Asset animType={animType} url={'/Motor15.gltf'} />
      </Suspense>

      <Sky inclination={0.52} azimuth={0.3} />
      <OrbitControls />
      {/* <TrackballControls /> */}
    </Canvas>
  )
}

export default chair2
