class EventEmitter {
  private events: {
    [index: string]: Function[]
  } = {}
  private onceEvents: {
    [index: string]: Function[]
  } = {}
  constructor() {}
  on(eventName: string, func: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(func)
  }
  once(eventName: string, func: Function) {
    if (!this.onceEvents[eventName]) {
      this.onceEvents[eventName] = []
    }
    this.onceEvents[eventName].push(func)
  }
  emit(eventName: string, ...params: any[]) {
    const onceEventList = this.onceEvents[eventName]
    if (onceEventList) {
      onceEventList.forEach((event) => {
        event.apply(this, params)
      })
      this.onceEvents[eventName] = []
    }
    const events = this.events[eventName]
    if (events) {
      events.forEach((event) => {
        event.apply(this, params)
      })
    }
  }
  off(eventName: string, func?: Function) {
    //移除 once
    if (this.onceEvents[eventName]) {
      if (!func) {
        this.onceEvents[eventName] = []
      } else {
        this.onceEvents[eventName].splice(this.onceEvents[eventName].indexOf(func), 1)
      }
    }
    //移除 on
    if (this.events[eventName]) {
      if (!func) {
        this.events[eventName] = []
      } else {
        this.events[eventName].splice(this.events[eventName].indexOf(func), 1)
      }
    }
  }
  removeAllListners(eventName?: string) {
    if (eventName) {
      this.onceEvents[eventName] = []
    } else {
      this.onceEvents = {}
    }
    if (eventName) {
      this.events[eventName] = []
    } else {
      this.events = {}
    }
  }
}

export default EventEmitter
