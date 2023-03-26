export async function GetBotResponse(username, message) {
  console.log(username);
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
    index: "",
  };

  const res = await fetch(
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
  );
  let data = await res.json();
  console.log(data);
  if (res.status === 200) {
    chatBotReply["res"] = data["body"]["res"];
    chatBotReply["sentiment"] = data["body"]["sentiment"];
    chatBotReply["question"] = data["body"]["question"];
    chatBotReply["followup"] = data["body"]["followup"];
    chatBotReply["action"] = data["body"]["action"];
    chatBotReply["prediction"]["label"] = data["prediction"]["label"];
    chatBotReply["prediction"]["score"] = data["prediction"]["score"];
    chatBotReply["index"] = data["index"];
  }

  return chatBotReply;
}

export async function GetUsersQuestions() {
  let res = await fetch(
    `https://printhelloworldback.azurewebsites.net/api/questions`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let data = await res.json();
  console.log(data);
  return data;
}
