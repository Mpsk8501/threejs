import React, { Suspense, useEffect, useState, useRef } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { PMREMGenerator } from 'three'

import {
  useGLTF,
  useAnimations,
  OrbitControls,
  PerspectiveCamera,
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

  const [side, setSide] = useState(0.05)

  console.log(nodes)

  useFrame(() => {
    mixer.update(side)
    nodes['Rotor'].rotation.z += 0.01
    //motor.rotation.y += 0.005
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
    for (const node in nodes) {
      nodes[node].castShadow = true
      //nodes[node].receiveShadow = true
    }

    actions[names[2]].reset().play()

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
    setSide(0.05)
    mixer.stopAllAction()
    actions[names[0]].reset().play()
    await delay(1500)
    actions[names[6]].reset().play()
    setIsOpen(true)
  }

  const animateType0 = async () => {
    nodes['ElectricMotor_0362'].scale.x = 0
    nodes['ElectricMotor_0362'].scale.y = 0
    nodes['ElectricMotor_0362'].scale.z = 0

    if (isOpen) {
      setSide(-0.05)
      if (!hasRotor) {
        actions[names[5]].reset().play()
        setHasRotor(true)
      }
    } else {
      setSide(0.05)
      animateStart()
    }
  }
  const animateType1 = async () => {
    setSide(0.05)
    if (isOpen && hasRotor) {
      actions[names[5]].reset().play()
    } else {
      actions[names[0]].reset().play()
      const listener = () => {
        actions[names[6]].reset().play()
        actions[names[5]].reset().play()
        mixer.removeEventListener('finished', listener)
      }
      mixer.addEventListener('finished', listener)
    }
    setIsOpen(true)
    setHasRotor(false)
  }

  const animateType2 = async () => {
    nodes['ElectricMotor_0362'].scale.x = 1
    nodes['ElectricMotor_0362'].scale.y = 1
    nodes['ElectricMotor_0362'].scale.z = 1
    if (isOpen) {
      if (!hasRotor) {
        animateType0()
        nodes['ElectricMotor_0362'].scale.x = 1
        nodes['ElectricMotor_0362'].scale.y = 1
        nodes['ElectricMotor_0362'].scale.z = 1
      }
    } else {
      animateStart()
    }
  }
  const animateType3 = async () => {
    setSide(-0.05)

    if (isOpen) {
      if (hasRotor) {
        actions[names[0]].reset().play()
        actions[names[6]].reset().play()
      } else {
        actions[names[5]].reset().play()

        const listener = async () => {
          actions[names[0]].reset().play()
          actions[names[6]].reset().play()
          mixer.removeEventListener('finished', listener)
        }
        mixer.addEventListener('finished', listener)
      }
    } else {
      return
    }
    setIsOpen(false)
    setHasRotor(true)
  }

  const animate = async () => {
    if (animType === 0) {
      animateType0()
    }
    if (animType === 1) {
      animateType1()
    }

    if (animType === 2) {
      animateType2()
    }
    if (animType === 3) {
      animateType3()
    }
  }

  const animatePower = async () => {
    actions[names[3]].reset().play()
  }

  const animateSpeed = async () => {
    actions[names[2]].reset().play()
  }

  const cameRArEF = useRef()

  return (
    <PerspectiveCamera ref={cameRArEF}>
      <primitive
        receiveShadow
        castShadow
        ref={ref}
        //onClick={animate}
        object={motor}
      />
      <LightModule />
    </PerspectiveCamera>
  )
}

const LightModule = () => {
  return (
    <>
      <spotLight
        position={[1, 5, 1]}
        castShadow
        //shadow-mapSize-width={256}
        //shadow-mapSize-height={256}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  )
}

function Plane({ ...props }) {
  const ref = useRef()

  const changeAngle = async () => {
    await delay(1000)
    ref.current.minPolarAngle = 1.45
  }

  useEffect(() => {
    ref.current.minPolarAngle = 1.55
    changeAngle()
  }, [])
  return (
    <group>
      <OrbitControls
        minPolarAngle={1.4}
        maxPolarAngle={1.63}
        minDistance={1}
        maxDistance={3}
        ref={ref}
        autoRotate
      />

      <mesh colorManagement {...props} receiveShadow>
        <planeBufferGeometry args={[500, 500, 1, 1]} />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

const chair2 = ({ animType = 2, animPower, animSpeed }) => {
  return (
    <Canvas
      colorManagement
      shadowMap
      camera={{ position: [1, 1, 1], fov: 25, far: 10 }}
    >
      <Suspense fallback={null}>
        <Asset
          animSpeed={animSpeed}
          animPower={animPower}
          animType={animType}
          url={'/MOTOP.gltf'}
        />
      </Suspense>

      {/* <Effect/> */}

      <Plane rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -0.18, 0]} />
    </Canvas>
  )
}

export default chair2
