import EventEmitter from './EventEmitter'

export class MicrophoneProcessor extends EventEmitter {
  private _gain_node: GainNode
  private _audioContext: AudioContext
  private _microphone_stream: MediaStreamAudioSourceNode
  private _stream: MediaStream
  private _script_processor_node: ScriptProcessorNode
  // constructor(stream: MediaStream, BUFF_SIZE = 16384) {
  constructor(stream: MediaStream, BUFF_SIZE = 1024) {
    super()
    this._stream = stream
    const audioContext = new AudioContext()
    this._audioContext = audioContext
    const gain_node = audioContext.createGain()
    this._gain_node = gain_node
    gain_node.connect(audioContext.destination)
    const microphone_stream = audioContext.createMediaStreamSource(stream)
    this._microphone_stream = microphone_stream
    const script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1)
    this._script_processor_node = script_processor_node
    script_processor_node.onaudioprocess = ({ inputBuffer }) => {
      this.emit('buffer', inputBuffer.getChannelData(0))
    }
    microphone_stream.connect(script_processor_node)
    script_processor_node.connect(gain_node)
  }
  destroy() {
    this.emit('destroy')
    this._script_processor_node.onaudioprocess = null
    this._gain_node.disconnect(this._audioContext.destination)
    this._microphone_stream?.disconnect(this._script_processor_node)
    stopStreamed(this._stream)
  }
}

export function stopStreamed(stream: MediaStream) {
  const tracks = stream.getTracks()
  tracks.forEach(function (track) {
    track.stop()
  })
}
