// CONNECTING APP TO A MONGO CLIENT INSTANCE
const { MongoClient, ObjectId } = require('mongodb');
const uri = require('./atlas_uri');
require('dotenv').config();

const client = new MongoClient(uri);
const dbName = 'bank';
const collectionName = 'accounts';

const accountsCollection = client.db(dbName).collection(collectionName);

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`connected to the database ${dbName} successfully`);
  } catch (err) {
    console.log(`error connecting to database ${err}`);
  }
};
// multiple documents to find
const documentsToFind = { balance: { $gt: 4700 } };
// single document to find
const documentToFind = { _id: new ObjectId('64ec0e1a7e841c84b77369da') };

const main = async () => {
  try {
    await connectToDatabase();
    const result = await accountsCollection.findOne(documentToFind);
    const docCount = accountsCollection.countDocuments(documentsToFind);
    await result.forEach((doc) => console.log(doc));
    console.log(`found ${await docCount} documents`);
    console.log(result);
  } catch (err) {
    console.log(`error connecting to database ${err}`);
  } finally {
    await client.close();
  }
};

main();
