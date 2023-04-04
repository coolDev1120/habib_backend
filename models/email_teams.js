module.exports = (sequelize, Sequelize) => {
  const Email_teams = sequelize.define("email_teams", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.INTEGER,
    },
  })
  return Email_teams;
};

