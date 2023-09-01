// https://learn.mongodb.com/learn/course/mongodb-crud-operations-in-nodejs/lesson-5-deleting-documents-in-nodejs-applications/practice/completed?client=customer&page=2
// CONNECTING APP TO A MONGO CLIENT INSTANCE
const { MongoClient, ObjectId } = require('mongodb');
const uri = require('./atlas_uri');
require('dotenv').config();

const client = new MongoClient(uri);

// collections
const accounts = client.db('bank').collection('accounts');
const transfers = client.db('bank').collection('transfers');

// accounts information
const account_id_sender = 'MDB001';
const account_id_receiver = 'MDB003';
const transaction_amount = 100;

// start client session

const session = client.startSession();

// sender info
const sender = { account_id: account_id_sender };
const senderCurrentBalance = { $inc: { balance: -transaction_amount } };

// receiver info
const receiver = { account_id: account_id_receiver };
const receiverCurrentBalance = { $inc: { balance: transaction_amount } };

// use  withTransaction to start a transaction, execute the callback, and commit the transaction
// the callback for withTransction must be async/await.
// Note: Each individual operation must be awaited and have the session passed in as an argument
const main = async () => {
  try {
    const transactionResult = await session.withTransaction(async () => {
      // update sender's balance
      const updateSenderBalance = await accounts.updateOne(
        sender,
        senderCurrentBalance,
        { session }
      );
      console.log(
        `${updateSenderBalance.matchedCount} document(s) matched the filter, updated sender's balance`
      );

      // update receiver's balance
      const updateReceiverBalance = await accounts.updateOne(
        receiver,
        receiverCurrentBalance,
        { session }
      );
      console.log(
        `${updateReceiverBalance.matchedCount} document(s) matched the filter, updated sender's balance`
      );

      // insert to transfer document
      const transfer = {
        transfer_id: 'TRANS001',
        amount: 100,
        from_account_id: account_id_sender,
        to_account_id: account_id_receiver,
      };
      const insertTransferResults = await transfers.insertOne(transfer);
      console.log(
        `Successfully inserted ${insertTransferResults.insertedId} into transfers collection`
      );

      // update the transfers_complete of the sender
      const updateSenderTransferResult = await accounts.updateOne(
        sender,
        { $push: { transfer_complete: transfer.transfer_id } },
        { session }
      );
      console.log(
        `Successfully updated ${updateSenderTransferResult.matchedCount} sender's transfer_complete`
      );

      // update the transfers_complete of the receiver
      const updateReceiverTransferResult = await accounts.updateOne(
        receiver,
        { $push: { transfer_complete: transfer.transfer_id } },
        { session }
      );
      console.log(
        `Successfully updated ${updateReceiverTransferResult.matchedCount} receiver's transfer_complete`
      );
    });
    console.log('commiting transaction');
    // if the callback for witTransaction retturns successfully without throwing an error, the transaction will be committed
    transactionResult
      ? console.log('the reservation was successfully created')
      : console.log('the transaction was intentionally aborted');
  } catch (err) {
    console.log(`transaction aborted: ${err}`);
    process.exit(1);
  } finally {
    // release or close an transaction after any resources have been used.
    await session.endSession();
    await client.close();
  }
};

main();
