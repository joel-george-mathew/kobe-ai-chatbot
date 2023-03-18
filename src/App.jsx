
import {useState,useEffect, useRef} from 'react'
import 'regenerator-runtime/runtime'
import { Configuration, OpenAIApi } from "openai"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./App.css"

const configuration = new Configuration({
  apiKey: "//your api key",
});
const openai = new OpenAIApi(configuration);

function App() {
  const inputRef = useRef();
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);

  const speakKobeResponse = (res) => {
    if ('speechSynthesis' in window) {
      let speakData = new SpeechSynthesisUtterance(res);
      speechSynthesis.speak(speakData);
    }
  }
   


  const askKobe = async (query) => {
    const response = openai.createChatCompletion({
      model:"gpt-3.5-turbo",
      messages:[
            {"role": "system", "content": "You are Kobe Bryant. Kobe Bryant was a driven, energetic self-proclaimed “overachiever”. He enjoyed setting his sights on big goals and working to accomplish them."},
            {"role": "user", "content": "What is your advice or message for thefuture generations?"},
            {"role": "assistant", "content": "Life is too short to get bogged down and be discouraged. You have to keep moving. You have to keep going. Put one foot in front of the other, smile and just keep on rolling."},
            {"role": "user", "content": "What inspired you to be the greatest basketball player?"},
            {"role": "assistant", "content": "The love of the game. I would watch Magic Johnson play , Michael Jordan play and I would think to myself can I reach to that level?  Let's find out and here I am."},
            {"role": "user", "content": `${query}`},
        ]
      })
      
    const res = (await response).data.choices[0].message.content
    setHistory(prevHistory => [{id: Date.now(), query: query, response: res}, ...prevHistory]);
    speakKobeResponse(res)
    setStatus("")
  }
  
  const handleSubmit = (e) => {
    const query = inputRef.current.value
    if(query === '') return 
    setStatus("Loading...")
    handleSynthesisStop()
    askKobe(query)
  }

  const handleSpeak = (e) => {
    SpeechRecognition.startListening()
    setIsListening(true)
  }

  const handleStop = (e) => {
    SpeechRecognition.stopListening()
    setIsListening(false)
    inputRef.current.value = transcript
    handleSynthesisStop()
    askKobe(transcript)
  }

  const handleSynthesisStop = (e) => {
    speechSynthesis.cancel()
  }


  return (
    <div className='app'>
      <h1 id = "title" >Kobe Bryant ChatBot</h1>
      <div className='searchBar'>

      <input type="text" ref = {inputRef} placeholder = "Type something...." />
      <button id = "btn" onClick = {handleSubmit} >💬</button>
      {isListening ? <button id = "btn" onClick = {handleStop} >🛑</button> : <button id = "btn" onClick = {handleSpeak} >🎙️</button>}
      

      </div>
      <div>{status}</div>
      <div className='response' >
        {history.map(item => {
          return (
            <div id = "item" key = {item.id}>
              <> <h3>User:</h3>  {item.query}</>
              <> <h3>Kobe:</h3> {item.response}</>
              <div style = {{textAlign: 'right'}}>

              <button id = "btn" onClick = {handleSynthesisStop} style = {{marginTop: "20px"}}>🛑 </button> 
              <button  id = "btn" onClick = {handleSubmit} style = {{marginTop: "20px"}}>♻️ </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App