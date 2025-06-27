"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("ShoppingListItems", "name", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Unnamed Item"
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("ShoppingListItems", "name");
  },
};
