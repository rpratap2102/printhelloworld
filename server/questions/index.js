const CosmosClient = require("@azure/cosmos").CosmosClient;

const endpoint = "https://printhelloworld.documents.azure.com:443/";
const key =
  "MGBOSWyTn7p6q5VxwWTraan4cevAPeQZWo8FVkIpIu2JD7pwawjyeNdITUGtlesdu8tTyrtEZykjACDbRvfAug==";

const client = new CosmosClient({ endpoint, key });

const databaseId = "userDB";
const containerId = "questions";

const database = client.database(databaseId);
const container = database.container(containerId);
module.exports = async function (context, req) {
  let responseData = "";
  let statCode = 200;
  if (req.method == "GET") {
    try {

      let querySpec = {
        query: `SELECT * from questions q ${req.query.index != undefined? `WHERE q.index =${req.query.index}` : ''}`,
      };
      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
      responseData = items;

    } catch (error) {
      statCode = 500;
    }
  } else {
    let question = {
      index: req.body.index,
      question: req.body.q,
      positive_followup: req.body.ap,
      negative_followup: req.body.an,
    };
    try {
      const { resource: createItem } = await container.items.create(question);

      responseData = {
        message: `Question added  ${question.index}`,
      };
      statCode = 201;
    } catch (error) {
      responseData = {
        message: error.message,
      };
      statCode = 500;
    }
  }
  context.res = {
    status: statCode,
    body: responseData,
  };
};
