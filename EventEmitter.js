"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventEmitter {
    constructor() {
        this.events = {};
        this.onceEvents = {};
    }
    on(eventName, func) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(func);
    }
    once(eventName, func) {
        if (!this.onceEvents[eventName]) {
            this.onceEvents[eventName] = [];
        }
        this.onceEvents[eventName].push(func);
    }
    emit(eventName, ...params) {
        const onceEventList = this.onceEvents[eventName];
        if (onceEventList) {
            onceEventList.forEach((event) => {
                event.apply(this, params);
            });
            this.onceEvents[eventName] = [];
        }
        const events = this.events[eventName];
        if (events) {
            events.forEach((event) => {
                event.apply(this, params);
            });
        }
    }
    off(eventName, func) {
        //移除 once
        if (this.onceEvents[eventName]) {
            if (!func) {
                this.onceEvents[eventName] = [];
            }
            else {
                this.onceEvents[eventName].splice(this.onceEvents[eventName].indexOf(func), 1);
            }
        }
        //移除 on
        if (this.events[eventName]) {
            if (!func) {
                this.events[eventName] = [];
            }
            else {
                this.events[eventName].splice(this.events[eventName].indexOf(func), 1);
            }
        }
    }
    removeAllListners(eventName) {
        if (eventName) {
            this.onceEvents[eventName] = [];
        }
        else {
            this.onceEvents = {};
        }
        if (eventName) {
            this.events[eventName] = [];
        }
        else {
            this.events = {};
        }
    }
}
exports.default = EventEmitter;
