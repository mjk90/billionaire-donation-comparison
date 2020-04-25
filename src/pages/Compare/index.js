import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { formatCash, calculateAmount } from "../../lib/money";
import SharePopover from './components/sharePopover';
import { getList } from '../../data/list';

import {
  Button, Spinner,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Input, InputGroup, InputGroupAddon
} from 'reactstrap';


function Compare(props) {
  const [person, setPerson] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalDonation, setModalDonation] = useState("");
  const [modalIncome, setModalIncome] = useState("");
  const [modal, setModal] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const toggle = () => {
    setModal(!modal);
    setPopoverOpen(false);
  };

  const getDetails = (list, name, donated, earn) => {
    let p = list.find(person => person.uri === name);
    if (!!p) {
      p.totalCash = parseFloat(p.finalWorth) * 1000000;
      p.donated = donated;
      p.earn = earn;
      p.calculatedAmount = calculateAmount(donated, p.totalCash, earn);
      setPerson(p);
      setLoading(false);
    }
  }

  useEffect((loading) => {
    const { name, donated, earn } = props.match.params;
    // const localList = JSON.parse(localStorage.getItem('list'));
    const localList = getList();

    if (loading) {
      if (!!localList) {
        getDetails(localList, name, donated, earn);
      }
      // else {
      //   forbes.list().then(response => {
      //     localStorage.setItem('list', JSON.stringify(response));
      //     getDetails(response, name, donated, earn);
      //   });
      // }
    }
    else {
      setModal(false);
      setLoading(true);
      setTimeout(() => getDetails(localList, name, donated, earn), 250);
    }

  }, [props.match.params]);

  return (
    <div className="Compare">
      {loading ? <Spinner color="secondary" className="loadingSpinner" /> :
        !!person &&
        <>
          <div className={`animated-title`}>
            <div className="text-top">
              <div>
                <span>{person.personName}</span>
                <span>donating <b className="text-muted">${formatCash(person.donated)}</b></span>
                <span>is equal to</span>
              </div>
            </div>
            <div className="text-bottom">
              <div>
                <span>someone earning <b className="text-muted">${formatCash(person.earn)}</b></span>
                <span>donating&nbsp;
                  <b className="text-muted">
                    {person.calculatedAmount < 0.1 ? "less than $0.10" : "$" + formatCash(person.calculatedAmount)}
                  </b>
                </span>
              </div>
            </div>
          </div>
          <div className="buttonContainer">
            <div className="buttons">
              <a href={`https://www.map.org.uk/donate/donation-details/1?currency=usd&amount=${person.calculatedAmount < 0.1 ? "5" : formatCash(person.calculatedAmount)}`} target="_blank" rel="noopener noreferrer" className="btn btn-success donateButton">
                Donate {person.calculatedAmount < 0.1 ? 
                  "$5 to a good cause" : 
                  "$" + formatCash(person.calculatedAmount) + " to a good cause"
                }
              </a>
              <Link to="/" className="btn btn-primary backButton">
                View List
              </Link>
              <Button className="btn-primary" onClick={toggle}>
                Update Values
              </Button>
              <Button className="btn-info" id="shareButton">
                Share
              </Button>
              <SharePopover popoverOpen={popoverOpen} setPopoverOpen={setPopoverOpen} personName={person.personName} />
            </div>
          </div>

          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Update Values</ModalHeader>
            <ModalBody>
              <InputGroup className="mb-2">
                <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                <Input placeholder={`${person.personName}'s donation...`} min={0} type="number" step="1" value={modalDonation} onChange={(e) => setModalDonation(e.target.value)} />
              </InputGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                <Input placeholder="Your income..." min={0} type="number" step="1" value={modalIncome} onChange={(e) => setModalIncome(e.target.value)} />
              </InputGroup>
            </ModalBody>
            <ModalFooter>
              <Link to={`/compare/${person.uri}/${modalDonation}/${modalIncome}`} className={`btn btn-primary ${modalDonation > 0 && modalIncome > 0 ? "" : "disabled"}`}>Compare</Link>
              <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </>
      }

    </div>
  );
}

export default Compare;
