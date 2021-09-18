import React, { Component } from 'react'
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from "clarifai";
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const app = new Clarifai.App({
  apiKey: '675852916f70476fa1a2349789bfcad6'
});

const particlesOptions = {
  particles: {
    number: {
      value:30,
      density: {
        enable:true,
        value_area: 800
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (resp) => {
    const clarifaiFace = resp.outputs[0].data.regions[0].region_info.bounding_box;
    const image  = document.getElementById("inputimage");
    const height = Number(image.height);
    const width = Number(image.width);


    // console.log(height,width);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  drawFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    // console.log(event.target.value);
    this.setState({input:event.target.value})
  }

  onSubmit = () => {
    // console.log("click!");
    this.setState({imageUrl:this.state.input});
    // "a403429f2ddf4b49b307e318f00e528b"
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
    .then(response => this.drawFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({isSignedIn: false})
    }
    else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params= {particlesOptions}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home' 
          ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange = {this.onInputChange} onSubmit = {this.onSubmit}/>
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>

          : (
            route === 'signin'
            ? <Signin onRouteChange = {this.onRouteChange}/>
            : <Register onRouteChange = {this.onRouteChange}/>
          )    
        }
      </div>
    )
  }
};

export default App;
