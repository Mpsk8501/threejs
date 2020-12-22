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

const Asset = ({ url, animType, animPower, animSpeed }) => {
  const { gl, scene } = useThree()
  const pmremGenerator = new PMREMGenerator(gl)
  const { animations, scene: motor, nodes, materials } = useGLTF(url)
  const { ref, mixer, names, actions } = useAnimations(animations)

  const [needUpdate, setNeedUpdate] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [side, setSide] = useState(-0.05)

  console.log(motor)
  console.log(nodes)
  console.log(animations)

  useFrame(() => {
    mixer.update(side)
  })
  const loader = new RGBELoader()

  useEffect(() => {
    loader.load('./AutoShop.hdr', (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture
      scene.environment = envMap
      //scene.background = envMap
      texture.dispose()
      pmremGenerator.dispose()
    })
    for (const action in actions) {
      actions[action].clampWhenFinished = true
      actions[action].repetitions = 1
    }
  }, [])
  useEffect(() => {
    motor.rotation.y = 2.4
    motor.rotation.z = -0.2
    motor.position.x = 0.3
    animate()
    setNeedUpdate(true)
  }, [animType])
  useEffect(() => {
    if (needUpdate) {
      animatePower()
    }
    setNeedUpdate(true)
  }, [animPower])
  useEffect(() => {
    if (needUpdate) {
      animateSpeed()
    }
    setNeedUpdate(true)
  }, [animSpeed])
  const animate = async () => {
    if (animType === 3) {
      await setSide(-0.05)
      await actions[names[4]].reset().play()
    }
    if (animType === 0) {
      setSide(-0.05)
      actions['FullOpen'].reset().play()
      setIsOpen(true)
    }
    if (animType === 1) {
      setSide(0.05)
      actions[names[4]].reset().play()
    }
  }
  const animatePower = async () => {
    setSide(-0.05)
    actions['FullOpen'].reset().play()
    setIsOpen(false)
    actions['Shake'].reset().play()
  }

  const animateSpeed = async () => {
    setSide(0.05)
    actions[names[4]].reset().play()
    await delay(800)
    actions[names[0]].reset().play()
    //actions['Rotate'].reset().play()
  }

  return <primitive ref={ref} onClick={animate} object={motor} />
}

const chair2 = ({ animType = 2, animPower, animSpeed }) => {
  return (
    <Canvas camera={{ position: [0.4, 0.4, 0.4], far: 100 }}>
      <Suspense fallback={null}>
        <Asset
          animSpeed={animSpeed}
          animPower={animPower}
          animType={animType}
          url={'/Motor.gltf'}
        />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}

export default chair2
