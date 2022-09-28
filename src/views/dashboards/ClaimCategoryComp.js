import React,{Component} from 'react';

import { Col, Row} from 'react-bootstrap';
import { DropdownButton, ButtonGroup, Dropdown } from 'react-bootstrap';
import ClaimCategory from 'services/ClaimCategory';


class ClaimCategoryComp extends Component {

    constructor(props) {
        super(props)
        this.state = {
          category: ClaimCategory.REPORT,
        }
      }
 
      onCategoryChange = category => {
        this.setState({
          category
        })
        this.props.onChange(category)
      }


    render() {
        
        return (

                    <DropdownButton as={ButtonGroup} title={`${this.state.category}`} variant="quaternary" className="mb-1" onChange={this.onCategoryChange}>
                      <Dropdown.Item action onClick={() => this.onCategoryChange(ClaimCategory.TECHNICAL)}>
                      {ClaimCategory.TECHNICAL}
                      </Dropdown.Item>
                      <Dropdown.Item action onClick={() => this.onCategoryChange(ClaimCategory.REPORT)}>
                      {ClaimCategory.REPORT}
                      </Dropdown.Item>
                     
                    </DropdownButton>
                
        );
      }
    }
   
export default ClaimCategoryComp;