import React, { Suspense, useEffect, useState, useRef } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { PMREMGenerator } from 'three'

import {
  useGLTF,
  useAnimations,
  OrbitControls,
  PerspectiveCamera,
  ContactShadows,
  softShadows,
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
  const [hasRotor, setHasRotor] = useState(true)
  const [hasFasRotor, setHasFasRotor] = useState(false)

  const [side, setSide] = useState(0.05)

  useFrame(() => {
    mixer.update(side)
    motor.rotation.y += 0.01
  })
  const loader = new RGBELoader()

  console.log(animations)

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

    actions[names[2]].reset().play()
    actions[names[1]].reset().play()
    animateStart()
    setNeedUpdate(true)
  }, [])

  useEffect(() => {
    if (needUpdate) {
      animate()
    }
  }, [animType])
  useEffect(() => {
    if (needUpdate) {
      animatePower()
    }
  }, [animPower])
  useEffect(() => {
    if (needUpdate) {
      animateSpeed()
    }
  }, [animSpeed])
  const animateStart = async () => {
    actions[names[0]].reset().play()
    await delay(1700)
    actions[names[0]].paused = true
    setIsOpen(true)
  }

  const animate = async () => {
    if (animType === 0 && !isOpen) {
      setSide(0.05)
      animateStart()
    }
    if (animType === 0 && isOpen) {
      setSide(0.05)
      actions[names[1]].reset().play()
      setHasFasRotor(false)
    }
    if (animType === 1 && isOpen && hasRotor) {
      setSide(0.05)
      setHasRotor(false)

      actions[names[0]].paused = false
    }
    if (animType === 1 && !isOpen) {
      setSide(0.05)
      actions[names[0]].reset().play()
      setHasRotor(false)
      setIsOpen(true)
    }
    if (animType === 0 && isOpen && !hasRotor) {
      setSide(-0.05)
      actions[names[0]].reset().play()
      await delay(1700)
      actions[names[0]].paused = true
      setHasRotor(true)
    }
    if (animType === 3 && isOpen) {
      setSide(-0.05)
      if (!hasRotor) {
        actions[names[0]].reset().play()
      } else {
        actions[names[0]].paused = false
      }

      setHasRotor(true)
      setIsOpen(false)
    }
    if (animType === 2 && isOpen && hasRotor && !hasFasRotor) {
      setSide(-0.05)

      actions[names[1]].reset().play()
      setHasFasRotor(true)
    }
    if (animType === 2 && isOpen && !hasRotor) {
      setSide(-0.05)
      actions[names[0]].reset().play()
      actions[names[1]].reset().play()
      await delay(1700)
      actions[names[0]].paused = true
      setHasRotor(true)
      setHasFasRotor(true)
    }
  }
  const animatePower = async () => {
    actions[names[3]].reset().play()
  }

  const animateSpeed = async () => {
    actions[names[2]].reset().play()
  }

  const cameRArEF = useRef()

  useEffect(() => {
    //cameRArEF.current.position.set(1, 1, 2)
    cameRArEF.current.lookAt(1, 1, 1)
    console.log(cameRArEF.current)
  }, [])
  return (
    <PerspectiveCamera ref={cameRArEF}>
      <primitive
        castShadow
        receiveShadow
        ref={ref}
        onClick={animate}
        object={motor}
      />
    </PerspectiveCamera>
  )
}
softShadows()
const chair2 = ({ animType = 2, animPower, animSpeed }) => {
  return (
    <Canvas shadowMap camera={{ position: [0.9, 0.9, 0.9], fov: 25 }}>
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
