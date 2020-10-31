module.exports = class Util {
    static get OPTIONS() {
        return {
            table: 'money',
            database: '',
            user: '',
            password: '',
            host: '',
            port: 3306,
            additionalOptions: {}
        };
    }

    static async CONNECTED_MESSAGE(USER, DATABASE, HOST, PORT) {
        return `Connected to MySQL Database\n____________________________\n\nUser: ${USER}\nDatabase: ${DATABASE}\nHost: ${HOST}\nPort: ${PORT}\n____________________________`
    }
}