class Product {
  constructor(id, name, description, price, image, owner) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.image = image;
    this.owner = owner; // user id or email
    this.createdAt = new Date().toISOString();
  }
}

module.exports = { Product };
