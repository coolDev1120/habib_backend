module.exports = (sequelize, Sequelize) => {
  const Tutor = sequelize.define("job", {
    job_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ref: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    contact: {
      type: Sequelize.STRING,
    },
    responsible: {
      type: Sequelize.STRING,
    },
    quoted: {
      type: Sequelize.STRING,
    },
    startdate: {
      type: Sequelize.DATE,
    },
    category: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    status2: {
      type: Sequelize.STRING,
    },
    postcode: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    company: {
      type: Sequelize.STRING,
    },
    tags: {
      type: Sequelize.STRING,
    },
    starttime: {
      type: Sequelize.STRING,
    },
    enddate: {
      type: Sequelize.STRING,
    },
    team: {
      type: Sequelize.STRING,
    },
    tick: {
      type: Sequelize.INTEGER,
    },
    description: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    address2: {
      type: Sequelize.STRING,
    },
    address3: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    countrystate: {
      type: Sequelize.STRING,
    }, 
    referal: {
      type: Sequelize.STRING,
    },
    priority: {
      type: Sequelize.STRING,
    },
    resin: {
      type: Sequelize.INTEGER,
    },
    jobvalue: {
      type: Sequelize.STRING,
    },
    individual: {
      type: Sequelize.STRING,
    },
    tipping: {
      type: Sequelize.INTEGER,
    },
    seeable: {
      type: Sequelize.STRING,
    },
  });

  return Tutor;
};


