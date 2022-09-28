import React from 'react';
import authService from 'services/authService';
import {getImage, Images} from 'services/Images';
import './icon.css';

class AvatarFilterComponent extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      Avatar : this.getAvatar(),
    }
    this.imgref = React.createRef();
    this.canvaref = React.createRef();
  }

  getAvatar() {
    return getImage(this.props.userprofile?.avatar);
  }

  componentDidMount () {
    this.ApplyFilter();
  }

  ApplyFilter() {
    const ctx = this.canvaref.current.getContext("2d");

  this.imgref.current.onload = () => {
  this.canvaref.current.width = this.imgref.current.width
  this.canvaref.current.height = this.imgref.current.height
  this.imgref.current.crossOrigin = "anonymous";
  ctx.drawImage(this.imgref.current, 0, 0);
  const imgData = ctx.getImageData(0, 0, this.canvaref.current.width,  this.canvaref.current.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    let count = imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2];
    let colour = 0;
    if (count > 510) colour = 255;
    else if (count > 255) colour = 127.5;

    imgData.data[i] = colour;
    imgData.data[i + 1] = colour;
    imgData.data[i + 2] = colour;
    imgData.data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

};
  }

render(){
 

  return (
    
    <>
       <img  src={"/img/profile/"+ this.state.Avatar} ref={this.imgref} style={{display : "none"}} className="img-fluid rounded-xl"  alt="thumb" />
       <canvas ref={this.canvaref} className="img-fluid m-0 rounded-xl" alt="thumb" />
    </>
  );
}
};

export default AvatarFilterComponent;
