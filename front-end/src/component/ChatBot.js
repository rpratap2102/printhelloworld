import { useState, useEffect } from "react";
import React, { useContext } from "react";
import { UserContext } from "../App";
import { redirect } from "react-router-dom";
import { GetUsersQuestions, GetBotResponse } from "../services/CheerBotService";
import ProgressBar from "react-bootstrap/ProgressBar";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";

function ChatPage() {
  const NegativeFollowUpResponse = [
    "sadness",
    "annoyance",
    "disappointment",
    "fear",
    "disapproval",
    "disgust",
    "anger",
    "embarrassment",
    "grief",
    "remorse",
    "realization",
    "nervousness",
    "confusion",
    "neutral",
  ];
  const PositiveFollowUpResponse = [
    "approval",
    "caring",
    "amusement",
    "curiosity",
    "optimism",
    "desire",
    "admiration",
    "relief",
    "joy",
    "excitement",
    "gratitude",
    "love",
    "surprise",
    "pride",
  ];
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [negative, setNegative] = useState(0);
  const [positive, setPositive] = useState(0);
  const [endChat, setEndChat] = useState(false);
  const [predictions, setpredictions] = useState([]);

  useEffect(() => {
    console.log("effect useEffect");
    console.log(user);
    if (!user) {
      return redirect("/login");
    }

    if (user.question === 0 && user.progress.length === 0) {
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: "Hi there,\nI’m hello world bot, a personalized chatbot curated to understand human emotions and cheer them up. I am here to listen and would try to make you feel better.\n In case, you want a friendly talk and want to laugh out loud, I can share some of my favorite memes and jokes.",
        },
      ]);
    } else {
      (async () => {
        let cur_question = user.question - 1;
        const qns = await GetUsersQuestions();
        let msgs = [];
        if (cur_question === -1) {
          msgs.push({
            id: 1,
            sender: "bot",
            text: "Hi there,\nI’m hello world bot, a personalized chatbot curated to understand human emotions and cheer them up. I am here to listen and would try to make you feel better.\n In case, you want a friendly talk and want to laugh out loud, I can share some of my favorite memes and jokes.",
          });
          msgs.push({
            id: 2,
            sender: "bot",
            text: "Sorry I did not got your name last time. What's your name.",
            followup: "",
            action: "",
          });
        } else if (cur_question === 0) {
          msgs.push({
            id: 1,
            sender: "bot",
            text: "Welcome again, Lets Continue.",
            followup: "",
            action: "",
          });
          msgs.push({
            id: 2,
            sender: "bot",
            text: qns[cur_question + 1].question,
            followup: "",
            action: "",
          });
        } else if (cur_question + 1 >= qns.length) {
          msgs.push({
            id: 1,
            sender: "bot",
            text: qns[cur_question].question,
            followup: "",
            action: "",
          });
          msgs.push({
            id: 2,
            sender: "user",
            text: user.progress.slice(-1)[0].response,
            followup: "",
            action: "",
          });
          msgs.push({
            id: 3,
            sender: "bot",
            text: "Hope you liked out chatting with me for now i can only support you for this long only. Please reach out the the team for further assistance and also refer your emotion history graphs ",
            followup: "",
            action: "",
          });
          setEndChat(true);
        } else {
          msgs.push({
            id: 1,
            sender: "bot",
            text: qns[cur_question].question,
            followup: "",
            action: "",
          });
          console.log(qns[cur_question].question);
          msgs.push({
            id: 2,
            sender: "user",
            text: user.progress.slice(-1)[0].response,
            followup: "",
            action: "",
          });
          msgs.push({
            id: 3,
            sender: "bot",
            text: "Lets start from where we left",
            followup: "",
            action: "",
          });
          msgs.push({
            id: 4,
            sender: "bot",
            text: qns[cur_question + 1].question,
            followup: "",
            action: "",
          });
        }
        console.log(msgs);
        setMessages(msgs);
      })();
    }
    const pred = user.progress.map((p) => p.emotion);
    setpredictions([...predictions, ...pred]);
  }, []);

  const CalculateUserPreviousNegative = () => {
    let prevNegative = 0;
    user.progress.forEach((element) => {
      if (NegativeFollowUpResponse.includes(element.emotion.label)) {
        prevNegative += 5;
      }
    });

    return prevNegative;
  };

  const CalculateUserPreviousPositive = () => {
    let prevPositive = 0;

    user.progress.forEach((element) => {
      if (PositiveFollowUpResponse.includes(element.emotion.label)) {
        prevPositive += 5;
      }
    });

    return prevPositive;
  };

  const handleNewMessageChange = (event) => {
    event.preventDefault();
    setMessage(event.target.value);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      return;
    }

    let msgs = [
      ...messages,
      { id: messages.length + 1, sender: "user", text: message },
    ];
    const chatResponse = await GetBotResponse(user.name, message);
    const qns = await GetUsersQuestions();
    if (chatResponse.index + 1 >= qns.length) setEndChat();
    Promise.resolve(chatResponse);
    console.log(chatResponse);
    const botRes = {
      id: messages.length + 2,
      sender: "bot",
      text: chatResponse.res,
      question: chatResponse.question,
      followup: chatResponse.followup,
      action: chatResponse.action,
    };
    if (botRes.text !== "") {
      msgs.push({
        id: botRes.id + 1,
        sender: "bot",
        text: botRes.text,
      });
    }
    if (botRes.followup !== "") {
      msgs.push({
        id: botRes.id + 2,
        sender: "bot",
        text: botRes.followup,
      });
    }
    if (botRes.action !== "") {
      msgs.push({
        id: botRes.id + 3,
        sender: "bot",
        text: botRes.action,
      });
    }
    if (botRes.question !== "") {
      msgs.push({
        id: botRes.id + 4,
        sender: "bot",
        text: botRes.question,
      });
    }
    const predict = {
      label: chatResponse["prediction"]["label"],
      score: chatResponse["prediction"]["score"],
    };
    setpredictions([...predictions, predict]);
    setMessages(msgs);

    if (NegativeFollowUpResponse.includes(predict.label)) {
      console.log("negative  ");
      console.log(predict.label);
      setNegative(negative + 5);
    } else {
      console.log("positive  ");
      console.log(predict.label);
      setPositive(positive + 5);
    }
    setMessage("");
  };
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-md-8 ">
          <h1 className="text-center mb-4 mt-3">Chat with us</h1>
          <div className="card">
            {messages && (
              <>
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
              </>
            )}
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
        <div className="col-md-4 bg-light pt-3 mt-5">
          <center>
            <h3 className="mb-3 text-dark">Previous Progress</h3>
            <p className="lead text-dark">
              Predicted By Tensfor flow Human emotion Train Model
            </p>
            <div className="row mb-5 px-4">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Index</th>
                    <th scope="col">Predicted Emotion</th>
                    <th scope="col">Confidence Level</th>
                  </tr>
                </thead>
                {predictions && (
                  <tbody>
                    {predictions.map((p) => (
                      <tr key={p.index}>
                        <th scope="row">{p.index}</th>
                        <td>{p.label}</td>
                        <td>{p.score}</td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
            <hr />
            <h3 className="mb-3 text-success mt-5">Current Progress</h3>
            <div className="row mb-5">
              <div className="row">
                <div className="col-1 ">
                  <SmileOutlined
                    style={{ color: "#198754", fontSize: "1.2em" }}
                  />
                </div>
                <div className="col">
                  <ProgressBar
                    variant="success"
                    now={CalculateUserPreviousNegative() + negative}
                  />
                </div>
                <h6 className="text-success">Negative Sentiments</h6>
              </div>
              <div className="row mt-5">
                <div className="col-1 ">
                  <FrownOutlined
                    style={{ color: "#198754", fontSize: "1.2em" }}
                  />
                </div>
                <div className="col">
                  <ProgressBar
                    variant="success"
                    now={CalculateUserPreviousPositive() + positive}
                  />
                </div>
                <h6 className="text-success">Positive Sentiments</h6>
              </div>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
