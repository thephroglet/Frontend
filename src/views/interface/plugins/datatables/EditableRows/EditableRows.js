import React, { useState } from 'react';
import { Badge, Col, Form, Row } from 'react-bootstrap';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState } from 'react-table';
import ControlsSearch from './components/ControlsSearch';

import Table from './components/Table';
import TablePagination from './components/TablePagination';

const EditableRows = ({ analysedFile }) => {
  
   const getColumnsTitles = (columns) => {
    const headers = [];
    const exclude = ['Outliers'];
    for (const i in columns) {
      for (const k in columns[i]) {
        if (!headers.includes(k) && !exclude.includes(k)) {
          headers.push(k)
        }
      }
    }
    return headers;
  }

  const fillBlanks = (columns, titles) => {
    if (columns === undefined || columns === null)
      return []
    columns.forEach((column, index) => {
      titles.forEach(title => {
        if (column[title] === undefined || column[title] === null || column[title] === "") {
          columns[index][title] =  "N/A"
        }
      })
    })
    return columns
  }

  const titles = getColumnsTitles(analysedFile?.columns)
  analysedFile.columns = fillBlanks(analysedFile?.columns, titles)

  const columns = React.useMemo(() => {
    const headers = []
    for (const index in titles) {
      const title = titles[index];
      headers.push({ Header: title, accessor: title, sortable: true, headerClassName: 'text-muted text-small text-uppercase w-20' })
    }
    return headers;
  }, []);

  const [data, setData] = React.useState(analysedFile?.columns);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);

  const tableInstance = useTable(
    { columns, data, setData, isOpenAddEditModal, setIsOpenAddEditModal, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    useRowState
  );

  return (
    <>

      <Row>
        <Col>
          <div>
            <Row className="mb-3">
              <Col sm="12" md="5" lg="3" xxl="2">
                <div className="d-inline-block float-md-start me-1 mb-1 mb-md-0 search-input-container w-100 shadow bg-foreground">
                  <ControlsSearch tableInstance={tableInstance} />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <Table className="react-table rows" tableInstance={tableInstance} />
              </Col>
              <Col xs="12">
                <TablePagination tableInstance={tableInstance} />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default EditableRows;
