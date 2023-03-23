module.exports = (sequelize, Sequelize) => {
  const Tutor_contact = sequelize.define("tutor_contact", {
    tutor_contact_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
    },
    tutor: {
      type: Sequelize.STRING,
    },
    schedule: {
      type: Sequelize.STRING,
    },
  });

  return Tutor_contact;
};
