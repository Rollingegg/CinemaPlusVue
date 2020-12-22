'use strict'

const setWatermark = (str1, str2, targetId, isMobile) => {
  const id = '1.23452384164.123412415' + targetId
  const ticket = document.getElementById(targetId)

  if (document.getElementById(id) !== null) {
    ticket.removeChild(document.getElementById(id))
  }

  const can = document.createElement('canvas')
  // 设置canvas画布大小
  if (isMobile) {
    can.width = 100
    can.height = 52
  } else {
    can.width = 200
    can.height = 120
  }
  const cans = can.getContext('2d')
  cans.rotate(-35 * Math.PI / 180) // 水印旋转角度
  cans.fillStyle = '#666666'
  cans.textAlign = 'center'
  cans.textBaseline = 'Middle'
  if (isMobile) {
    cans.font = '14px Vedana'
    cans.fillText(str2, can.width / 2, can.height + 13)
  } else {
    cans.font = '22px Vedana'
    cans.fillText(str2, can.width / 2, can.height + 30)
  }
  cans.fillText(str1, 0, can.height - 15) // 水印在画布的位置x，y轴

  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = ticket.offsetTop + 'px'
  div.style.left = 0
  div.style.opacity = '0.3'
  div.style.position = 'absolute'
  div.style.overflow = 'hidden'
  div.style.float = 'left'
  div.style.zIndex = '100'
  div.style.width = '100%'
  div.style.height = ticket.clientHeight + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  ticket.appendChild(div)
  return id
}

// 添加水印方法
export const setWaterMark = (str1, str2, targetId, isMobile) => {
  setWatermark(str1, str2, targetId, isMobile)
}

// 移除水印方法
export const removeWatermark = (targetId) => {
  const id = '1.23452384164.123412415' + targetId
  if (document.getElementById(id) !== null) {
    document.getElementById(targetId).removeChild(document.getElementById(id))
  }
}
