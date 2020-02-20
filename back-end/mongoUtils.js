const MongoClient = require('mongodb').MongoClient;
const uri =
  'mongodb+srv://admin:<password>@nfl-db-jh1co.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  if (err) throw err;
  const collection = client.db('test').collection('devices');
  // perform actions on the collection object
  client.close();
});

const mongoUtils = () => {
  var mu = {};

  return mu;
};

module.exports = mongoUtils;
