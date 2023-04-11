import React, {useState} from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)

  const URL = 'http://localhost:9000/api/result'

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = (index % 3) + 1
    let y
    if (index < 3) y=1
    else if (index <= 5) y=2;
    else if (index > 5) y=3;
    return [x, y];
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    let [x,y] = getXY();
    return `Coordinates (${x}, ${y})`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    switch (direction) {
      case "up" :
        return (index < 3) ? index : index-3
      case "down" :
        return (index > 5) ? index : index+3
      case "left" :
        return (index % 3 === 0) ? index : index-1
      case "right" :
        return ((index-2) % 3 === 0) ? index : index+1
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    //get next index then grab event object target -> direction**
    setIndex((getNextIndex(evt.target.id)))
    setSteps(steps + 1)
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);

  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    //no colon and space in payload
    //`{ "x": 1, "y": 2, "steps": 3, "email": "lady@gaga.com" }`
    //reset the inputs to empty
    let [x,y] = getXY();
    evt.preventDefault()
    axios.post(URL, { "x": x, "y": y, "steps": steps, "email": email })
    .then(res => console.log(res))
    .catch(err => console.error(err))
    .finally(reset())
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message"></h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move} id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} id="email" type="email" placeholder="type email" value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
