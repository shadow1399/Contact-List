
import { set } from 'mongoose';
import { useEffect, useState } from 'react';
import axios from "./api";

import './App.css';

function App() {

  const [data, setData] = useState([]);
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  const [update, setUpdate] = useState({});

  function handleClick(e) {
    e.preventDefault();
    // console.log(name, phone);
    const contact = {
      name: name,
      phone: phone
    }

    axios.post('/api/v1/add-contact', { contact })
      .then(res => {
        console.log(res);
        setname("");
        setphone("");
        setUpdate(res.data);

      })
    // axios({
    //   method: 'post',
    //   url: `/api/v1/add-contact`,
    //   contact,
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // }).then(res => {
    //   console.log(res.message);
    // }).catch(err => {
    //   console.log(err);
    // });
  }

  useEffect(() => {
    axios.get("/api/v1/contacts")
      .then(function (response) {
        // handle success
        setData(response.data.contacts);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });


  }, [update]);
  return (
    <div className="App">
      <h1>Contact_List</h1>
      <ul>
        {data.map(d => (
          <li key={d._id}>
            <p>{d.name}</p>
            <p>{d.phone}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleClick}>
        <input type="text" name="name" placeholder="Enter Your Name" value={name} onChange={(e) => setname(e.target.value)} />
        <input type="text" name="phone" placeholder="Enter Your Phone" value={phone} onChange={(e) => setphone(e.target.value)} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;
