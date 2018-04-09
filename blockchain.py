import hashlib
import json
from time import time
from uuid import uuid4
from flask import Flask, jsonify, request

class Blockchain(object):
    def __init__(self):
        self.chain = []
        self.current_transactions = []

        #head block
        self.new_block(previous_hash = 1, proof = 10)

    def new_block(self,proof,previous_hash = None):
        # Creates a new Block and adds it to the chain
        block = {
            'index' : len(self.chain) + 1,
            'timestamp' : time(),
            'transactions' : self.current_transactions,
            'proof' : proof,
            'previous_hash' : previous_hash or self.hash(self.chain[-1])
        }
        self.current_transactions = []
        self.chain.append(block)
        return block

    def new_transaction(self,listener, artist,cost):
        '''Adds a new transaction to the list of transactions
            artist : map of artists with weightage as the value and artist as key.
            listener : string
            cost : real number
        '''
        self.current_transactions.append({
            'listener' : listener,
            'artist' : artist,
            'cost' : cost
        })
        return self.last_block['index'] + 1

    @staticmethod
    def is_valid(last_proof,proof,last_hash):
        string = '{0}{1}{2}'.format(last_proof,proof,last_hash).encode()
        hash = hashlib.sha256(string).hexdigest()
        return hash[:2] == "00"

    def proof_of_work(self,last_block):
        proof = 0
        last_proof = last_block['proof']
        last_hash = self.hash(last_block)
        while not is_valid(last_proof,proof,last_hash):
            proof += 1
        return proof

    @staticmethod
    def hash(block):
        '''Create SHA-256 hash of the given block'''
        block_string = json.dumps(block,sort_keys = True).encode()
        return hashlib.sha256(block_string).hexdigest()

    @property
    def last_block(self):
        return self.chain[-1]

app = Flask(__name__)
node_id = str(uuid4()).replace('-','')
blockchain = Blockchain()

'''@app.route('/mine', methods=['GET'])
def mine():
last_proof = blockchain.last_block()['proof']
proof = blockchain.proof_of_work(last_proof)

blockchain.new_transaction(
    listener = "0",
    artist = node_identifier,
    cost = 1
)

# Forge the new Block by adding it to the chain
previous_hash = blockchain.hash(last_block)
block = blockchain.new_block(proof, previous_hash)

response = {
    'message': "New Block Forged",
    'index': block['index'],
    'transactions': block['transactions'],
    'proof': block['proof'],
    'previous_hash': block['previous_hash'],
}
return jsonify(response), 200'''

@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    values = request.get_json()
    required = ['listener', 'artist','cost']
    if not all(k in values for k in required):
        return 'Missing values' , 400
    listener = values['listener']
    artist = values['artist']
    cost = values['cost']
    idx = blockchain.new_transaction(listener,artist,cost)
    #response = {'message': 'Transaction will be added to Block {0}'.format(idx)}
    #send equivalent coin to artist-

    last_block = blockchain.last_block
    proof = blockchain.proof_of_work(last_block)

    blockchain.new_transaction(
        listener = listener,
        artist = artist,
        cost = cost
    )

    # Forge the new Block by adding it to the chain
    previous_hash = blockchain.hash(last_block)
    block = blockchain.new_block(proof, previous_hash)

    response = {
        'message': "New Block Forged",
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash'],
    }
    return jsonify(response), 200

@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain),
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)
