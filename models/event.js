module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define("event", {
    event_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
    },
    allDay: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    end: {
      type: Sequelize.STRING,
    },
    id: {
      type: Sequelize.STRING,
    },
    start: {
      type: Sequelize.STRING,
    },
    textColor: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
  });

  return Event;
};


