import React, { createRef } from 'react';
import { App } from './app/App';

export class AppView extends React.Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.state = {
      failed_webgl: false
    };
  }

  componentDidMount() {
    let canvas = this.ref.current;
    let gl = canvas.getContext('webgl2'); 
    if (!gl) {
      this.setState({...this.state, failed_webgl: true});
      return;
    }

    let app = new App(gl);
    app.run();
    this.app = app;
  }  

  step() {
    this.app.steps = 1;
  }

  toggle() {
    this.app.running = !this.app.running;
  }

  randomise() {
    this.app.randomise();
  }

  render() {
    if (this.state.failed_webgl) {
      return <div>Requires WebGL2 Support</div>
    }

    return (
      <div>
        <button onClick={ev => this.randomise()}>Randomiser</button>
        <button onClick={ev => this.step()}>Step</button>
        <button onClick={ev => this.toggle()}>Toggle</button>
        <canvas width={800} height={800} ref={this.ref}></canvas>
      </div>
    );
  }
}
