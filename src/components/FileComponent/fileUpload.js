import {Alert, Button, Col, Form, ListGroup, Row} from 'react-bootstrap';
import React,{Component} from 'react';
import FileDataCategory from 'services/fileDataCategory';
import { DropdownButton, ButtonGroup, Dropdown } from 'react-bootstrap';
import { fileService } from 'services';

class UploadFiles extends Component {

    constructor(props) {
      super(props)
      this.state = {
        category: FileDataCategory.MARKETING,
        selectedFile: null,
      }
    }
 
    onFileChange = event => {
          this.setState({ selectedFile: event.target.files[0] });
    };

    onCategoryChange = category => {
      this.setState({
        category
      })
    }
    
    onFileUpload = () => {
      if (!this.state.selectedFile) {
        console.log( "No file selected")
        return 
      }

      const formData = new FormData();
    
      formData.append(
        "file",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
    
      fileService.post(formData, {
        params: {
          category: this.state.category
        },
        headers: {
           "Content-Type": "multipart/form-data"
        },
      })
      .then(() => {
        this.props.onClick()
      });
    };

    fileData = () => {
      
      if (!this.state.selectedFile) {
        console.log( "No file selected")
        return <Alert key="warning" variant="warning">No file selected</Alert>
      }
      
      if (this.state.selectedFile && this.state.selectedFile.type == "text/csv") {
         
        return (
          <Alert key="success" variant="success">
            <h2>File Details:</h2>          
            <p>File Name: {this.state.selectedFile.name}</p>      
            <p>File Type: {this.state.selectedFile.type}</p>
          </Alert>
        );
      } else if(this.state.selectedFile && this.state.selectedFile != "text/csv") {
          return <Alert key="danger" variant="danger">Invalid file type</Alert>
      }
    };
    
    render() {

      return (
        <div>
            
            <div>
              <Row>
                <Col>
                  <DropdownButton as={ButtonGroup} title={`${this.state.category}`} variant="primary" className="mb-1" onChange={this.onCategoryChange}>  
                    <Dropdown.Item action onClick={() => this.onCategoryChange(FileDataCategory.SALES)}>
                    {FileDataCategory.SALES}
                    </Dropdown.Item>
                    <Dropdown.Item action onClick={() => this.onCategoryChange(FileDataCategory.MARKETING)}>
                    {FileDataCategory.MARKETING}
                    </Dropdown.Item>
                    <Dropdown.Item action onClick={() => this.onCategoryChange(FileDataCategory.HEALTH)}>
                    {FileDataCategory.HEALTH}
                    </Dropdown.Item>
                    <Dropdown.Item action onClick={() => this.onCategoryChange(FileDataCategory.EDUCATION)}>
                    {FileDataCategory.EDUCATION}
                    </Dropdown.Item>
                    <Dropdown.Item action onClick={() => this.onCategoryChange(FileDataCategory.SPORT)}>
                    {FileDataCategory.SPORT}
                    </Dropdown.Item>
                    <Dropdown.Item action onClick={() => this.onCategoryChange(FileDataCategory.SOCIAL)}>
                    {FileDataCategory.SOCIAL}
                    </Dropdown.Item>
                    <Dropdown.Item action onClick={() => this.onCategoryChange(FileDataCategory.FINANCE)}>
                    {FileDataCategory.FINANCE}
                    </Dropdown.Item>
                  </DropdownButton>
                </Col>
                <Col xs={9}>
                  <Form.Control type="file" onChange={this.onFileChange} accept="text/csv" />
                </Col>
                <Col>
                <Button onClick={this.onFileUpload}>UPLOAD</Button>
                </Col>
                <Col xs={12}>
                </Col>
              </Row>
            </div>
          {this.fileData()}
        </div>
      );
    }
  }
 
  export default UploadFiles;