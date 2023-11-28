const users = []

function getUsers() {
    return users;
}

function addUser(user) {
    users.push(user)
}

function removeUser(index) {
    users.splice(index, 1)
}

module.exports= {
    getUsers,
    addUser,
    removeUser
}