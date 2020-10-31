const mysql = require('@yahapi/mysql');
const { EventEmitter } = require('events');
const Util = require('./Util')
const Options = Util.OPTIONS

class MySQL extends EventEmitter {
    /**
     * Quick.eco MySQL Manager
     * @param {object} options Options
     * @param {string} [options.table] Table name
     * @param {string} [options.database] Database name
     * @param {string} [options.user] MySQL Username
     * @param {string} [options.password] MySQL password
     * @param {string} [options.host] MySQL host
     * @param {number} [options.port] MySQL port
     * @param {object} [options.additionalOptions] Additional Options to pass into MySQL 
     */
    constructor(options = Options) {
        super();
        /**
         * MySQL Connection Info
         * @type {object} connection
         */
        this.connection = {
            user: options.user,
            database: options.database,
            password: options.password,
            host: options.host,
            port: options.port
        };

        /**
         * Additional MySQL options
         */
        this.additionalOptions = options.additionalOptions

        /**
         * Whether the db has been connected
         * @type {boolean} connected Connected
         * @default false
         */
        this.connected = false;

        /**
         * Table name
         * @default money
         */
        this.table = options.table || 'money';

        /**
         * MySQL Connection
         * @type {mysql} mysql MySQL Connection
         */
        this.mysql;

        this.initDatabase();
    }

    /**
     * Connects to mysql database
     * @returns {Promise<any>}
     */
    initDatabase() {
        return new Promise(async (resolve, reject) => {
            if (!this.mysql) {
                try {
                    mysql.connect(Object.assign(this.connection, this.additionalOptions));

                    this.emit('debug', 'connecting...');

                    this.mysql = mysql;
                    this.connected = true;

                    const { user, database, host, port} = this.connection

                    this.emit('debug', await Util.CONNECTED_MESSAGE(user, database, host, port));

                    this._createTable()

                    return resolve(this.mysql)

                } catch (e) {
                    this.emit('debug', 'Failed to connect');
                    return reject(e);
                }
            }
        })
    }

    /**
     * Creates the table
     * @private
     * @ignore
     */
    _createTable () {
        return mysql.query(`CREATE TABLE IF NOT EXISTS ${this.table} (ID VARCHAR(255) UNIQUE NOT NULL, data INT NOT NULL)`);
        
    }

    /**
     * Writes data
     * @param {object} rdata Data
     * @returns {Promise<any>}
     */
    write (rdata) {
        return new Promise((resolve, reject) => {
            if(this.connected === false) return reject(new Error('Not connected to MySQL database'));

            const { ID, data } = rdata;

            if (!ID || typeof ID !== 'string') return reject(new Error('Invalid ID'));

            this._createTable();

            mysql.query(`INSERT INTO \`${this.table}\` (\`ID\`, \`data\`) VALUES (?, ?);`, [ID, data],  (err, rows) => {
                if(err) {
                    this.update(rdata)
                    .then(resolve)
                    .catch(reject);
                }

                resolve(rows);
            })

        })
    }

    /**
     * Reads data
     * @param {string} id ID
     * @returns {Promise<any>}
     */
    read(id) {
        return new Promise((resolve, reject) => {
            if(this.connected === false) return reject(new Error('Not connected to MySQL database'));
            if (!id || typeof id !== 'string') return reject(new Error('Invalid ID'));

            this._createTable();

            mysql.query(`SELECT * FROM \`${this.table}\` WHERE \`ID\` = ?`, [id], (err, res) => {
                if(err) return reject(err);
                resolve(res[0])
            })
            
        })
    }

    /**
     * Updates data
     * @param {object} rdata Data
     * @returns {Promise<any>}
     */
    update(rdata = {}) {
        return new Promise((resolve, reject) => {
            if(this.connected === false) return reject(new Error('Not connected to MySQL database'));

            const { ID, data } = rdata;

            if (!ID || typeof ID !== 'string') return reject(new Error('Invalid ID'));

            this._createTable();

            mysql.query(`UPDATE \`${this.table}\` SET \`data\` = ? WHERE \`ID\` = ?`, [data, ID],  (err, rows) => {
                if(err) return reject(err);

                resolve(rows);
            })

        })
    }

    /**
     * Deletes a user from the database
     * @param {string} user User 
     * @returns {Promise<boolean>}
     */
    delete (user) {
        return new Promise ((resolve, reject) => {
            if(this.connected === false) return reject(new Error('Not connected to MySQL database'));
            if (!user || typeof user !== 'string') return reject(new Error('Invalid ID'));

            this._createTable();

            mysql.query(`DELETE FROM \`${this.table}\` WHERE ID = ?`, [user], (err, res) => {
                if(err) return reject(err);

                resolve(true);
            })
        })
    }

    /**
     * Returns all data
     * @returns {Promise<any>}
     */
    readAll () {
        return new Promise((resolve, reject) => {
            if(this.connected === false) return reject(new Error('Not connected to MySQL database'));

            this._createTable();

            mysql.query(`SELECT * FROM \`${this.table}\``, [], (err, res) => {
                if(err) return reject(err);

                resolve(res);
            })
        })
    }

    /**
     * Deletes all data
     * @returns {Promise<any>}
     */
    deleteAll() {
        return new Promise((resolve, reject) => {
            if(this.connected === false) return reject(new Error('Not connected to MySQL database'));

            mysql.query(`DROP TABLE \`${this.table}\``, [], (err, res) => {
                if(err) return reject(err);

                resolve(res);
            })
        })
    }
};

module.exports = MySQL;