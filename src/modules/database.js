const mongoose = require('mongoose');

const servidor = 'localhost';
const database = 'stackoverflow';

class Database {
    constructor() {
        this._connect()
    }
    
    _connect() {
        mongoose.connect(`mongodb://${servidor}/${database}`)
            .then(() => {
                console.log('Database connection successful')
            })
            .catch(err => {
                console.error('Database connection error')
            })
    }
}

module.exports = new Database()