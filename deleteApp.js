// https://learn.mongodb.com/learn/course/mongodb-crud-operations-in-nodejs/lesson-5-deleting-documents-in-nodejs-applications/practice/completed?client=customer&page=2
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

// single document to delete
const documentToDelete = { _id: new ObjectId('64ec0e1a7e841c84b77369db') };
// specify the params for documents deletion
const documentsToDelete = { balance: { $lt: 100000 } };

const main = async () => {
  try {
    await connectToDatabase();
    const deleteManyResult = await accountsCollection.deleteMany(
      documentsToDelete
    );
    deleteManyResult.deletedCount > 0
      ? console.log(`deleted ${deleteManyResult.deletedCount} documents`)
      : console.log('no documents deleted');
    const deleteOneResult = await accountsCollection.deleteOne(
      documentToDelete
    );
    deleteOneResult.deletedCount === 1
      ? console.log(`deleted one document`)
      : console.log('no document deleted');
  } catch (err) {
    console.log(`error connecting to database ${err}`);
  } finally {
    await client.close();
  }
};

main();
