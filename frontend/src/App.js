
import { set } from 'mongoose';
import { useEffect, useState } from 'react';
import axios from "./api";
import Pusher from "pusher-js";

import './App.css';

function App() {

  const [data, setData] = useState([]);
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  // const [update, setUpdate] = useState({});

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


  }, []);

  useEffect(() => {
    var pusher = new Pusher('b546574b102b7cddf092', {
      cluster: 'ap2'
    });

    var channel = pusher.subscribe("contacts");
    channel.bind("inserted", function (newContact) {
      // alert(JSON.stringify(newContact));
      setData([...data, newContact]);
    });
    var channel1 = pusher.subscribe("contacts");
    channel.bind("deleted", function (deletedid) {
      // alert(JSON.stringify(deletedid));

      setData(data.filter(item => item._id !== deletedid));


    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }

  }, [data])
  function handleClick(e) {
    e.preventDefault();
    // console.log(name, phone);
    const contact = {
      name: name,
      phone: phone
    }

    axios.post('/api/v1/add-contact', { contact })
      .then(res => {
        // console.log(res);
        setname("");
        setphone("");


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
  function handleDelete(id) {
    axios.delete(`/api/v1/delete/${id}`)
      .then(res => { console.log("Deleted Contact") })
      .catch((err) => {
        console.log("Error in deleting", err);
      })
  }

  return (
    <div className="App">
      <h1>Contact_List</h1>
      <ul>
        {data.map(d => (
          <li key={d._id}>
            <p>{d.name}</p>
            <p>{d.phone}</p>
            <button onClick={() => handleDelete(d._id)}>Delete</button>
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
