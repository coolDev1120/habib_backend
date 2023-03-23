module.exports = (sequelize, Sequelize) => {
  const Subsubcategory = sequelize.define("subsubcategory", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sub2category_name: {
      type: Sequelize.STRING,
    },
  });

  return Subsubcategory;
};


