import io from "socket.io-client";
import "./chat.css";

import React from "react";
import { useEffect, useState } from "react";
import moment from "moment";

// prompt for user
const username = prompt("what is your username");

// step 1 => scket connect
const socket = io("http://localhost:8080", {
  transports: ["websocket", "polling"],
});

export default function Client() {
  // step 2 => make states for user, users, messages
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState("");

  useEffect(() => {
    // for username =>send prompt
    socket.on("connect", () => {
      socket.emit("username", username);
    });
    // receive users  by socket.on
    socket.on("users", (users) => {
      setUsers(users);
    });
    // receive message
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
    //receive file
    // socket.on("file", (file) => {
    //   setFile((messages) => [...messages, file]);
    // });
   
    // save new  user ll be connect in this users
    socket.on("connected", (user) => {
      setUsers((users) => [...users, user]);
    });

    socket.on("disconnected", (id) => {
      setUsers((users) => {
        return users.filter((user) => user.id !== id);
      });
    });
  }, []);

  const submit = (event) => {
    event.preventDefault();
    socket.emit("send", message, file);
console.log(file, 'fileeee');
    setMessage("");
    setFile()
  };


  return (
    <div className="container">
      <div className="row">
        <div className="col bg-dark text-light">
          <h1>Room Chat for Limkokwing</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mt-4 mb-4 bg-dark text-light">
          <h2>I am {username}</h2>
        </div>
      </div>
      <div className="row bg-dark text-light">
        <div className="col-md-8 ">
          <h6>Messages</h6>
          <div id="messages">
            {messages.map(({ user, date, text }, index) => (
              <div key={index} className="row mb-2">
                <div className="col-md-3 text-light">
                  {moment(date).format("h:mm:ss a")}
                </div>
                <div className="col-md-2 text-light">{user.name}</div>
                <div className="col-md-4 text-light">{text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={submit} id="form">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                onChange={(e) => setMessage(e.currentTarget.value)}
                value={message}
                id="text"
              />
              <div>
                <input accept="png" type="file" value={file} onChange={(e)=>setFile(e.target.value)}  />
              </div>
              <span className="input-group-btn">
                <button id="submit" type="submit" className="btn btn-primary">
                  Send
                </button>
              </span>
             
            </div>
          </form>
         
        </div>
        <div className="col-md-4 usernames">
          <div>
            <h6 bg="dark" color="red">
              Users
            </h6>
          </div>
          <ul id="users">
            {users.map(({ name, id }) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
   
        </div>
      </div>
    </div>
  );
}
