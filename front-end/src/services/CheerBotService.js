export function GetBotResponse(username, message) {
  let chatBotReply = {
    res: "",
    sentiment: "",
    question: "",
    followup: "",
    action: "",
    prediction: {
      label: "",
      score: "",
    },
  };

  fetch(
    `https://cheerupchatbot.azurewebsites.net/api/getresponse?u=${username}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      chatBotReply["res"] = data["body"]["res"];
      chatBotReply["sentiment"] = data["body"]["sentiment"];
      chatBotReply["question"] = data["body"]["question"];
      chatBotReply["followup"] = data["body"]["followup"];
      chatBotReply["action"] = data["body"]["action"];
      chatBotReply["prediction"]["label"] = data["body"]["prediction"]["label"];
      chatBotReply["prediction"]["score"] = data["body"]["prediction"]["score"];
    })
    .catch((error) => console.error(error));

  return chatBotReply;
}

export function GetUsersQuestions(user) {
  let userQuestion = {};

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
    .then((data) => (userQuestion["question"] = data[0]["question"]));

  return userQuestion;
}
