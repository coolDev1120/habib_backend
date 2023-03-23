module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define("task", {
    task_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
    },
    company: {
      type: Sequelize.STRING,
    },
    taskdetail: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    importance: {
      type: Sequelize.STRING,
    },
    responsible: {
      type: Sequelize.STRING,
    },
  });

  return Task;
};


