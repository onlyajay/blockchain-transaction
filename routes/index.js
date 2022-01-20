const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require("fs");
const fsp = require('fs').promises;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("Hello world");
});

async function getBlockHash(height) {
    const response = await axios.get(`https://blockstream.info/api/block-height/${height}`);
    if(response.status === 200){
        return response.data;
    } else {
        return null;
    }
}

async function getTransactionCount(blockHash) {
    const response = await axios.get(`https://blockstream.info/api/block/${blockHash}`);
    if(response.status === 200){
        return response.data.tx_count;
    } else {
        return null;
    }
}

async function getTransactions(height) {
    return new Promise((resolve, reject) => {
        const fileName = `a-${height}.json`;

        fs.readFile(fileName, async function (err, data) {
            if (err) {
                if (err.code === 'ENOENT') {
                    const blockHash = await getBlockHash(height);
                    if (blockHash) {
                        const transactionCount = await getTransactionCount(blockHash);
                        // const pageCount = 2;
                        const pageCount = Math.floor(transactionCount / 25);
                        let data = [];
                        for (let i = 0; i < pageCount; i++) {
                            const index = i * 25;
                            const transactionResponse = await axios.get(`https://blockstream.info/api/block/${blockHash}/txs/${index}`);

                            data = data.concat(transactionResponse.data);
                        }

                        fs.writeFile(fileName, JSON.stringify(data), errr => {
                            // Checking for errors
                            if (errr) {
                                console.log(errr.message);
                                reject(null);
                            }
                            resolve(data);
                        });
                    } else {
                        reject(null);
                    }
                } else {
                    console.log(err.message)
                    reject(null);
                }
            } else {
                resolve(JSON.parse(data.toString()));
            }
        });
    })
}

async function findTransactionCount(transactionList) {
    let result = {};

    function getAncestors (tid, transList) {
        if(typeof transList !== "object"){
            console.log("tid",tid)
            console.log(transList)
        }

        for (const transaction of transList) {
            if (tid) {
                result[tid] = result[tid] + 1;
                if(result[transaction.txid]){
                    result[transaction.txid] = result[transaction.txid] + 1;
                } else {
                    result[transaction.txid] = 0;
                }
                const txn = transactionList.find((item) => item.txid === transaction.txid);
                if((typeof txn === "object") && txn.length >= 0){
                    getAncestors(tid,txn);
                }
            } else {
                result[transaction.txid] = 0;
                getAncestors(transaction.txid,transaction.vin);
            }
        }
    }
    getAncestors(null, transactionList);
    return result;
}

router.get('/get-transaction/:height', async function (req, res, next) {
    try {
        if(!req.params.height){
            return res.status(400).send("Bad request");
        }
        const blockHeight = req.params.height;
        const transactionList = await getTransactions(blockHeight);
        if(transactionList) {
            const result = await findTransactionCount(transactionList);
            // const sortable = Object.fromEntries(
            //     Object.entries(result).sort(([,a],[,b]) => b-a)
            // );

            const sortable = Object.assign(                      // collect all objects into a single obj
                ...Object                                // spread the final array as parameters
                    .entries(result)                     // key a list of key/ value pairs
                    .sort(({ 1: a }, { 1: b }) => b - a) // sort DESC by index 1
                    .slice(0, 10)                         // get first three items of array
                    .map(([k, v]) => ({ [k]: v }))       // map an object with a destructured
            );

            res.send(sortable);
        } else {
            return res.sendStatus(500).send("Something went wrong");
        }
    } catch (e) {
        console.log(e.message);
        throw e;
    }
});

module.exports = router;
