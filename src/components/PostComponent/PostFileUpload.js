import React,{Component} from 'react';

import {Button, Col, Form, Row, Card, NavLink} from 'react-bootstrap';
import authService from 'services/authService';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { blogService } from 'services';
import UserService from 'services/UserService';

class PostFileUpload extends Component {

    constructor(props) {
      super(props)
      this.state = {
        selectedFile: null,
        content: null,
        Avatar : UserService.getProfileData() != null && UserService.getProfileData().avatar != undefined ? UserService.getProfileData().avatar : "29.png"    
      }
      this.postFile = React.createRef()
    }
 
    onFileChange = event => {
    
      if (event.target.files.length) {
        this.setState({ selectedFile: event.target.files[0] });
      }
    
    };

    onContentChange = event => {
      this.setState({
        content: event.target.value
      });
    }
  
    onFileUpload = () => {
     
      let formData = new FormData();
    
      formData.append(
        "file",
        this.state.selectedFile,

      );

      if (this.state.selectedFile == null) {
        formData = null
      }

      blogService.post(formData, {
        params: {
          content : this.state.content,
          idUser : authService.getCurrentUser().id,
        }
      }).then( () => {
        this.props.onCreated()
        this.setState({ content: "" });
      }    
      )

    };

    render() {
      const accepted = "image/*,audio/mpeg,video/mpeg,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

      return (
        <Card body>
            
            <Row className="mb-0">
            
             <Col xs="auto">
               <div className="sw-8 ">
                 <img src={"/img/profile/"+UserService.getProfileData()?.avatar} className="img-fluid rounded-xl" alt="thumb" />
               </div>
             </Col>
             <Col>
               <NavLink to="#">{UserService.getProfileData()?.fname + " " + UserService.getProfileData()?.lname}</NavLink>
                  <Form.Control type="file" accept={accepted} className="invisible" ref={this.postFile} onChange={this.onFileChange}/>
                  <Form.Control as="textarea" placeholder="Start a topic..."  value={this.state.content} onChange={this.onContentChange} />
                  <Button onClick={() => this.postFile.current.click()}  size="sm" className="btn-icon mt-2 ">
                    <CsLineIcons icon="attachment"  />
                  </Button>
                  <span> </span>
                  <Button size="sm" className="mt-2" onClick={this.onFileUpload}>UPLOAD</Button> 
                </Col>
                </Row>
        </Card>
       
        
      
      );
    }
  }
 
  export default PostFileUpload;