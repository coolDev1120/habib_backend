module.exports = (sequelize, Sequelize) => {
  const Tutor = sequelize.define("tutor", {
    tutor_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
    },
    // about
    subjecttaught: {
      type: Sequelize.STRING,
    },
    enlevel: {
      type: Sequelize.STRING,
    },
    teachingexperience: {
      type: Sequelize.STRING,
    },
    currentsituation: {
      type: Sequelize.STRING,
    },

    // about
    excompany: {
      type: Sequelize.STRING,
    },
    exendDate1: {
      type: Sequelize.DATE,
    },
    exendDate2: {
      type: Sequelize.DATE,
    },
    exlocation: {
      type: Sequelize.STRING,
    },
    exsituation: {
      type: Sequelize.STRING,
    },
    exstartDate1: {
      type: Sequelize.DATE,
    },
    exstartDate2: {
      type: Sequelize.DATE,
    },
    extitle: {
      type: Sequelize.STRING,
    },

    // education
    eddegree: {
      type: Sequelize.STRING,
    },
    eddescription: {
      type: Sequelize.STRING,
    },
    edfieldofstudy: {
      type: Sequelize.STRING,
    },
    edschool: {
      type: Sequelize.STRING,
    },
    edstartDate1: {
      type: Sequelize.STRING,
    },
    edstartDate2: {
      type: Sequelize.STRING,
    },

    // description
    aboutme: {
      type: Sequelize.STRING,
    },
    aboutsubject: {
      type: Sequelize.STRING,
    },

    // price
    hourlyRate: {
      type: Sequelize.INTEGER,
    },

    // availability
    availability: {
      type: Sequelize.STRING,
    },

    // certification
    certitle: {
      type: Sequelize.STRING,
    },
    cercontent: {
      type: Sequelize.STRING,
    },

    // done
    done: { type: String, default: 'none' }
  });

  return Tutor;
};


