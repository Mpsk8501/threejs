import * as THREE from 'three'
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'

import { LightningStrike } from 'three/examples/jsm/geometries/LightningStrike.js'
import { LightningStorm } from 'three/examples/jsm/objects/LightningStorm.js'

extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  UnrealBloomPass,
})

function Effect() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
    size,
  ])

  useFrame(() => composer.current.render(), 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />

      <unrealBloomPass attachArray="passes" args={[aspect, 2, 1, 0]} />
    </effectComposer>
  )
}

export default Effect
