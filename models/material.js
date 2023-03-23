module.exports = (sequelize, Sequelize) => {
  const Material = sequelize.define("material", {
    material_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    category: {
      type: Sequelize.STRING,
    },
    company: {
      type: Sequelize.STRING,
    },
    consumable: {
      type: Sequelize.STRING,
    },
    contactdetail: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    individual: {
      type: Sequelize.STRING,
    },
    mquantity: {
      type: Sequelize.STRING,
    },
    purchaseprice: {
      type: Sequelize.INTEGER,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    saleprice: {
      type: Sequelize.INTEGER,
    },
    subcategory: {
      type: Sequelize.STRING,
    },
    subsubcategory: {
      type: Sequelize.STRING,
    },
    tags: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    vatprice: {
      type: Sequelize.STRING,
    },
  });

  return Material;
};


