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

// single document to update
const documentToUpdate = { _id: new ObjectId('64ec0e1a7e841c84b77369da') };
// updates for single document
const update = { $inc: { balance: 100 } };

// add new field on the documents
const documentsToUpdate = { account_type: 'checking' };
const documentsUpdate = { $push: { transfers_complete: 'TEST_TRANS001' } };

const main = async () => {
  try {
    await connectToDatabase();
    const updateManyResult = await accountsCollection.updateMany(
      documentsToUpdate,
      documentsUpdate
    );
    updateManyResult.modifiedCount > 0
      ? console.log(`updated ${updateManyResult.modifiedCount} of documents`)
      : console.log('no document updated');
    const updateOneResult = accountsCollection.updateOne(
      documentToUpdate,
      update
    );
    (await updateOneResult).modifiedCount === 1
      ? console.log('updated one document')
      : console.log('no document updated');
  } catch (err) {
    console.log(`error connecting to database ${err}`);
  } finally {
    await client.close();
  }
};

main();
