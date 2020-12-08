import React, { useEffect, useRef, useState } from 'react'
import classes from './leftSlider.module.scss'
import { useSwipeable } from 'react-swipeable'

const returnPowerRealValue = (value) => {
  let powerValue = ''
  switch (value.toString()) {
    case '1':
      powerValue = '1,1'
      break
    case '2':
      powerValue = '1,5'
      break
    case '3':
      powerValue = '2,2'
      break
    case '4':
      powerValue = '3,0'
      break
    case '5':
      powerValue = '4,0'
      break
    case '6':
      powerValue = '5,5'
      break
    case '7':
      powerValue = '7,5'
      break
    case '8':
      powerValue = '11,0'
      break
    case '9':
      powerValue = '15'
      break
    case '10':
      powerValue = '18,5'
      break
    case '11':
      powerValue = '22,0'
      break
    case '12':
      powerValue = '30,0'
      break
    case '13':
      powerValue = '37,0'
      break
    case '14':
      powerValue = '45,0'
      break
    case '15':
      powerValue = '55,0'
      break
    case '16':
      powerValue = '75,0'
      break
    case '17':
      powerValue = '90,0'
      break
  }
  return powerValue
}

export const LeftSlider = ({ activeSlide, setSlide }) => {
  const [leftSliderMargin, setLeftSliderMargin] = useState(-50)
  const [sliderClasses, setSliderClasses] = useState({
    [activeSlide + 1]: classes.preActive,
    [activeSlide - 1]: classes.preActive,
    [activeSlide]: classes.active,
  })

  const sliderRef = useRef()

  useEffect(() => {
    const sliderElem = sliderRef.current
    // @ts-ignore
    sliderElem.style.setProperty('--transformMargin', `${leftSliderMargin}px`)
  }, [leftSliderMargin])

  const leftSliderHandler = (e, value = 0) => {
    let newActiveSlider = activeSlide
    const marginValue = value ? value : +e.target.value

    const setSlider = () => {
      if (
        (activeSlide === 17 && marginValue < 0) ||
        (activeSlide === 1 && marginValue > 0)
      ) {
        return
      }
      if (marginValue > 0) {
        newActiveSlider--
      } else if (marginValue < 0) {
        newActiveSlider++
      }
      setLeftSliderMargin((state) => state + marginValue)
      setSliderClasses({
        [newActiveSlider + 1]: classes.preActive,
        [newActiveSlider - 1]: classes.preActive,
        [newActiveSlider]: classes.active,
      })
      setSlide(newActiveSlider)
    }

    setSlider()

    if (e && e.velocity > 0.6) {
      if (
        (activeSlide >= 14 && marginValue < 0) ||
        (activeSlide <= 3 && marginValue > 0)
      ) {
        return
      }
      setSlider()
      setSlider()
    } else if (e && e.velocity) {
      if (
        (activeSlide >= 15 && marginValue < 0) ||
        (activeSlide <= 2 && marginValue > 0)
      ) {
        return
      }
      setSlider()
    }
  }

  const handlers = useSwipeable({
    onSwipedUp: (e) => leftSliderHandler(e, -34),
    onSwipedDown: (e) => leftSliderHandler(e, 34),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  return (
    <>
      <div {...handlers} className={classes.leftSlider}>
        <div className={classes.btnBlock}>
          <button
            aria-label={'Мощность вверх'}
            onClick={leftSliderHandler}
            value={+34}
          ></button>
          <button
            aria-label={'Мощность вниз'}
            onClick={leftSliderHandler}
            value={-34}
          ></button>
        </div>
        <div ref={sliderRef} className={classes.leftSliderWrapper}>
          <div className={sliderClasses[1] || null}>1,1</div>
          <div className={sliderClasses[2] || null}>1,5</div>
          <div className={sliderClasses[3] || null}>2,2</div>
          <div className={sliderClasses[4] || null}>3,0</div>
          <div className={sliderClasses[5] || null}>4,0</div>
          <div className={sliderClasses[6] || null}>5,5</div>
          <div className={sliderClasses[7] || null}>7,5</div>
          <div className={sliderClasses[8] || null}>11,0</div>
          <div className={sliderClasses[9] || null}>15,0</div>
          <div className={sliderClasses[10] || null}>18,5</div>
          <div className={sliderClasses[11] || null}>22,0</div>
          <div className={sliderClasses[12] || null}>30,0</div>
          <div className={sliderClasses[13] || null}>37,0</div>
          <div className={sliderClasses[14] || null}>45,0</div>
          <div className={sliderClasses[15] || null}>55,0</div>
          <div className={sliderClasses[16] || null}>75,0</div>
          <div className={sliderClasses[17] || null}>90,0</div>
        </div>
      </div>
    </>
  )
}
