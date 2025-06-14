// User structure
class User {
    constructor (id, name, email, phone, nationalID, password, role = 'user'){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.nationalID = nationalID;
        this.password = password; // Later we will hash this for security
        this.role = role;
    }
}

module.exports = { User };