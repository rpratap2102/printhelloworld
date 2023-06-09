const CosmosClient = require("@azure/cosmos").CosmosClient;

const endpoint = "https://printhelloworld.documents.azure.com:443/";
const key =
  "MGBOSWyTn7p6q5VxwWTraan4cevAPeQZWo8FVkIpIu2JD7pwawjyeNdITUGtlesdu8tTyrtEZykjACDbRvfAug==";

const client = new CosmosClient({ endpoint, key });

const databaseId = "userDB";
const containerId = "credentials";

const database = client.database(databaseId);
const container = database.container(containerId);
module.exports = async function (context, req) {
  let responseData = "";
  let statCode = 200;
  context.log(`Username: ${req.query.u}, Password: ${req.query.p}`);
  if (
    req.query.u == undefined ||
    req.query.p == undefined ||
    req.query.p == "" ||
    req.query.u == ""
  ) {
    statCode = 400;
    responseData = { message: `Missing Username and password in query field` };
  } else {
    if (req.method == "GET") {
      try {
        let querySpec = {
          query: `SELECT * from credentials c WHERE c.userName ='${req.query.u}'`,
        };
        const { resources: items } = await container.items
          .query(querySpec)
          .fetchAll();
        if (items.length > 0) {
          let passwordObj = items[0];
          let password = passwordObj.password;
          context.log(password);
          statCode = password == req.query.p ? 200 : 401;
        } else statCode = 401;
      } catch (error) {
        statCode;
      }
    } else {
      let user = {
        userName: req.query.u,
        password: req.query.p,
      };
      try {
        const { resource: createItem } = await container.items.create(user);

        responseData = {
          message: `User created with username ${user.userName}`,
        };
        statCode = 201;
      } catch (error) {
        if (error.body?.code == "Conflict") {
          responseData = {
            message: `User Already Exist with username ${user.userName}`,
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
  }
  context.res = {
    status: statCode,
    body: responseData,
  };
};
