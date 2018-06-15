class User {
    constructor(id, login) {
        this.id = id;
        this.login = login;
    }
}

exports.User = function(id, login) {
    return new User(id, login);
}
