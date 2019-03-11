app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    $scope.init = () => {
        const userName = prompt('Please enter username');

        if (userName)
            initSocket(userName);
        else
            return false;
    };

    function initSocket(userName) {
        const connectionOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 500
        };

        indexFactory.connectSocket('http://localhost:3000', connectionOptions)
            .then((socket) => {
                socket.emit('newUser', {
                    userName
                });
            }).catch((err) => {
                console.log(err);
            });
    };

}]);