module.exports = (sequelize, Sequelize) => {
  const Asset = sequelize.define("asset", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    additional_details: {
      type: Sequelize.STRING,
    },
    assets_name: {
      type: Sequelize.STRING,
    },
    assets_type: {
      type: Sequelize.STRING,
    },
    assets_value: {
      type: Sequelize.STRING,
    },
    assigned_team: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING,
    },
    company: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    purchased_date: {
      type: Sequelize.STRING,
    },
    service_date: {
      type: Sequelize.STRING,
    },
    service_required: {
      type: Sequelize.STRING,
    },
    set_reminders: {
      type: Sequelize.STRING,
    },
    subcategory: {
      type: Sequelize.STRING,
    },
  });

  return Asset;
};


