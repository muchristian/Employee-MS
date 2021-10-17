'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('employees', {
      id: {
        type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nationalId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false
      },
      isSuspended: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'INACTIVE'],
        defaultValue: 'INACTIVE'
      },
      position: {
        type: Sequelize.ENUM,
        values: ['DEVELOPER', 'DESIGNER', 'TESTER', 'DEVOPS'],
        allowNull: false
      },
      CreateDate: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('employees');
  }
};