import React, { useEffect, useState } from 'react';
import { Card, Table, Button, NavLink, Row, Col } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import 'intro.js/introjs.css';
import UploadFiles from "components/FileComponent/fileUpload";
import {fileService} from 'services';
import authService from 'services/authService';
import AutocompleteFiles from 'views/interface/forms/controls/autocomplete/AutocompleteFiles';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import ConfirmationModal from 'components/ConfirmationModal/ConfirmationModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



const DashboardsDefault = () => {
  
  const breadcrumbs = [ 
    { to: '', text: 'Home' },
    { to: 'blog', text: 'Blog' },
    { to: 'support', text: 'Support' },
    ]
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [files, setFiles] = useState([])
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false)
  const [fileId, setFileId] = useState({})

  const FilterDate = (startDate,endDate) => {
    console.log("start", startDate)
    console.log("end", endDate)
    fileService.FilterByDate(startDate,endDate).then(file => {
      setFiles(file.data)
        sessionStorage.setItem("files", file.data)
      })
    console.log(fileService.FilterByDate(startDate,endDate));
  }

  const loadFilesHistory = () => {
    fileService.getByUserId().then(file => {
    setFiles(file.data)
      sessionStorage.setItem("files", file.data)
    })
  }

  const deletefileById = () => {
    fileService.delete(fileId).then(() => {
      loadFilesHistory()
      setShowDeleteFileModal(false)
    })
  }

  const AskDeletion = (fileId) => {
   setFileId(fileId),
   setShowDeleteFileModal(true)
  }

  useEffect(() => {
    loadFilesHistory();
  }, []);

  const title = 'Dashboard';
  const description = 'Default';

   
    let filesList = []
    let display = null
    let robotMsg = null

    
    if(files.length == 0){
      robotMsg = (
          <Col xs="auto" className="d-flex align-items-center justify-content-center">
            <NavLink>
            <p size="75">Hi {authService.getCurrentUser().firstname}!
            <p>Oops! You don't have any available files.</p>
            </p>
            </NavLink>
          <img src="/img/images/robot.png" width="15%" height="15%" alt="image" />
          </Col>
      )
    }
    
    if (files && files.length > 0) {
      files.forEach(file => {
        const name = file.file
        const stylish = name.slice(0, -4)
        filesList.push((
          <tr key={file.id}>
          <th scope="row"> <NavLink href={"/analysis/" + file.id}> {stylish}</NavLink></th>
          <td>{ file.uploadedAt }</td>
          <td><Button size="sm" onClick={() => AskDeletion(file.id)}>DELETE</Button></td>
          <td><NavLink href={"/analysis/" + file.id}>👁</NavLink></td>
        </tr>
        ))
      })
      display = (
        <section className="scroll-section" id="hoverableRows">
        <Card body className="mb-5">
       <Row>   
          <Col>
          <AutocompleteFiles/> 
          </Col> 
          <Col>
          <DatePicker
            className="form-control"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            startDate={startDate}
            endDate={endDate}
          />
          </Col>
          <Col>
          <DatePicker
            className="form-control"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
          </Col>
       <Col>
        <Button onClick={() => FilterDate(startDate, endDate)} variant="outline-primary" >
        Filter
      </Button></Col></Row>
              {/*DATE PICKER ENDS*/}
       
          <h2></h2>
          <Table hover>
                <thead>
                  <tr>
                    <th scope="col">File</th>
                    <th scope="col">Date</th>
                    <th scope="col">Delete</th>
                    <th scope="col">View</th>
                  </tr>
                </thead>
                <tbody>{filesList}</tbody>
              </Table>
        </Card>
      </section>
    )}else if(files.length == 0){
      display = null
    }

    return (
      <>
        <HtmlHead title={title} description={description} />
            <Col md="7" className="mb-5">
            <h6 className="mb-0 pb-0 display-7">{authService.getCurrentUser().firstname} {authService.getCurrentUser().lastname}'s Dashboard </h6>
            <BreadcrumbList items={breadcrumbs}  />
          </Col>
       <div>
        <UploadFiles onClick={() => loadFilesHistory()} />
        </div>
        <Row>{display}</Row>
     
      {robotMsg}
          <ConfirmationModal
            show={showDeleteFileModal}
            onCancel={() => showDeleteFileModal(false)}
            onConfirmation={() => deletefileById()}
          >
            <p>
              Are you sure you want to delete this file? <th></th>
              This action can not be reverted.
            </p>
          </ConfirmationModal>
              <ul/>    
             
      </>

    );
  }


export default DashboardsDefault;
