export default {
    swagger: {
        options: {
            info: {
                title: 'API Documentation',
                version: 'v1.0.0',
                contact: {
                    name: 'Subrat kumar gantayat',
                    email: 'subratgantayat@gmail.com'
                }
            },
            grouping: 'tags',
            sortEndpoints: 'ordered',
            securityDefinitions: {
                jwt: {
                    type: 'apiKey',
                    description: 'JWT Token',
                    name: 'X-Atmosphere-Token',
                    in: 'header'
                }
            },
            security: [{ jwt: [] }]
        }
    },
    database: {
        host: '127.0.0.1',
        port: 27017,
        name: 'mosohaya',
        username: 'thitapp',
        password: 'thitapp080'
    },
    databaseOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        serverSelectionTimeoutMS: 10000,
        poolSize: 10,
        socketTimeoutMS: 30000,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        connectTimeoutMS: 120000
    }
};
