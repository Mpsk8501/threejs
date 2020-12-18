import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { UnsignedByteType, PMREMGenerator } from 'three'
import {
  useGLTF,
  useTexture,
  useAnimations,
  OrbitControls,
} from '@react-three/drei'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

const Asset = ({ url, animType }) => {
  const { gl, scene } = useThree()
  const pmremGenerator = new PMREMGenerator(gl)
  const { animations, scene: motor, nodes, materials } = useGLTF(url)
  const { ref, mixer, names, actions } = useAnimations(animations)

  const [update, setUpdate] = useState(0.001)

  useFrame(() => {
    mixer.update(update)
  })
  const loader = new RGBELoader()

  useEffect(() => {
    animate()

    loader.load('./AutoShop.hdr', (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture

      scene.environment = envMap
      scene.background = envMap
      // one can also set scene.background to envMap here

      texture.dispose()
      pmremGenerator.dispose()
    })
  }, [animType])
  const animate = async () => {
    const motorMaterial = materials.Ciniy
    console.log(nodes)
    console.log(nodes.CoverTop.material)
    //nodes['podshibnik2_002'].material = motorMaterial
    for (let i in actions) {
      actions[i].reset()
      actions[i].stop()
    }
    actions[names[animType]].clampWhenFinished = true
    actions[names[animType]].repetitions = 1
    actions[names[animType]].reset().play()
    // await delay(1000)
    // setUpdate(-0.05)
    // actions[names[animType]].reset().play()
    // await delay(1000)
    // setUpdate(0.01)
  }
  // return <primitive ref={ref} onClick={() => animate()} object={scene} />
  return <primitive ref={ref} onClick={animate} object={motor} />
}

const chair2 = ({ animType = 2 }) => {
  return (
    <Canvas
      style={{ background: 'black' }}
      camera={{ position: [1, 1, 1], far: 1000 }}
    >
      {/* <directionalLight /> */}

      <Suspense fallback={null}>
        <Asset animType={animType} url={'/Motor.gltf'} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}

export default chair2
