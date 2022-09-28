import React, { useRef, useEffect, useState } from 'react';

import CsLineIcons from 'cs-line-icons/CsLineIcons';
import {Row, Col, Card, NavLink, Button } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import 'intro.js/introjs.css';
import EditableRows from  'views/interface/plugins/datatables/EditableRows/EditableRows';
import ChartDoughnut from 'views/interface/plugins/chart/ChartDoughnut';
import ChartCustomLegendBar from 'views/interface/plugins/chart/ChartCustomLegendBar';
import ChartHitmap from 'views/interface/plugins/chart/ChartHitmap';
import ChartBoxPlot from 'views/interface/plugins/chart/ChartBoxPlot';
import { fileService } from 'services';
import { useReactToPrint } from 'react-to-print';
import './analysis.css'


const AnalysedFile = (props) => {

  const [analysedFile, setAnalysedFile] = useState({})
  const content = "Numeral value containers for different stats with icons and various layouts."
  const uploadedFileId = props.match.params.uploadedFileId;
  
  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({ 
    content: () => componentRef.current
  });


  useEffect(() => {
    fileService.getAnalysedFile(uploadedFileId).then(analysis => {
      setAnalysedFile(analysis.data)
      getCorrelationHeaders(analysis.data)
     })
   
  }, []);

  const loadAnalysedFile = () => {
    fileService.getAnalysedFile(uploadedFileId).then(analysis => {
     setAnalysedFile(analysis.data)
     console.table("Analysis :", analysis.data)
    })
    
  }

  
  const getCorrelationHeaders = (analysedFile) => {
    const headers = []
    for(let index in analysedFile?.jsonfile.Correlation){
    //analysedFile.jsonfile.Correlation.forEach(index => {
      if (!headers.includes(analysedFile?.jsonfile.Correlation[index].ColumnName1)) {
        headers.push(analysedFile.jsonfile.Correlation[index].ColumnName1)
      }
      if (!headers.includes(analysedFile?.jsonfile.Correlation[index].ColumnName2)) {
        headers.push(analysedFile.jsonfile.Correlation[index].ColumnName2)
      }
      console.log(analysedFile.jsonfile.Correlation[index].ColumnName2)

    }
    return headers.map(v => ({category: v}))
  }
   
    let correlationcount
    if(analysedFile.jsonfile){
      correlationcount =  analysedFile.jsonfile.Correlation.length;
    }
    let columnscount
    if(analysedFile.jsonfile){
       columnscount = analysedFile.jsonfile.columns.length;
    }
    let categoricalcount
    if(analysedFile.jsonfile){
      categoricalcount = analysedFile.jsonfile.Catgorical.length;
    }
    let filename
    if(analysedFile.jsonfile){
        filename  = analysedFile.jsonfile.CSVTitle;
    }
   
    let editableRows = null
    let DoughnutList = []
    let chartBar = [];
    let chartData = []
    let barChartData = []
    let chartLabel = []
    let chartHitmap = null
    let boxChart = null

    if (analysedFile.jsonfile) {
        editableRows = (<EditableRows analysedFile={analysedFile.jsonfile}/>)
        for(let index in analysedFile.jsonfile.Catgorical){
          const category = analysedFile.jsonfile.Catgorical[index]
          chartLabel = category.List_Unique
          chartData = category.values
          barChartData = []
          for (const nIndex in category.List_Unique) {
            let tmp = Array(category.List_Unique.length-1)
            tmp = tmp.fill(null)
            tmp.splice(nIndex, 0, chartData[nIndex])
            const dataset = {
              label: category.List_Unique[nIndex],
              data: tmp
            }
            barChartData.push(dataset)
          
          }
          if(chartLabel.length > 3) {
            chartBar.push((
              <Col xs="12" sm="6">
                <h2 className="small-title mt-5">{category.ColumnName}</h2>
                <Card body>
                  <ChartCustomLegendBar chartData={barChartData} chartLabel={chartLabel}/>
                </Card>
              </Col>
            ))
          } else if(chartLabel.length) {
            DoughnutList.push((
              <Col xs="12" sm="3">
               <h2 className="small-title mt-5">{category.ColumnName}</h2>
                <Card body>
                  <ChartDoughnut chartData={chartData} chartLabel={chartLabel}/>
                </Card>
              </Col>
            ))
          }
        }
       
        const CorrelationHeaders = getCorrelationHeaders(analysedFile);
        console.log("haaaaaa", CorrelationHeaders)
        console.log("testttttttttttt",analysedFile.jsonfile.Correlation)
        chartHitmap = <Card body><ChartHitmap chartData={analysedFile.jsonfile.Correlation} axisData={CorrelationHeaders} /> </Card>
         
        const boxChartLabel = []
        const boxChartData = []
        for(let index in analysedFile.jsonfile.columns) {
          const columns = analysedFile.jsonfile.columns[index]
          if (columns.Outliers == undefined || !columns.Outliers.length)
            continue
          boxChartLabel.push(columns.ColumnName)
          const boxData = new Array(boxChartLabel.length)
          boxData.fill([])
          boxData[boxChartLabel.indexOf(columns.ColumnName)] = columns.Outliers
          boxChartData.push({
            label: columns.ColumnName,
            borderWidth: 1,
            outlierColor: '#999999',
            data: boxData
          })
          chartLabel = [columns.ColumnName]
        }
        boxChart = <Card body><ChartBoxPlot chartLabel={boxChartLabel} chartData={boxChartData}/></Card>
    }
    return (
      <>
        <HtmlHead title="Analysis" description="Dashboard" />
        <div className="fixedButton">
                    <Button size="sm" className="rounded-circle" onClick={() => handlePrint()}>
                    <CsLineIcons size="15" icon="print"/>
                    </Button>
                </div>
           
        <div className="mb-5">
        <Row className="g-2">
        
        <Col sm="6">
                <Card className="sh-11 hover-scale-up cursor-pointer">
                  <Card.Body className="h-100 py-3 align-items-center">
                    <Row className="g-0 h-100 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="bg-gradient-light sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="file-chart" className="text-white" />
                        </div>
                      </Col>
                      <Col>
                        <Row className="gx-2 d-flex align-content-center">
                          <Col xs="12" className="col-12 d-flex">
                            <div className="d-flex align-items-center lh-1-25">File</div>
                          </Col>
                          <Col xl="auto" className="col-12">
                            <div className="cta-2 text-primary">{filename}</div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm="6">
                <Card className="sh-11 hover-scale-up cursor-pointer">
                  <Card.Body className="h-100 py-3 align-items-center">
                    <Row className="g-0 h-100 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="bg-gradient-light sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="grid-1" className="text-white" />
                        </div>
                      </Col>
                      <Col>
                        <Row className="gx-2 d-flex align-content-center">
                          <Col xs="12" className="col-12 d-flex">
                            <div className="d-flex align-items-center lh-1-25">Columns Number</div>
                          </Col>
                          <Col xl="auto" className="col-12">
                            <div className="cta-2 text-primary">{columnscount}</div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm="6">
                <Card className="sh-11 hover-scale-up cursor-pointer">
                  <Card.Body className="h-100 py-3 align-items-center">
                    <Row className="g-0 h-100 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="bg-gradient-light sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="list" className="text-white" />
                        </div>
                      </Col>
                      <Col>
                        <Row className="gx-2 d-flex align-content-center">
                          <Col xs="12" className="col-12 d-flex">
                            <div className="d-flex align-items-center lh-1-25">Categorical Number</div>
                          </Col>
                          <Col xl="auto" className="col-12">
                            <div className="cta-2 text-primary">{categoricalcount}</div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm="6">
                <Card className="sh-11 hover-scale-up cursor-pointer">
                  <Card.Body className="h-100 py-3 align-items-center">
                    <Row className="g-0 h-100 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="bg-gradient-light sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="chart-4" className="text-white" />
                        </div>
                      </Col>
                      <Col>
                        <Row className="gx-2 d-flex align-content-center">
                          <Col xs="12" className="col-12 d-flex">
                            <div className="d-flex align-items-center lh-1-25">Correlation Number</div>
                          </Col>
                          <Col xl="auto" className="col-12">
                            <div className="cta-2 text-primary">{correlationcount}</div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              </Row></div>
            
            
              <section ref={componentRef}>
      <NavLink to="#" className="d-block body-link mb-1">
      <CsLineIcons icon="grid-1" className="me-2" size="17" />
      <span className="align-middle small-title">Columns Analysis</span> 
      </NavLink>
      <Card className="mb-5" body>
              <Card.Text>               
             {content}</Card.Text>
            </Card>
        { editableRows }

            
  
       
        <NavLink to="#" className="d-block body-link mb-1">
      <CsLineIcons icon="diagram-2" className="me-2" size="17" />
      <span className="align-middle small-title">Outliers Values Analysis</span> 
      </NavLink>
      <Card className="mb-5" body>
              <Card.Text>               
             {content}</Card.Text>
            </Card>
      <Row className="mb-5 mt-5">{ boxChart }</Row>
     
     
      <NavLink to="#" className="d-block body-link mb-1">
      <CsLineIcons icon="chart-2" className="me-2" size="17" />
      <span className="align-middle small-title">Categorical Values Analysis</span> 
      </NavLink>
      <Card className="mb-5" body>
              <Card.Text>               
             {content}</Card.Text>
            </Card>
      <Row className="mt-5 mb-5">{chartBar}</Row>
      <Row className="mt-5 mb-5">{DoughnutList}</Row>
     
      <NavLink to="#" className="d-block body-link mb-1">
      <CsLineIcons icon="diagram-2" className="me-2" size="17" />
      <span className="align-middle small-title">Correlation Values Analysis</span> 
      </NavLink>
      <Card className="mb-5" body>
              <Card.Text>{content}</Card.Text>
            </Card>
      <Row className='mt-5 mb-5'>{chartHitmap}</Row>
      </section>
      </>

    );
  }

export default AnalysedFile;