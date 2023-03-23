module.exports = (sequelize, Sequelize) => {
  const Subcategory = sequelize.define("subcategory", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    subcategory_name: {
      type: Sequelize.STRING,
    },
  });

  return Subcategory;
};


