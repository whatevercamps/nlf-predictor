"use strict";

const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectID;
dotenv.config();

const mongoUtils = () => {
  var mu = {};
  let dbHostName = process.env.dbHostName || "";
  let dbName = process.env.dbName || "";
  let dbUser = process.env.dbUser || "";
  let dbPassword = process.env.dbPassword || "";

  mu.connect = () => {
    //mongodb+srv://admin:admin@nfl-db-jh1co.mongodb.net/test?retryWrites=true&w=majority
    const url = `mongodb+srv://${dbUser}:${dbPassword}@${dbHostName}?retryWrites=true&w=majority`;
    console.log(url);

    const client = new MongoClient(url, { useNewUrlParser: true });
    return client.connect();
  };

  mu.getPlayers = client => {
    const players = client.db(dbName).collection("players");

    return players
      .find({})
      .toArray()
      .finally(() => {
        console.log("cerrando cliente");
        client.close();
      });
  };

  mu.insertPlayers = (client, players) => {
    const playersHandler = client.db(dbName).collection("players");
    playersHandler.insert(players).finally(() => {
      console.log("Players inserted");
      client.close();
    });
  };

  mu.getUser = client => {
    const UsersCollection = client.db(dbName).collection("users");
    return UsersCollection.find({
      _id: ObjectId("5e550faaba0ba27a5ba85ae6")
    })
      .toArray()
      .finally(() => {
        console.log("cerrando cliente");
        client.close();
      });
  };

  mu.getUsers = client => {
    const users = client.db(dbName).collection("users");

    return users.find({}).toArray();
  };

  return mu;
};

const mu = mongoUtils();
mu.connect()
  .catch(err => {
    throw err;
  })
  .then(client => {
    return mu.getPlayers(client);
  })
  .then(players => {
    console.log("players", players.length);
  });

// const user = {
//   name: "juan",
//   templates: [
//     {
//       date: Date.now(),
//       name: "pa ganar",
//       positions: {
//         qb: [],
//         rb: [],
//         wr: [],
//         te: [],
//         "w/r": [],
//         k: [],
//         def: [],
//         bn: []
//       }
//     }
//   ]
// };

// mu.connect().then(client => {
//   client
//     .db(process.env.dbName)
//     .collection("users")
//     .insertOne(user, (err, resp) => {
//       if (err) throw err;
//       console.log("respuesta", resp);
//       client.close();
//     });
// });

module.exports = mongoUtils;
