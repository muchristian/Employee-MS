module.exports = (sequelize, DataTypes) => {
  const employee = sequelize.define('employee', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    nationalId: DataTypes.STRING,
    code: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    dateOfBirth:  DataTypes.DATE,
    isSuspended: DataTypes.INTEGER,
    status: DataTypes.ENUM(
      'ACTIVE', 'INACTIVE'
      ),
    position: DataTypes.ENUM(
      'DEVELOPER', 'DESIGNER', 'TESTER', 'DEVOPS'
      ),
    CreateDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'employee',
    timestamps: false
  });
  return employee;
};