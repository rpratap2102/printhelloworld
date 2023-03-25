const CosmosClient = require("@azure/cosmos").CosmosClient;

const endpoint = "https://printhelloworld.documents.azure.com:443/";
const key =
  "MGBOSWyTn7p6q5VxwWTraan4cevAPeQZWo8FVkIpIu2JD7pwawjyeNdITUGtlesdu8tTyrtEZykjACDbRvfAug==";

const client = new CosmosClient({ endpoint, key });

const databaseId = "userDB";
const containerId = "progress";

const database = client.database(databaseId);
const container = database.container(containerId);
module.exports = async function (context, req) {
  let responseData = "";
  let statCode = 200;
  let querySpec = {
    query: `SELECT * from credentials c WHERE c.userName ='${req.query.u}'`,
  };
  let exist = false;
  let data = {};
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();
  if (items.length > 0) {
    exist = true;
    data = items[0];
  }
  if (req.method == "GET") {
    try {
      if (exist) {
        responseData = items[0];
      } else statCode = 204;
    } catch (error) {
      statCode = 500;
    }
  } else {
    if (exist) {
      (data.userName = req.query.u),
        (data.q_index = req.body.qi),
        (data.progress = items[0].progress);
    } else {
      data = {
        userName: req.query.u,
        q_index: req.body.qi,
        progress: [],
      };
    }
    data.progress.push({
      question: req.body.qi,
      response: req.body.r,
      emotion: req.body.e,
    });
    try {
      const { resource: createItem } = exist
        ? await container.item(items[0].id).replace(data)
        : await container.items.create(data);
      responseData = {
        message: `Record updated for  ${data.userName}`,
        data: createItem
      };
      statCode = 201;
    } catch (error) {
      if (error.body?.code == "Conflict") {
        responseData = {
          message: `User Already Exist with username ${data.userName}`,
        };
        statCode = 409;
      } else {
        responseData = {
          message: error.message,
        };
        statCode = 500;
      }
    }
  }
  context.res = {
    status: statCode,
    body: responseData,
  };
};
