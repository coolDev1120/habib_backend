module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
    },
    accountype: {
      type: Sequelize.STRING,
    },
    colourCode: {
      type: Sequelize.STRING,
    },
    staff: {
      type: Sequelize.STRING,
    },
    dateAdded: {
      type: Sequelize.STRING,
    },
    team: {
      type: Sequelize.STRING,
    },
    permissions: {
      type: Sequelize.STRING,
    },
    firstname: {
      type: Sequelize.STRING,
    },
    lastname: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
