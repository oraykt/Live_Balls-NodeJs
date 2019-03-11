app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    const connectionOptions = {
        reconnectionAttempts: 3,
        reconnectionDelay: 500
    };

    indexFactory.connectSocket('http://localhost:3001', connectionOptions).then((socket) => {
        console.log('Baglanti gerceklesti, ', socket);
    }).catch((err) => {
        console.log(err);
    });
}]);