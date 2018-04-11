const Blockchain = require('./blockchain')
const { validationResult } = require('express-validator/check')

class BlockMusic {
  constructor () {
    this.blockchain = new Blockchain()
    this.getChain = this.getChain.bind(this)
    this.mine = this.mine.bind(this)
    this.newTransaction = this.newTransaction.bind(this)
  }
  getChain (req, res, next) {
    req.responseValue = {
      message: 'Get Chain',
      chain: this.blockchain.chain
    }
    return next()
  }

  mine (req, res, next) {
    const lastBlock = this.blockchain.lastBlock()
    const lastProof = lastBlock.proof
    const proof = this.blockchain.proofOfWork(lastProof)

    // Create a new transaction with from 0 (this node) to our node (NODE_NAME) of 1 BlockMusic
    this.blockchain.newTransaction('0', process.env.NODE_NAME, 1)

    // Forge the new Block by adding it to the chain
    const previousHash = this.blockchain.hash(lastProof)
    const newBlock = this.blockchain.newBlock(proof, previousHash)

    const responseValue = Object.assign({
      message: 'New Block mined'
    }, newBlock)
    req.responseValue = responseValue
    return next()
  }

  newTransaction (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }
    const trans = req.body
    const recipients = trans['recipients'].split(',');
    var ret = {};

    for(var i =0 ;i<recipients.length;i++)
    {
        var recipient = recipients[i].replace(/^\s*/, "").replace(/\s*$/, "");
        var amount = 0;
        var j = recipient.length - 2;
        var t=1;
        while(j >=0 && recipient[j]!='(')
        {
            amount += parseInt(recipient[j]) * t;
            t = t*10;
            --j;
        }
        recipient = recipient.slice(0,j);
        //console.log(amount + ' ' + recipient);
        const index = this.blockchain.newTransaction(trans['sender'], recipient, (amount/100) * trans['cost']);
        var tp = '' + i;
        ret['message' + tp] = `Transaction will be added to Block ${i}`;
    }
    //req.responseValue = ret;
    const lastBlock = this.blockchain.lastBlock()
    const lastProof = lastBlock.proof
    const proof = this.blockchain.proofOfWork(lastProof)

    // Create a new transaction with from 0 (this node) to our node (NODE_NAME) of 1 BlockMusic
    this.blockchain.newTransaction('0', process.env.NODE_NAME, 1)

    // Forge the new Block by adding it to the chain
    const previousHash = this.blockchain.hash(lastProof)
    const newBlock = this.blockchain.newBlock(proof, previousHash)

    const responseValue = Object.assign({
      message: 'New Block mined'
    }, newBlock)
    req.responseValue = responseValue
    res.redirect('/');
    //return next()
  }
}

module.exports = new BlockMusic()
