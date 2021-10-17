'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      position: {
        type: Sequelize.STRING,
        defaultValue: 'MANAGER'
      },
      confirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
