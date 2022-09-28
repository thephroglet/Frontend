import React, { Component } from 'react';
import FileViewer from 'react-file-viewer';

class FileViewerComponent extends Component {

    constructor(props){
        super(props)
    }

    getFileExtension() {
        const split = this.props.file.split(".")
        return split[split.length -1]     
    }
  render() {

    return (
      <FileViewer
        fileType={this.getFileExtension()}
        filePath={this.props.file}
        //errorComponent={CustomErrorComponent}
       // onError={this.onError}
       />
    );
  }

 
}
export default FileViewerComponent;