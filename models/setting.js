module.exports = (sequelize, Sequelize) => {
  const Setting = sequelize.define("setting", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    emailScan: {
      type: Sequelize.DATE,
    },
  })
  return Setting;
};

