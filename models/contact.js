module.exports = (sequelize, Sequelize) => {
  const Contact = sequelize.define("contact", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    about: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    automated_email: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.INTEGER,
    },
    city: {
      type: Sequelize.STRING,
    },
    postcode: {
      type: Sequelize.STRING,
    },
    company: {
      type: Sequelize.INTEGER,
    },
    country_state: {
      type: Sequelize.STRING,
    },
    customer_name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    facebook_id: {
      type: Sequelize.STRING,
    },
    house: {
      type: Sequelize.STRING,
    },
    landline: {
      type: Sequelize.STRING,
    },
    linkedin_id: {
      type: Sequelize.STRING,
    },
    other_contact: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    skype_name: {
      type: Sequelize.STRING,
    },
    subcategory: {
      type: Sequelize.INTEGER,
    },
    twitter_username: {
      type: Sequelize.STRING,
    },
    website: {
      type: Sequelize.STRING,
    },
    where_find: {
      type: Sequelize.STRING,
    },
  });

  return Contact;
};


