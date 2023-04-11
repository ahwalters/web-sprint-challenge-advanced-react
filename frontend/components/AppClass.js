import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

const URL = 'http://localhost:9000/api/result'

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(){
    super(),
    this.state = {...initialState}
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = (this.state.index % 3) + 1
    let y
    if (this.state.index < 3) y=1
    else if (this.state.index <= 5) y=2;
    else if (this.state.index > 5) y=3;
    return [x, y];
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    let [x,y] = this.getXY();
    return `Coordinates (${x}, ${y})`
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState)
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    switch (direction) {
      case "up" :
        return (this.state.index < 3) ? this.state.index : this.state.index-3
      case "down" :
        return (this.state.index > 5) ? this.state.index : this.state.index+3
      case "left" :
        return (this.state.index % 3 === 0) ? this.state.index : this.state.index-1
      case "right" :
        return ((this.state.index-2) % 3 === 0) ? this.state.index : this.state.index+1
    }
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    let id = evt.target.id
    let newIndex = this.getNextIndex(id)
    let message

    /*
    switch (id) {
      case "up" :
        (this.state.index < 3) ? message="You can't go up" : message = ''
        break;
      case "down" :
        (this.state.index > 5) ? message="You can't go down" : message = ''
        break;
      case "left" :
        (this.state.index % 3 === 0) ? message = "You can't go left": message = ''
        break;
      case "right" :
        ((this.state.index-2) % 3 === 0) ? message = "You can't go right" : message = ''
        break;
    }
    */
    if (newIndex !== this.state.index) {
      this.setState({
        ...this.state,
        steps: this.state.steps + 1,
        message: initialMessage,
        index: newIndex,
      })
    } else {
      this.setState({
        ...this.state,
        message: `You can't go ${id}`,
      })
    }
  }

    // console.log(this.state.message)
    
    // this.setState({
    //   ...this.state, 
    //   message,
    //   index: newIndex, 
    //   steps: this.state.steps + 1})
    //}

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({
      ...this.state, 
      email: evt.target.value})
  }

onSubmit = (evt) => {
  evt.preventDefault()
  const [x, y] = this.getXY()
  const { email, steps } = this.state
  let message
  axios.post('http://localhost:9000/api/result', { email, steps, x, y })
    .then(res => {
      message = res.data.message
    })
    .catch(err => {
      message = err.response.data.message
    })
    .finally(() => {
      this.setState({
        ...this.state,
        message,
        email: initialEmail,
      })
    })
}

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1 ? "time" : "times"}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">LEFT</button>
          <button onClick={this.move} id="up">UP</button>
          <button onClick={this.move} id="right">RIGHT</button>
          <button onClick={this.move} id="down">DOWN</button>
          <button onClick={this.reset} id="reset">reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input onChange={this.onChange} id="email" type="email" placeholder="type email" value={this.state.email}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}

