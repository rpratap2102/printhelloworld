import { useState, useEffect } from "react";
import React, { useContext } from "react";
import { UserContext } from "../App";

function ChatPage() {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    console.log("effect useEffect");
    console.log(user);
    if (user.question === 0) {
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: "Hi there,\nI’m hello world bot, a personalized chatbot curated to understand human emotions and cheer them up. I am here to listen and would try to make you feel better.\n In case, you want a friendly talk and want to laugh out loud, I can share some of my favorite memes and jokes.",
        },
      ]);
    } else {
      fetch(
        `https://printhelloworldback.azurewebsites.net/api/questions?index=${user.question}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setMessages([
            {
              id: 1,
              sender: "bot",
              text: data[0]["question"],
            },
            {
              id: 2,
              sender: "user",
              text: user.progress.slice(-1)[0].response,
            },
            {
              id: 3,
              sender: "bot",
              text: "Lets continue where we left off!!",
            },
          ]);
        });
      //TODO generate bot response ask next questions
    }
  }, [user]);
  const [newMessage, setNewMessage] = useState("");

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (newMessage.trim() === "") {
      return;
    }
    const newId = messages.length + 1;
    const newMessages = [
      ...messages,
      { id: newId, sender: "user", text: newMessage },
    ];
    setMessages(newMessages);
    setNewMessage("");
    const botResponse = generateBotResponse(newMessage);
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { id: newId + 1, sender: "bot", text: botResponse },
      ]);
    }, 500);
  };

  const generateBotResponse = (message) => {

    const res =  fetch(`https://cheerupchatbot.azurewebsites.net/api/getresponse?u=${user.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "text":message
      })
    }).then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.error(error));
    
    console.log(data.body)
    console.log(data)
    return data.body
  };


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-9 ">
          <h1 className="text-center mb-4">Chat with us</h1>
          <div className="card">
            <div className="card-body">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`row mb-2 ${
                    message.sender === "bot"
                      ? "justify-content-start"
                      : "justify-content-end"
                  }`}
                >
                  <div
                    className={`col-8 p-2 rounded ${
                      message.sender === "bot" ? "bg-light" : "bg-primary"
                    } text-${message.sender === "bot" ? "dark" : "white"}`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form className="mt-4" onSubmit={handleSendMessage}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message"
                value={newMessage}
                onChange={handleNewMessageChange}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Send
            </button>
          </form>
        </div>
        <div className="col-md-3 bg-light pt-3">
          <center>
            <h3 className="mb-3">Emotions History</h3>
          </center>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
