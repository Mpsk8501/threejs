import React, { Suspense, useEffect, useState, useRef } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { PMREMGenerator, Mesh, LightShadow } from 'three'

import {
  useGLTF,
  useAnimations,
  OrbitControls,
  PerspectiveCamera,
  ContactShadows,
  softShadows,
  Sphere,
  Box,
  Environment,
  Sky,
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

  useFrame(() => {
    mixer.update(side)
    motor.rotation.y += 0.005
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
    //cameRArEF.current.lookAt(1, 1, 1)
    for (const action in actions) {
      actions[action].clampWhenFinished = true
      actions[action].repetitions = 1
    }
    for (const node in nodes) {
      nodes[node].castShadow = true
      nodes[node].receiveShadow = true
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

  const animateType0 = async () => {
    if (isOpen) {
      if (!hasRotor) {
        setSide(-0.05)
        actions[names[0]].reset().play()
        await delay(1700)
        actions[names[0]].paused = true
        setHasRotor(true)
      } else {
        setSide(0.05)
        actions[names[1]].reset().play()
      }
    } else {
      setSide(0.05)
      animateStart()
    }
  }
  const animateType1 = async () => {
    if (isOpen) {
      actions[names[1]].reset().play()

      if (!hasRotor) {
        return
      } else {
        setSide(0.05)
        setHasRotor(false)

        actions[names[0]].paused = false
      }
    } else {
      setSide(0.05)
      actions[names[0]].reset().play()
      setHasRotor(false)
      setIsOpen(true)
    }
  }
  const animateType2 = async () => {
    if (isOpen) {
      if (!hasRotor) {
        setSide(-0.05)
        actions[names[0]].reset().play()
        actions[names[1]].reset().play()
        await delay(1700)
        actions[names[0]].paused = true
        setHasRotor(true)
      } else {
        setSide(-0.05)
        actions[names[1]].reset().play()
      }
    } else {
      setSide(0.05)
      animateStart()
    }
  }
  const animateType3 = async () => {
    if (isOpen) {
      setSide(-0.05)
      if (!hasRotor) {
        actions[names[0]].reset().play()
      } else {
        actions[names[0]].paused = false
        await delay(3200)
        actions[names[0]].paused = true
      }
      setHasRotor(true)
      setIsOpen(false)
    } else {
      return
    }
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
        onClick={animate}
        object={motor}
      />
      {/* <SphereNew /> */}
      <LightModule />
    </PerspectiveCamera>
  )
}

const LightModule = () => {
  const lightRef = useRef()
  const lightRef2 = useRef()

  const [rise, setRise] = useState(true)

  const lightPos = (pos) => {
    if (rise) {
      if (pos > 2) {
        setRise(false)
      }
      return pos + 0.04
    } else {
      if (pos < -2) {
        setRise(true)
      }
      return pos - 0.04
    }
  }

  const [posLight, setPosLight] = useState([0, 0])

  useFrame(() => {
    lightRef2.current.position.x = lightPos(lightRef2.current.position.x)

    lightRef.current.position.x = posLight[0] / 697
    lightRef.current.position.y = posLight[1] / 252
  })

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    const listener = canvas.addEventListener('mousemove', (e) => {
      setPosLight([e.offsetX, e.offsetY])
    })
    return () => {
      canvas.removeEventListener('mousemove', listener)
    }
  }, [])

  return (
    <>
      <spotLight
        ref={lightRef}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <spotLight
        ref={lightRef2}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        castShadow
      />
      <directionalLight castShadow />
    </>
  )
}

const SphereNew = () => {
  const [rise, setRise] = useState(true)

  const sphereRef = useRef()
  console.log(sphereRef)

  const spherePosition = (coord) => {
    if (rise) {
      if (coord > 2) {
        setRise(false)
      }
      return coord + 0.005
    } else {
      if (coord < 0) {
        setRise(true)
      }
      return coord - 0.005
    }
  }

  useFrame(() => {
    sphereRef.current.position.x = spherePosition(sphereRef.current.position.x)
    sphereRef.current.scale.x = spherePosition(sphereRef.current.position.x)
    sphereRef.current.scale.y = spherePosition(sphereRef.current.position.x)
    sphereRef.current.scale.z = spherePosition(sphereRef.current.position.x)
  })

  return (
    <mesh
      ref={sphereRef}
      visible
      receiveShadow
      castShadow
      position={[-1, -1, 1]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="hotpink" transparent />
    </mesh>
  )
}

//softShadows()

function Plane({ ...props }) {
  return (
    <mesh {...props} receiveShadow>
      <planeBufferGeometry args={[500, 500, 1, 1]} />
      <shadowMaterial transparent opacity={0.2} />
    </mesh>
  )
}

const chair2 = ({ animType = 2, animPower, animSpeed }) => {
  return (
    <Canvas
      colorManagement
      shadowMap
      camera={{ position: [1.5, 1.5, 1.5], fov: 25 }}
    >
      <OrbitControls />
      <Suspense fallback={null}>
        <Asset
          animSpeed={animSpeed}
          animPower={animPower}
          animType={animType}
          url={'/Motor.gltf'}
        />
      </Suspense>

      <Plane rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -0.2, 0]} />
    </Canvas>
  )
}

export default chair2
