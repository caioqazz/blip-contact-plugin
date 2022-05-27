import React, { useState } from "react";
import { Form, Col, Button, Row } from "react-bootstrap";
import { removeEmptyFields } from "../util";
import { FiX } from "react-icons/fi";
import { BdsButton, BdsButtonIcon, BdsInput, BdsSelect, BdsSelectOption } from "blip-ds/dist/blip-ds-react";
const ContactForm = ({ onAdd }) => {
  const [formModel, setFormModel] = useState({
    identity: "",
    name: "",
    email: "",
    source: "Whatsapp",
    phoneNumber: "",
    lastMessageDate: new Date().toISOString(),
  });
  const [extras, setExtras] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    let aux = {};
    for (const key in extras) {
      if (
        extras[key].actived &&
        extras[key].key.length > 0 &&
        extras[key].value.length > 0
      )
        aux = { ...aux, [extras[key].key]: extras[key].value };
    }
    if (Object.keys(aux).length > 0)
      onAdd({ ...removeEmptyFields(formModel), extras: { ...aux } });
    else onAdd(removeEmptyFields(formModel));
  };

  const handleAddExtras = () => {
    setExtras({
      ...extras,
      [`key${Object.keys(extras).length}`]: {
        key: "",
        value: "",
        actived: true,
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Form.Group as={Col} controlId="formGridIdentity">
          <BdsInput
            label="Identity*"
            value={formModel.identity}
            onBdsChange={(e) => {
              setFormModel({ ...formModel, identity: e.detail.value });
            }}
            type="text"
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridName">
          <BdsInput
            label="Name"
            value={formModel.name}
            onBdsChange={(e) => {
              setFormModel({ ...formModel, name: e.detail.value });
            }}
            type="text"
          />
        </Form.Group>
      </Row>

      <Row>
        <br />
        <Form.Group as={Col} controlId="formGridEmail">
          <BdsInput
            label="Email"
            value={formModel.email}
            onBdsChange={(e) => {
              setFormModel({ ...formModel, email: e.detail.value });
            }}
            type="email"
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPhoneNumber">
          <BdsInput
            label="Phone Number"
            value={formModel.phoneNumber}
            onBdsChange={(e) => {
              setFormModel({ ...formModel, phoneNumber: e.detail.value });
            }}
            type="text"
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridGender">
          <BdsSelect label="Source" value={formModel.source} 
          onBdsChange={(e) => {
              setFormModel({ ...formModel, source: e.detail.value });
            }}>
          <BdsSelectOption value="Whatsapp">WhatsApp</BdsSelectOption>
            <BdsSelectOption value="0mn.io">Blip Chat</BdsSelectOption>
            <BdsSelectOption value="Messenger">Messenger</BdsSelectOption>
            <BdsSelectOption value="GBM">Google Business Messages</BdsSelectOption>
            <BdsSelectOption value="AzureBotService">Skype</BdsSelectOption>
            <BdsSelectOption value="AzureBotService">Microsoft Teams</BdsSelectOption>
            <BdsSelectOption value="Telegram">Telegram</BdsSelectOption>
            <BdsSelectOption value="Workplace">Workplace</BdsSelectOption>
            <BdsSelectOption value="Mailgun">Email</BdsSelectOption>
          </BdsSelect>
        </Form.Group>
      </Row>
      <hr />
      <p>Extras</p>
      {Object.keys(extras).map((k, i) => {
        return (
          <Row
            key={i}
            className={
              extras[k].actived ? "extras-item-visible" : "extras-item-hidden"
            }
          >
            <Form.Group as={Col} md="5" controlId="formGridKey">
              <Form.Label>Key</Form.Label>
              <Form.Control
                type="text"
                value={extras[k].key}
                onChange={(e) => {
                  setExtras({
                    ...extras,
                    [k]: { ...extras[k], key: e.target.value },
                  });
                }}
              />
            </Form.Group>

            <Form.Group as={Col} md="5" controlId="formGridValue">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="text"
                value={extras[k].value}
                onChange={(e) => {
                  setExtras({
                    ...extras,
                    [k]: { ...extras[k], value: e.target.value },
                  });
                }}
              />
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="formGridRemove">
              <Form.Label></Form.Label>
              <br />
              <BdsButtonIcon
                variant="delete"
                icon="close"
                className="extras-remove-item"
                onClick={() => {
                  setExtras({
                    ...extras,
                    [k]: { ...extras[k], actived: false },
                  });
                }}
              />
            </Form.Group>
          </Row>
        );
      })}
      <BdsButtonIcon icon="plus" variant="ghost" onClick={handleAddExtras} />
      <hr />
      <BdsButton type="submit" variant="primary" className="float-right">
        Add Contact
      </BdsButton>
    </Form>
  );
};

export default ContactForm;
