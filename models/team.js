module.exports = (sequelize, Sequelize) => {
  const Team = sequelize.define("team", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    team_name: {
      type: Sequelize.STRING,
    },
    color: {
      type: Sequelize.STRING,
    },
  });

  return Team;
};


