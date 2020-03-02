"use strict";

const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
const ObjectID = require("mongodb").ObjectID;
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

  mu.getPlayers = (client, query, page) => {
    const playersHandler = client.db(dbName).collection("players");
    return playersHandler
      .find(query)
      .skip(20 * (page - 1))
      .limit(20)
      .toArray()
      .finally(() => {
        console.log("cerrando cliente");
        client.close();
      });
  };

  mu.findOneByID = (client, id) => {
    const players = client.db(dbName).collection("players");

    // when searching by id we need to create an ObjectID
    return players.findOne({ _id: new ObjectID(id) }).finally(() => {
      console.log("cerrando cliente");
      client.close();
    });
  };

  mu.getPlayers2 = (client, query) => {
    const players = client.db(dbName).collection("players");

    return players
      .find(query)
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

  mu.getUsers = (client, query) => {
    const UsersCollection = client.db(dbName).collection("users");
    return UsersCollection.find(query)
      .toArray()
      .finally(() => {
        console.log("cerrando cliente");
        client.close();
      });
  };

  mu.howManyPlayers = (client, query) => {
    const playersHandler = client.db(dbName).collection("players");
    return playersHandler.countDocuments(query).finally(() => {
      console.log("cerrando cliente");
      client.close();
    });
  };
  return mu;
};

// const mu = mongoUtils();
// console.log("mu", mu);
// mu.connect()
//   .catch(err => {
//     throw err;
//   })
//   .then(client => {
//     return mu.getPlayers(client);
//   })
//   .then(players => {
//     console.log("players", players.length);
//   });

// const user = {
//   name: 'juan',
//   templates: [
//     {
//       date: Date.now(),
//       name: 'pa ganar',
//       positions: {
//         qb: [],
//         rb: [],
//         wr: [],
//         te: [],
//         'w/r': [],
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
//     .collection('users')
//     .insertOne(user, (err, resp) => {
//       if (err) throw err;
//       console.log('respuesta', resp);
//       client.close();
//     });
// });

module.exports = mongoUtils;
