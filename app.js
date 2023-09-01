// CONNECTING APP TO A MONGO CLIENT INSTANCE
const { MongoClient } = require('mongodb');
const uri = require('./atlas_uri');

const client = new MongoClient(uri);
const dbName = 'bank';

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`connected to the database ${dbName} successfully`);
  } catch (err) {
    console.log(`error connecting to database ${err}`);
  }
};

const main = async () => {
  try {
    await connectToDatabase();
    const databaseList = await client.db().admin().listDatabases();
    databaseList.databases.forEach((db) => console.log(` - ${db.name}`));
  } catch (err) {
    console.log(`error connecting to database ${err}`);
  } finally {
    await client.close();
  }
};

main();
