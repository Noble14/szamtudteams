const { response } = require('express')
const auth = require('./graph.js')
const us = require('./users.js')

function createUser(id, token, tid, name, mail, room, userId)  {
    return {
        'id': id,
        'token': token,
        'tid': tid,
        'name': name,
        'mail': mail,
        'room': room,
        'user_id': userId
    }

}
module.exports.start = function (io ) {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token
        var tid = socket.handshake.auth.tid
        var roomForSocket = socket.handshake.headers.room
        auth.getProfile(tid, token).then(x => {
            var user = createUser(socket.id, token, tid, x.displayName, x.mail, roomForSocket, x.id)
            us.addUser(user)
            next();
        }, err => {
            console.log("hiba")
            console.log(err)
            next(new Error())
        })
        
    })

    io.on('connection', (socket) => {
        var room = socket.handshake.headers.room
        console.log(`New user connected ${socket.id} in room: ${room}`);
        socket.join(room)
        var userNames = us
            .getUsers()
            .filter(x => x.room == room)
            .map(x => x.name)

        io.to(room).emit("new-user", userNames)

        socket.on('start-meeting', meetingData => {
            var tid = meetingData.tid
            var token = meetingData.token
            var attendees = us.getUsers()
                .filter(x => x.room == room)
                .map(x => {
                    return {
                        "upn": x.mail,
                        "identity": {
                            "user": {
                                "id": x.user_id,
                                "tenantId": tid,
                                "displayName": x.name
                            }
                        }
                    }
                })
            const onlineMeeting = {
                subject: meetingData.subject,
                participants: {
                    "attendees": attendees
                }
            }
            console.log(attendees)
            var promise = auth.startMeeting(tid, token, onlineMeeting)
            promise.then(response => {
                var targets = attendees.filter(x => x.upn != socket.email).map(x => x.upn)
                io.to(room).emit("meeting-started", response.joinUrl)
                socket.emit("place-call", targets)
            }).catch(err => {
                console.log(err)
                io.to(room).emit("meeting-failed", "error while getting token")
            })
            


        })

        // Handle user disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected ${socket.id}`);
            const ind = us.getUsers().findIndex(x => x.id == socket.id)
            us.removeUser(ind)
            var userNames = us.getUsers()
                .filter(x => x.room == room)
                .map(x => x.name)
            io.to(room).emit("new-user", userNames)
        });
    });

}