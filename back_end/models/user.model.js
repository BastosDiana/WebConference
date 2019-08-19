//contain the structure of the user table
module.exports = function(sequelize, Sequelize) {
  const User = sequelize.define('user', {
    id: {
      autoincrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    nome: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    apelido: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    username: {
      type: Sequelize.TEXT
    },
    tipo: {
      type: Sequelize.TEXT
    },
    email: {
      type: Sequelize.STRING,
      validate: {isEmail: true}
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sobre: {
      type: Sequelize.TEXT
    },
    lastLogin: {
      type: Sequelize.DATE
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  });
  return User;
}
