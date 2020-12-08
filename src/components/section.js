import React, { createContext, useRef, useContext } from 'react'
import { useThree } from 'react-three-fiber'

const offsetContext = createContext(0)

function Section({ children, offset, factor, ...props }) {
  const { offset: parentOffset, sectionHeight } = useSection()
  const ref = useRef()
  offset = offset !== undefined ? offset : parentOffset

  return (
    <offsetContext.Provider value={offset}>
      <group {...props} position={[0, -sectionHeight * offset * factor, 0]}>
        <group ref={ref}>{children}</group>
      </group>
    </offsetContext.Provider>
  )
}

function useSection() {
  const { size, viewport } = useThree()
  const offset = useContext(offsetContext)
  const viewportWidth = viewport.width
  const viewportHeight = viewport.height
  const canvasWidth = viewportWidth
  const canvasHeight = viewportHeight
  const mobile = size.width < 700
  const margin = canvasWidth * (mobile ? 0.2 : 0.1)
  const contentMaxWidth = canvasWidth * (mobile ? 0.8 : 0.6)
  const sectionHeight = canvasHeight
  const aspect = size.height / viewportHeight
  return {
    aspect,
    viewport,
    offset,
    viewportWidth,
    viewportHeight,
    canvasWidth,
    canvasHeight,
    mobile,
    margin,
    contentMaxWidth,
    sectionHeight,
  }
}

export { Section, useSection }
