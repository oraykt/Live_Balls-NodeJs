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

    function scrollTop() {
        setTimeout(() => {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
        }, 150);
    }

    function showBuuble(id, message) {
        $('#' + id).find('.message').show().html(message);
        setTimeout(() => {
            $('#' + id).find('.message').hide();
        }, 2000);
    }

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
                    $scope.players[user.id] = user
                    $scope.$apply();
                });

                socket.on('disUser', (user) => {
                    const messageData = {
                        type: {
                            code: 0,    // server or user message
                            message: 0  // disconnect message
                        },
                        username: user.username
                    };
                    $scope.messages.push(messageData);
                    delete $scope.players[user.id];
                    $scope.$apply();
                });

                socket.on('newMessage', (message) => {
                    $scope.messages.push(message);
                    $scope.$apply();
                    showBuuble(message.socketId, message.text)
                    scrollTop();
                });

                let animate = false;
                $scope.onClickPlayer = ($event) => {
                    // $event.offsetX , $event.offsetY
                    if (!animate) {
                        let x = $event.offsetX;
                        let y = $event.offsetY;

                        socket.emit('animateLive', { x, y });

                        animate = true;
                        $('#' + socket.id).animate({ 'left': x, 'top': y }, () => {
                            animate = false;
                        });
                    }
                };
                socket.on('animated', (data) => {
                    $('#' + data.socketId).animate({ 'left': data.x, 'top': data.y }, () => {
                        animate = false;
                    });
                });

                $scope.newMessage = () => {
                    const messageData = {
                        type: {
                            code: 1,    // server or user message
                        },
                        username: username,
                        text: $scope.message
                    };
                    $scope.messages.push(messageData);
                    $scope.message = "";
                    socket.emit('newMessage', messageData);
                    showBuuble(socket.id, messageData.text);
                    scrollTop();
                }
            }).catch((err) => {
                console.log(err);
            });
    };

}]);