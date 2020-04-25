import React, { useEffect, useState } from 'react';
import { formatCash } from "../../lib/money";
import forbes from 'forbes-list';
import { getList } from '../../data/list';

import {
  Spinner,
  ListGroup,
  ListGroupItem,
  Input
} from 'reactstrap';

function Home() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // let localList = JSON.parse(localStorage.getItem('list'));
    const localList = getList();

    if (!!localList) {
      setList(localList);
      setLoading(false);
    }
    else {
      forbes.list().then(response => {
        setList(response);
        setLoading(false);
        localStorage.setItem('list', JSON.stringify(response));
      });
    }
  }, []);

  return (
    <div className="Home">
      <h1>Billionaire Donation Comparison</h1>
      <h2>How generous are you compared to the world's richest people?</h2>
      {loading ? <Spinner color="secondary" className="loadingSpinner" /> :
        <div>
          <Input type="text" name="name" id="name" placeholder="Filter by name..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          {!!list &&
            <ListGroup className="peopleList">
              {list.map((item) =>
                !!item.personName &&
                item.personName.toLowerCase().includes(filter.toLowerCase()) &&
                <ListGroupItem key={item.uri} tag="a" href={`#/compare/${item.uri}/100000/30000`} action>
                  {item.personName}
                  <small className="text-info">${formatCash(parseFloat(item.finalWorth) * 1000000)}</small>
                </ListGroupItem>
              )}
            </ListGroup>
          }
        </div>
      }
      <footer>
        By <a href="https://mjk90.github.io/" target="_blank" rel="noopener noreferrer">Matt Kelly</a>
      </footer>
    </div>
  );
}

export default Home;
