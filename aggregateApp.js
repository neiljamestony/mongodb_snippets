const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = require('./atlas_uri');
const client = new MongoClient(uri);

// collection
const accounts = client.db('bank').collection('accounts');

const withMatchAndGroupPipeline = [
  // match the accounts with a balance greater than 100000
  {
    $match: { balance: { $gt: 10000 } },
  },
  // calculate the avg balance and total balance
  {
    $group: {
      _id: '$account_type',
      total_balance: { $sum: '$balance' },
      avg_balance: { $avg: '$balance' },
    },
  },
];

const withSortAndProjPipeline = [
  // filter document using $match
  {
    $match: { account_type: 'checking', balance: { $gte: 100000 } },
  },
  // sort the data from document in descending order
  { $sort: { balance: -1 } },
  // $project - specify which field you want to return with one computed field (account_type, balance, gbp)
  {
    $project: {
      _id: 0,
      account_id: 1,
      account_type: 1,
      balance: 1,
      //
      gbp_balance: { $divide: ['$balance', 1.3] },
    },
  },
];

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
    const withMatchAndGroupPipelineResult = accounts.aggregate(
      withMatchAndGroupPipeline
    );
    const withSortAndProjPipelineResult = accounts.aggregate(
      withSortAndProjPipeline
    );
    for await (doc of withSortAndProjPipelineResult) {
      console.log(doc);
    }
    for await (doc1 of withMatchAndGroupPipelineResult) {
      console.log(doc1);
    }
  } catch (err) {
    console.log(`encounted an error: ${err}`);
  } finally {
    await client.close();
  }
};

main();

// $match - allows you to filter the document

// $project - allows you to specify what kind of fields you to see in the result

// $group - separates documents into groups according to a group key
// the output is one document for each unique key

// $sort - sorts all input documents and returns them to the pipeline in sorted order
// sort ascending = 1, sort descending = -1

// aggregation framework - is a language for filtering, sorting, organizing, and analyzing data

// const pipeline = [<stage1>, <stage2>, <stage3>]
// operator (accumulators) = $sum, $avg

// $bucket - categorizes incoming documents into groups, called buckets, based on a specified
// expression and bucket boundaries and outputs a document per each bucket.

// $unwind - used to deconstruct an array field in a document and create separate output documents for each item in the array.

// $gte = greater than or equal / $lte = less than or equal
