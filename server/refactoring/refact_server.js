const express = require('express')
const server = express()
const server_port = 8080

const blockchain = require('./blockchain')

blockchain.makeReceipt('0x424a3aA3407FC509a58297Fe774D0AA48fbF81b7', 'place1', 'date1', 'detail1', 1000)
