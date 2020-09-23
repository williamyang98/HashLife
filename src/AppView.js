import React, { createRef } from 'react';
import { App } from './app/App';
import { vec2 } from 'gl-matrix';
import "./AppView.css";

export class AppView extends React.Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.state = {
      failed_webgl: false,
      running: false,
      nodes: 0,
      steps: 0,
      time_compression: true,
      size: 10,
    };
    this.controller = new MouseController();
  }

  componentDidMount() {
    let canvas = this.ref.current;
    let gl = canvas.getContext('webgl2'); 
    if (!gl) {
      this.setState({...this.state, failed_webgl: true});
      return;
    }

    let app = new App(gl, this.state.size, this.state.time_compression);
    app.run();
    this.is_randomise = false;
    this.is_clear = false;
    this.app = app;

    this.app.listen((stats) => {
      setTimeout(() => this.on_stats(stats), 0);
    })

    this.controller.listen_drag(({start, end}) => {
      let xstart = Math.min(start[0], end[0]);
      let xend = Math.max(start[0], end[0]);
      let ystart = Math.min(start[1], end[1]);
      let yend = Math.max(start[1], end[1]);
      if (this.is_randomise) {
        this.app.randomise(xstart, xend, ystart, yend);
      } else if (this.is_clear) {
        this.app.clear(xstart, xend, ystart, yend);
      }
    })
  }  

  on_stats({steps, nodes}) {
    this.setState({...this.state, steps, nodes});
  }

  step() {
    this.app.step();
  }

  toggle() {
    this.app.running = !this.app.running;
    this.setState({...this.state, running:this.app.running});
  }

  on_mouse_down(ev) {
    this.controller.on_mouse_down(ev);
    switch (ev.button) {
      case 0: 
        this.is_randomise = true; 
        this.is_clear = false; 
        break;
      case 2: 
        this.is_randomise = false;
        this.is_clear = true; 
        break;
    }
  }

  on_mouse_move(ev) {

  }

  on_mouse_up(ev) {
    this.controller.on_mouse_up(ev);
    this.is_randomise = false;
    this.is_clear = false;
    ev.preventDefault();
  }

  clear(ev) {
    this.app.clear();
  }

  randomise(ev) {
    this.app.randomise();
  }

  render() {
    if (this.state.failed_webgl) {
      return <div>Requires WebGL2 Support</div>
    }

    return (
      <div className="container">
        <div className="fixed">
          {this.render_controls()}
          {this.render_settings()}
          {this.render_stats()}
        </div>
        <div className="flex-item">
          <canvas className="view" width={1024} height={1024} ref={this.ref}
                  onMouseDown={ev => this.on_mouse_down(ev)}
                  onMouseMove={ev => this.on_mouse_move(ev)}
                  onMouseUp={ev => this.on_mouse_up(ev)}></canvas>
        </div>
      </div>
    );
  }

  render_controls() {
    return <div>
      <button onClick={ev => this.clear()}>Clear</button>
      {!this.state.running && <button onClick={ev => this.step()}>Step</button>}
      <button onClick={ev => this.toggle()}>{this.state.running ? 'Pause' : 'Resume'}</button>
      <button onClick={ev => this.randomise()}>Randomise</button>
    </div>
  }

  render_stats() {
    return <div>
      <h3>Stats</h3>
      <div>Steps: {this.state.steps}</div>
      <div>Nodes: {this.state.nodes}</div>
    </div>
  }

  render_settings() {
    let onSubmit = ev => {
      ev.preventDefault();
      this.app.update_settings(this.state.size, this.state.time_compression);
    }

    let onCompression = ev => {
      this.setState({...this.state, time_compression: ev.target.checked})
    }

    let onSize = ev => {
      this.setState({...this.state, size: ev.target.value});
    }

    return <div>
      <h3>Settings</h3>
      <form onSubmit={onSubmit}>
        <div>
          <label>Time compression</label>
          <input type="checkbox" checked={this.state.time_compression} onChange={onCompression}></input>
        </div>
        <div>
          <label>Depth</label>
          <input type="number" name="quantity" min="2" max="10" value={this.state.size}
            onChange={onSize}></input>
        </div>
        <button type="submit" className="button primary small">Update Settings</button>
      </form>
    </div> 
  }
}

class MouseController {
  constructor() {
    this.drag_start = vec2.create();
    this.drag_end = vec2.create();
    this.drag_listeners = new Set();
  }
  
  listen_drag(list) {
    this.drag_listeners.add(list);
  }

  get_position(ev) {
    var rect = ev.target.getBoundingClientRect();
    var x = ev.clientX - rect.left; //x position within the element.
    var y = ev.clientY - rect.top;  //y position within the element.
    return vec2.fromValues(x/rect.width, y/rect.height);
  }

  on_mouse_down(ev) {
    this.drag_start = this.get_position(ev);
  }

  on_mouse_up(ev) {
    this.drag_end = this.get_position(ev);
    for (let list of this.drag_listeners) {
      list({start:this.drag_start, end:this.drag_end});
    }
  }
}
