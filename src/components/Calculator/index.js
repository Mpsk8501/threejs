import React, { useEffect, useRef, useState } from 'react'
import Chair2 from './chair2.js'
import classes from './Calculator.module.scss'

import Slider from '@material-ui/core/Slider'
import { LeftSlider } from './leftSlider'

let baseValueSplitter3000 = {
  1: 2116.47,
  2: 2717.37,
  3: 2911.75,
  4: 3189.01,
  5: 4373.05,
  6: 4610.85,
  7: 5308.45,
  8: 7042.57,
  9: 10634.55,
  10: 12314.06,
  11: 14511.5,
  12: 16063.13,
  13: 19387.65,
  14: 22210.27,
  15: 24301.59,
  16: 34511.13,
  17: 36847.06,
}
let baseValueSplitter1500 = {
  1: 2717.37,
  2: 2911.75,
  3: 3449.02,
  4: 4373.05,
  5: 5000.85,
  6: 5852.61,
  7: 6437.4,
  8: 7710.5,
  9: 11855.93,
  10: 13570.21,
  11: 15485.96,
  12: 17513.94,
  13: 20432.61,
  14: 22716.63,
  15: 25374.29,
  16: 38396.78,
  17: 42433.87,
}
let baseValueSplitter1000 = {
  1: 2911.75,
  2: 3189.01,
  3: 4426.62,
  4: 5288.93,
  5: 5890.96,
  6: 7996.22,
  7: 9121.22,
  8: 11358.63,
  9: 13201.19,
  10: 15718.66,
  11: 19759.14,
  12: 21530.68,
  13: 25388.25,
  14: 27585.34,
  15: 30098.79,
  16: 45610.9,
  17: 51185.04,
}
let baseValueSplitter750 = {
  1: 4138.22,
  2: 4600.7,
  3: 5419.31,
  4: 6441.51,
  5: 8064.3,
  6: 8720.84,
  7: 10006.41,
  8: 12053.18,
  9: 14128.34,
  10: 16439.58,
  11: 22018.58,
  12: 25235.8,
  13: 32137.47,
  14: 35285.22,
  15: 42691.56,
  16: 51009.13,
  17: 60571.27,
}
let baseValueSplitter500 = {
  1: 4138.22,
  2: 4600.7,
  3: 5419.31,
  4: 6441.51,
  5: 8064.3,
  6: 8720.84,
  7: 10006.41,
  8: 12053.18,
  9: 14128.34,
  10: 16439.58,
  11: 22018.58,
  12: 25235.8,
  13: 32137.47,
  14: 35285.22,
  15: 42691.56,
  16: 51009.13,
  17: 60571.27,
}
let baseValueSplitter0 = {
  1: 4138.22,
  2: 4600.7,
  3: 5419.31,
  4: 6441.51,
  5: 8064.3,
  6: 8720.84,
  7: 10006.41,
  8: 12053.18,
  9: 14128.34,
  10: 16439.58,
  11: 22018.58,
  12: 25235.8,
  13: 32137.47,
  14: 35285.22,
  15: 42691.56,
  16: 51009.13,
  17: 60571.27,
}

const returnOptionText = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = 'Замена обмотки не требуется'
      break
    case '0.9':
      text = 'Электродвигателя без ротора'
      break
    case '1':
      text = 'ЭД с фазным ротором'
      break
    case '1.001':
      text = 'ЭД с короткозамкнутым ротором'
      break
  }
  return text
}

const returnSpeedRealValue = (value) => {
  let speedValue = ''
  switch (value.toString()) {
    case '0':
      speedValue = '3000'
      break
    case '1':
      speedValue = '1500'
      break
    case '2':
      speedValue = '1000'
      break
    case '3':
      speedValue = '750'
      break
    case '4':
      speedValue = 'от 500'
      break
    case '5':
      speedValue = 'до 500'
      break
    default: {
      speedValue = 'до 500'
    }
  }
  return speedValue
}

