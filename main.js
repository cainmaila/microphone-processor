"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopStreamed = exports.MicrophoneProcessor = void 0;
const EventEmitter_1 = __importDefault(require("./EventEmitter"));
class MicrophoneProcessor extends EventEmitter_1.default {
    // constructor(stream: MediaStream, BUFF_SIZE = 16384) {
    constructor(stream, BUFF_SIZE = 1024) {
        super();
        this._stream = stream;
        const audioContext = new AudioContext();
        this._audioContext = audioContext;
        const gain_node = audioContext.createGain();
        this._gain_node = gain_node;
        gain_node.connect(audioContext.destination);
        const microphone_stream = audioContext.createMediaStreamSource(stream);
        this._microphone_stream = microphone_stream;
        const script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
        this._script_processor_node = script_processor_node;
        script_processor_node.onaudioprocess = ({ inputBuffer }) => {
            this.emit('buffer', inputBuffer.getChannelData(0));
        };
        microphone_stream.connect(script_processor_node);
        script_processor_node.connect(gain_node);
    }
    destroy() {
        var _a;
        this.emit('destroy');
        this._script_processor_node.onaudioprocess = null;
        this._gain_node.disconnect(this._audioContext.destination);
        (_a = this._microphone_stream) === null || _a === void 0 ? void 0 : _a.disconnect(this._script_processor_node);
        stopStreamed(this._stream);
    }
}
exports.MicrophoneProcessor = MicrophoneProcessor;
function stopStreamed(stream) {
    const tracks = stream.getTracks();
    tracks.forEach(function (track) {
        track.stop();
    });
}
exports.stopStreamed = stopStreamed;
