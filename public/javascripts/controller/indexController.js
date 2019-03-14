app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    $scope.messages = [];
    $scope.players = {};
    $scope.init = () => {
        const username = prompt('Please enter username');

        if (username)
            initSocket(username);
        else
            return false;
    };

    function initSocket(username) {
        const connectionOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 500
        };

        indexFactory.connectSocket('http://localhost:3000', connectionOptions)
            .then((socket) => {
                socket.emit('newUser', { username });

                socket.on('initPlayer', (player) => {
                    $scope.players = player;
                    $scope.$apply();
                });

                socket.on('newUser', (user) => {
                    const messageData = {
                        type: {
                            code: 0,    // server or user message
                            message: 1  // login  message
                        },
                        username: user.username
                    };
                    $scope.messages.push(messageData);
                    $scope.$apply();
                });

                socket.on('disUser', (user) => {
                    console.log(user);
                    const messageData = {
                        type: {
                            code: 0,    // server or user message
                            message: 0  // disconnect message
                        },
                        username: user.username
                    };
                    $scope.messages.push(messageData);
                    $scope.$apply();
                });
            }).catch((err) => {
                console.log(err);
            });
    };

}]);