export const Calculator = ({ tag_h1 = null, isActive = true, coeff }) => {
  const [data, setData] = useState({
    speed: 0.01,
  })

  const [calcResult, setCalcResult] = useState(0)
  const [activeSlider, setActiveSlider] = useState(4)

  const [sliderValue, setSliderValue] = useState(0)
  const [inputValue, setInputValue] = useState(1.001)

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue)
  }

  const speedClickHandler = (value) => {
    setSliderValue(value)
  }

  const calcResultHandler = () => {
    let baseValueArr = baseValueSplitter3000
    switch (sliderValue) {
      case 5:
        baseValueArr = baseValueSplitter0
        break
      case 4:
        baseValueArr = baseValueSplitter500
        break
      case 3:
        baseValueArr = baseValueSplitter750
        break
      case 2:
        baseValueArr = baseValueSplitter1000
        break
      case 1:
        baseValueArr = baseValueSplitter1500
        break
      case 0:
        baseValueArr = baseValueSplitter3000
        break
    }

    const newInputValue = inputValue == 0.1 ? 0 : inputValue

    const newValue = Math.floor(baseValueArr[activeSlider] * newInputValue * 1)
    setCalcResult(newValue)
  }

  useEffect(() => {
    let text = ''
    if (inputValue == '0.1') {
      text = returnOptionText('0')
    } else {
      text = returnOptionText(inputValue)
    }

    calcResultHandler()
    setData({
      speed: data.speed + 0.01,
    })
  }, [activeSlider, sliderValue, inputValue, coeff])

  const [filterImg, setFilterImg] = useState('ЭД с короткозамкнутым ротором')
  const [openFilter, setOpenFilter] = useState(false)
  const [filterActiveType, setFilterActiveType] = useState('1.001')

  const clickListener = () => {
    if (openFilter) {
      setOpenFilter(false)
      setFilterImg(returnOptionText(inputValueRef.current))
    }
    document.removeEventListener('click', clickListener)
  }

  useEffect(() => {
    document.addEventListener('click', clickListener)
    return () => document.removeEventListener('click', clickListener)
  }, [openFilter])

  const openFilterHandler = () => {
    if (openFilter) {
      return
    }
    setOpenFilter(true)
  }

  const inputValueRef = useRef('1.001')

  const selectFilterHandler = (value) => {
    inputValueRef.current = value
    setFilterActiveType(value)
    setFilterImg(returnOptionText(value))
    setInputValue(value)
  }

  const selectImageHandler = (value) => {
    setFilterImg(returnOptionText(value))
  }

  return (
    <div className={classes.Calculator}>
      <div className={'containerNew'}>
        <div className={classes.main}>
          <header className={classes.title}>
            <h1>{tag_h1 || 'Расчитать онлайн'}</h1>
          </header>
          <div className={classes.input}>
            <p>Замена обмотки:</p>
            <div
              className={openFilter ? classes.wrapperActive : classes.wrapper}
            >
              <svg
                onClick={openFilterHandler}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>arrow_forward_ios</title>
                <path d="M5.859 4.125l2.156-2.109 9.984 9.984-9.984 9.984-2.156-2.109 7.922-7.875z"></path>
              </svg>
              <div onClick={openFilterHandler} className={classes.filter}>
                {filterImg}
                <span></span>
              </div>
              <div
                className={openFilter ? classes.stretchActive : classes.stretch}
              >
                <ul>
                  <li
                    className={
                      filterActiveType === '1.001' ? classes.activeLi : ''
                    }
                    onMouseEnter={() => selectImageHandler('1.001')}
                    onClick={() => selectFilterHandler('1.001')}
                  >
                    {returnOptionText('1.001')}
                  </li>
                  <li
                    className={
                      filterActiveType === '0.9' ? classes.activeLi : ''
                    }
                    onMouseEnter={() => selectImageHandler('0.9')}
                    onClick={() => selectFilterHandler('0.9')}
                  >
                    {returnOptionText('0.9')}
                  </li>

                  <li
                    className={filterActiveType === '1' ? classes.activeLi : ''}
                    onMouseEnter={() => selectImageHandler('1')}
                    onClick={() => selectFilterHandler('1')}
                  >
                    {returnOptionText('1')}
                  </li>

                  <li
                    className={filterActiveType === '0' ? classes.activeLi : ''}
                    onMouseEnter={() => selectImageHandler('0')}
                    onClick={() => selectFilterHandler('0')}
                  >
                    {returnOptionText('0')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={classes.sliderHeader}>
            <p>
              <span>POWER</span>, кВт
            </p>
            <p>
              <span>SPEED</span>, об/мин
            </p>
          </div>
        </div>
        <div className={classes.main}>
          <div className={classes.sliderBlock}>
            <div className={classes.imgBlock}>
              <Chair2 data={data} />
              {/* <img src="/images/calculator/motor.png" alt="motor" /> */}
            </div>
            <div className={classes.slidersWrapper}>
              <LeftSlider
                setSlide={setActiveSlider}
                activeSlide={activeSlider}
              />
              <div className={classes.rightSlider}>
                <div className={classes.slider}>
                  <div className={classes.valuesBlock}>
                    <span
                      onClick={() => speedClickHandler(5)}
                      className={sliderValue === 5 ? classes.spanActive : null}
                    >
                      до 500
                    </span>
                    <span
                      onClick={() => speedClickHandler(4)}
                      className={sliderValue === 4 ? classes.spanActive : null}
                    >
                      от 500
                    </span>
                    <span
                      onClick={() => speedClickHandler(3)}
                      className={sliderValue === 3 ? classes.spanActive : null}
                    >
                      750
                    </span>
                    <span
                      onClick={() => speedClickHandler(2)}
                      className={sliderValue === 2 ? classes.spanActive : null}
                    >
                      1000
                    </span>
                    <span
                      onClick={() => speedClickHandler(1)}
                      className={sliderValue === 1 ? classes.spanActive : null}
                    >
                      1500
                    </span>
                    <span
                      onClick={() => speedClickHandler(0)}
                      className={sliderValue === 0 ? classes.spanActive : null}
                    >
                      3000
                    </span>
                  </div>
                  <div className={classes.rightSliderWrapper}>
                    <Slider
                      orientation="vertical"
                      aria-label={returnSpeedRealValue(sliderValue)}
                      step={1}
                      min={0}
                      max={5}
                      name={'sliderB'}
                      value={typeof sliderValue === 'number' ? sliderValue : 0}
                      onChange={handleSliderChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.main}>
          <div
            className={
              !isActive ? classes.senderBlock : classes.activeSenderBlock
            }
          >
            <div>
              <span title={'цена указана с ндс'}>
                {calcResult}
                {!isActive ? '+' : ''} &#x20bd;
              </span>
            </div>
            <div>
              <span>
                уточнить <br /> стоимость
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
