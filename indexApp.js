const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = require('./atlas_uri');
const client = new MongoClient(uri);

// establish database connection

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`connection succeed`);
  } catch (err) {
    console.log(`error connecting to database: ${err}`);
  }
};

const main = async () => {
  try {
    await connectToDatabase();
    //
  } catch (err) {
    console.log(`encounter an error: ${err}`);
  } finally {
    await client.close();
  }
};

main();

// INDEXES - uses to quickly locate and retrieve all documents that match a query

// COMPOUND INDEXES - optimize operations that filter on multiple fields

// mongodb stores indexes in easily accessible blocks of data in a B-tree data structure.

// run a explain() on a query to see if the query was using an index
