import Timer from './timer'

const isType = val => {
  return val == null
    ? String(val)
    : Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}
const isFunction = val => isType(val) === 'function'
// todo:单张图片加载完成
// todo:多线程加载
// todo:每次end结束之后再加载后续队列
// todo:优化ready逻辑？
// todo:增加加载错误图片二次加载功能

class Imgpreload {
  constructor () {
    this._timer = new Timer()
    this.index = 0
    this._itemLoaded = false
    this.imgs = []
    this.errors = []
    this.waits = []
    this.total = 0
  }

  /**
   * {
   *  name:"",
   *  url:""
   * }
   *
   * @param {Array} [resources=[]]
   * @returns this
   *
   * @memberOf Imgpreload
   */
  add (newimgs = []) {
    const base = this

    base.waits = [...base.waits, ...newimgs]
    base._waitsLen = base.waits.length
    this._readys = []
    base.index = 0

    return this
  }

  start (thread = false) {
    const base = this
    base.startTime = +new Date()

    let temp = []
    base.thread = thread
    base._timer.start(function () {
      if (temp.length === base._waitsLen) {
        base._timer.stop()
      }
      base._readys.forEach((v, i) => {
        if (v.width > 0 && v.height > 0) {
          if (isFunction(base.readyHandler)) {
            base.readyHandler.call(v, v.width, v.height)
          }

          temp.push(i)
          base._readys.splice(i, 1)
        }
      })
    })
    this._load()

    return this
  }

  ready (handler = Function) {
    this.readyHandler = handler

    return this
  }

  item (handler = Function) {
    this.itemHandler = handler

    return this
  }

  end (handler = Function) {
    this.endHandler = handler

    return this
  }
  _load () {
    let item = this.waits[0]
    if (!item.name || !item.url) {
      return
    }

    const base = this
    const startDate = +new Date()
    base._itemLoaded = false

    let data = item
    let img = new window.Image()

    img.src = item.url

    base._readys.push(img)
    data.dom = img

    if (img.complete) {
      data.status = 'complete'
      data.message = 'cache'
      data.time = (+new Date()) - startDate
      base._update(data)
      return
    }

    img.onerror = function (e) {
      data.status = 'error'
      data.message = e
      base.errors.push(item)
      base._update(data)
    }

    img.onload = function () {
      data.status = 'complete'
      data.message = 'first'
      data.time = (+new Date()) - startDate
      base._update(data)
    }
  }
  _update (data) {
    const base = this

    base._itemLoaded = true

    if (base._itemLoaded) {
      base.index++
      base.imgs.push(data)
      base.waits.shift()

      if (!base.waits.length) {
        const lastTime = +new Date()

        if (isFunction(base.endHandler)) {
          base.endHandler(base.imgs, lastTime - base.startTime)
        }
      } else {
        base._load()
      }
    }
  }
}

export default Imgpreload
