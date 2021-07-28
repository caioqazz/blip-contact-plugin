import React, { useState } from "react";
import CsvForm from "./CsvForm";
import { BlipTable } from "components/BlipTable";
import { sortData } from "../util";
import ContactModal from "./ContactModal";
import { Button } from "react-bootstrap";
import ReactGA from "react-ga";
import {
  AiOutlineQuestionCircle,
} from "react-icons/ai";

function ImportContact({ onAdd }) {
  const [data, setData] = useState({
    header: {},
    items: [],
    selected: [],
    model: [],
  });
  const [sort, setSort] = useState([
    { property: "identity", order: "asc" },
    { property: "name", order: "asc" },
    { property: "source", order: "asc" },
  ]);
  const [modal, setModal] = useState({
    position: 0,
    display: false,
    contact: {},
  });
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const handleLoadData = (header, items, model) => {
    setData({ header: header, items: items, selected: [], model: model });
  };
  const handleImportData = () => {
    ReactGA.event({
      category: "Contact Plugin",
      action: `Contact Plugin ${data.selected.length}`,
      label: "Plugin",
    });
    onAdd(data.selected);
  };

  return (
    <>
      <div>
        <CsvForm OnLoadData={handleLoadData} />
        <ContactModal
          position={modal.position}
          display={modal.display}
          data={modal.contact}
          handleClose={() => setModal({ ...modal, display: false })}
        />
        <BlipTable
          idKey="identity"
          model={data.model}
          data={data.items}
          onItemSelect={(item) => setData({ ...data, selected: item })}
          canSelect={true}
          sort={sort}
          onItemClick={(event, item) => {
            setModal({
              position: event.nativeEvent.clientY,
              display: true,
              contact: item,
            });
          }}
          onSortSet={(item) => {
            sortData(data.items, item);
          }}
          bodyHeight="1300px"
          selectedItems={data.selected}
          actions={[
            <Button variant="success" onClick={handleImportData}>
              Adicionar
            </Button>,
          ]}
        />
      </div>
      <br />
      <div>
        <Button
          variant="secondary"
          style={{
            display: !isHelpVisible ? "" : "none",
            paddingLeft: "100px",
            paddingRight: "100px",
          }}
          className="float-right"
          onClick={() => {
            setIsHelpVisible(!isHelpVisible);
          }}
        >
          {" "}
          <AiOutlineQuestionCircle /> Instructions & Samples
        </Button>
      </div>
      <div
        style={{
          display: !isHelpVisible ? "none" : "",
        }}
      >
        <h3> File format extentions supported</h3>

        <li style={{ padding: "10px" }}>
          .csv (Comma-Separated Values): I strongly recommend{" "}
          <b>
            using{" "}
            <a
              href="https://docs.google.com/spreadsheets/u/0/?tgif=d"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Sheets
            </a>
          </b>{" "}
          to edit the file and keep the format
        </li>
        <a
          className="btn btn-success"
          href="https://docs.google.com/spreadsheets/d/1NjMuS0YzAwGMDsHhSfdacB-Pr3evuHgY-Bh4JQCz6sI/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          onClick={()=>{
            ReactGA.event({
              category: "Contact Plugin",
              action: `Contact Plugin - csv export`,
              label: "Plugin",
            });
          }}
        >
          View/Download sample
        </a>

        <li style={{ padding: "10px" }}>
          .tsv (Tab-Separated Values): I strongly recommend{" "}
          <b>
            using{" "}
            <a
              href="https://docs.google.com/spreadsheets/u/0/?tgif=d"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Sheets
            </a>
          </b>{" "}
          to edit the file and keep the format
        </li>
        <a
          className="btn btn-success"
          href="https://docs.google.com/spreadsheets/d/1_uxVA5wghRn0mvMOKjiJ0RxsW_MGmtcrO-1TvmWYJlU/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          onClick={()=>{
            ReactGA.event({
              category: "Contact Plugin",
              action: `Contact Plugin - tsv export`,
              label: "Plugin",
            });
          }}
        >
          View/Download sample
        </a>

        <li style={{ padding: "10px" }}>.txt</li>
        <a
          className="btn btn-success"
          href="https://drive.google.com/file/d/1LYk4SibfPpl8OETbZZA2A72_HGeG4u-n/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          onClick={()=>{
            ReactGA.event({
              category: "Contact Plugin",
              action: `Contact Plugin - txt export`,
              label: "Plugin",
            });
          }}
        >
          View/Download sample
        </a>
      </div>
    </>
  );
}

export default ImportContact;
