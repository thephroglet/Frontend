import React,{Component} from 'react';

import {Button, Col, Form, Row, Card} from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { blogService } from 'services';


class UpdatePostComponent extends Component {

    constructor(props) {
      super(props)
      this.state = {
        selectedFile: null,
        id: props.id,
        content: props.content,
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

      blogService.put(this.state.id, formData, {
        params: {
          content : this.state.content,
        }
      }).then( () => {
        this.setState({ content: "" });
        this.props.onCreated()
      }    
      )

    };

    render() {
      return (
      
        <Row > 
         <Col>
              <Form.Control type="file" className="invisible" ref={this.postFile} onChange={this.onFileChange}/>
              <Form.Control as="textarea" value={this.state.content} onChange={this.onContentChange} />
              <Button onClick={() => this.postFile.current.click()}  size="sm" className="btn-icon mt-2 ">
                <CsLineIcons icon="attachment"  />
              </Button>
              <span> </span>
              <Button size="sm" className="mt-2" onClick={this.onFileUpload}>UPLOAD</Button> 
            </Col>
            </Row>
      );
    }
  }
 
  export default UpdatePostComponent;