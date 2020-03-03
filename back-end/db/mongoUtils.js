"use strict";

const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
const ObjectID = require("mongodb").ObjectID;
dotenv.config();

//Mateo León: Sería bueno permitir variables de entorno locales por si se quiere probar localmente el proyecto, ya que en este momento no corre localmente
const mongoUtils = () => {
  var mu = {};
  let dbHostName = process.env.dbHostName || "";
  let dbName = process.env.dbName || "";
  let dbUser = process.env.dbUser || "";
  let dbPassword = process.env.dbPassword || "";

  mu.connect = () => {
    //Mateo Léon: Sería bueno colocar una variable de entorno por defecto para correr local
    //mongodb+srv://admin:admin@nfl-db-jh1co.mongodb.net/test?retryWrites=true&w=majority
    const url = `mongodb+srv://${dbUser}:${dbPassword}@${dbHostName}?retryWrites=true&w=majority`;
      //Mateo Leon: Eliminar o comentar console.log

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
      //Mateo Leon: Eliminar o comentar console.log
        client.close();
      });
  };

  mu.findOneByID = (client, id) => {
    const players = client.db(dbName).collection("players");

    // when searching by id we need to create an ObjectID
    return players.findOne({ _id: new ObjectID(id) }).finally(() => {
      //Mateo Leon: Eliminar o comentar console.log
      client.close();
    });
  };

  mu.getPlayers2 = client => {
    const players = client.db(dbName).collection("players");

    console.log("players", players);
    return players
      .find({})
      .limit(5)
      .toArray()
      .finally(() => {
            //Mateo Leon: Eliminar o comentar console.log
        client.close();
      });
  };

  mu.insertUsers = (client, users) => {
    const playersHandler = client.db(dbName).collection("users");
    playersHandler.insert(users).finally(() => {
      //Mateo Leon: Eliminar o comentar console.log
      client.close();
    });
  };

  mu.insertPlayers = (client, players) => {
    const playersHandler = client.db(dbName).collection("players");
    playersHandler.insert(players).finally(() => {
      //Mateo Leon: Eliminar o comentar console.log
      client.close();
    });
  };

  mu.getUsers = (client, query) => {
    const UsersCollection = client.db(dbName).collection("users");
    return UsersCollection.find(query)
      .toArray()
      .finally(() => {
      //Mateo Leon: Eliminar o comentar console.log
      client.close();
      });
  };

  mu.howManyPlayers = (client, query) => {
    const playersHandler = client.db(dbName).collection("players");
    return playersHandler.countDocuments(query).finally(() => {
      //Mateo Leon: Eliminar o comentar console.log
      client.close();
    });
  };

  mu.insertTemplates = (client, template) => {
    const templates = client.db(dbName).collection("templates");
    return templates.insertOne(template).finally(() => client.close());
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
