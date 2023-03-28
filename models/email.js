module.exports = (sequelize, Sequelize) => {
  const Email = sequelize.define("email", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fromName: {
      type: Sequelize.STRING,
    },
    fromEmail: {
      type: Sequelize.STRING,
    },
    toName: {
      type: Sequelize.STRING,
    },
    toEmail: {
      type: Sequelize.STRING,
    },
    subject: {
      type: Sequelize.STRING,
    },
    isImportant: {
      type: Sequelize.STRING,
    },
    isStarred: {
      type: Sequelize.STRING,
    },
    isUnread: {
      type: Sequelize.STRING,
    },
    labelIds: {
      type: Sequelize.STRING,
    },
    message: {
      type: Sequelize.STRING,
    },
    files: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.INTEGER,
    },
    reply: {
      type: Sequelize.DATE,
    },
  })
  return Email;
};

