// CONNECTING APP TO A MONGO CLIENT INSTANCE
const { MongoClient } = require('mongodb');
const uri = require('./atlas_uri');

const client = new MongoClient(uri);
const dbName = 'bank';
const collectionName = 'accounts';

// query to collection
const accountsCollection = client.db(dbName).collection(collectionName);

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`connected to the database ${dbName} successfully`);
  } catch (err) {
    console.log(`error connecting to database ${err}`);
  }
};

const sampleAccount = {
  account_holder: 'Linus Torvalds',
  account_id: 'MDB001',
  account_type: 'checking',
  balance: 1234567,
  last_updated: new Date(),
};

const sampleAccounts = [
  {
    account_holder: 'Sarah Jane',
    account_id: 'MDB006',
    account_type: 'savings',
    balance: 24689,
  },
  {
    account_holder: 'Spongebob',
    account_id: 'MDB007',
    account_type: 'savings',
    balance: 123344,
  },
];

const main = async () => {
  try {
    await connectToDatabase();
    const insertOne = await accountsCollection.insertOne(sampleAccount);
    // console.log(`inserted id: ${result.insertedId}`);
    const result = await accountsCollection.insertMany(sampleAccounts);
    Object.values(result.insertedIds).forEach((id) => console.log(id));
  } catch (err) {
    console.log(`error connecting to database ${err}`);
  } finally {
    await client.close();
  }
};

main();
