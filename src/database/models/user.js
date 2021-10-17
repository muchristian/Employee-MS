module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    position: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN
    
  }, {
    sequelize,
    modelName: 'user'
  });
  return user;
};
