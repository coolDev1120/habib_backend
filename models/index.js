const dbConfig = require("../dbconnection");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutor = require("./tutor.js")(sequelize, Sequelize);
db.user = require("./user1.js")(sequelize, Sequelize);
db.tutor_contact = require("./tutor_contact.js")(sequelize, Sequelize);
db.message = require("./message.js")(sequelize, Sequelize);
db.job = require("./job.js")(sequelize, Sequelize);
db.material = require("./material.js")(sequelize, Sequelize);
db.task = require("./task.js")(sequelize, Sequelize);
db.event = require("./event.js")(sequelize, Sequelize);
db.contact = require("./contact.js")(sequelize, Sequelize);
db.company = require("./company.js")(sequelize, Sequelize);
db.category = require("./category.js")(sequelize, Sequelize);
db.subcategory = require("./subcategory.js")(sequelize, Sequelize);
db.subsubcategory = require("./subsubcategory.js")(sequelize, Sequelize);
db.asset = require("./asset.js")(sequelize, Sequelize);
db.team = require("./team.js")(sequelize, Sequelize);
db.email = require("./email.js")(sequelize, Sequelize);
db.setting = require("./setting.js")(sequelize, Sequelize);
db.esetting = require("./esetting.js")(sequelize, Sequelize);

module.exports = sequelize;
module.exports = db;
