import { useState, useEffect } from "react";
import React, { useContext } from "react";
import { UserContext } from "../App";
import { redirect } from "react-router-dom";
import { GetUsersQuestions, GetBotResponse } from "../services/CheerBotService";

function ChatPage() {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [botResponse, setBotResponse] = useState({});

  useEffect(() => {
    console.log("effect useEffect");
    console.log(user);
    if (!user) {
      return redirect("/login");
    }

    if (user.question === 0) {
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: "Hi there,\nI’m hello world bot, a personalized chatbot curated to understand human emotions and cheer them up. I am here to listen and would try to make you feel better.\n In case, you want a friendly talk and want to laugh out loud, I can share some of my favorite memes and jokes.",
        },
      ]);
    } else {
      (async () => {
        console.log("hello");
        const res = await GetUsersQuestions(user.question);
        const question = res.data[0].question;

        const msgs = [
          {
            id: 1,
            sender: "bot",
            text: question,
            followup: "",
            action: "",
          },
          {
            id: 2,
            sender: "user",
            text: user.progress.slice(-1)[0].response,
          },
          {
            id: 3,
            sender: "bot",
            text: "Lets continue where we left off!! - question need to be added",
            followup: "",
            action: "",
          },
        ];
        setMessages(msgs);
      })();
    }
  }, [user]);

  // } else {
  //   fetch(
  //     `https://printhelloworldback.azurewebsites.net/api/questions?index=${user.question}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setMessages([
  //         {
  //           id: 1,
  //           sender: "bot",
  //           text: data[0]["question"],
  //         },
  //         {
  //           id: 2,
  //           sender: "user",
  //           text: user.progress.slice(-1)[0].response,
  //         },
  //         {
  //           id: 3,
  //           sender: "bot",
  //           text: "Lets continue where we left off!!",
  //         },
  //       ]);
  //     });
  //TODO generate bot response ask next questions
  //}
  //});

  const handleNewMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      return;
    }
    const newId = messages.length + 1;
    let msgs = [...messages, { id: newId, sender: "user", text: message }];

    setMessages(msgs);
    const chatResponse = await GetBotResponse(user.name, message);
    console.log(chatResponse);
    const botRes = {
      id: newId + 1,
      sender: "bot",
      text: chatResponse.res,
      question: chatResponse.question,
      followup: chatResponse.followup,
      action: chatResponse.action,
    };
    console.log(botRes);
    setBotResponse(botRes);
  };

  console.log(botResponse);
  // const generateBotResponse = (message) => {

  //   const res =  fetch(`https://cheerupchatbot.azurewebsites.net/api/getresponse?u=${user.name}`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       "text":message
  //     })
  //   }).then(response => response.json())
  //   .then(data => setData(data))
  //   .catch(error => console.error(error));

  //   console.log(data.body)
  //   console.log(data)
  //   return data.body
  // };
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
              {botResponse && (
                <>
                  {botResponse["followup"] != "" && (
                    <div className="card">
                      <div className="card-body">{botResponse["followup"]}</div>
                    </div>
                  )}
                  {botResponse["action"] != "" && (
                    <div className="card">
                      <div className="card-body">{botResponse["action"]}</div>
                    </div>
                  )}
                  {botResponse["question"] != "" && (
                    <div className="card">
                      <div className="card-body">{botResponse["question"]}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <form className="mt-4" onSubmit={handleSendMessage}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message"
                value={message}
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
