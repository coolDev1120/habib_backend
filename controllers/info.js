const db = require("../models");
const Company = db.company;
const Category = db.category;
const Subcategory = db.subcategory;
const Subsubcategory = db.subsubcategory
const Team = db.team;

exports.getCompany = async function (req, res, next) {
	var value = await Company.findAll();
	res.json(value);
}

exports.getCategory = async function (req, res, next) {
	var value = await Category.findAll();
	res.json(value);
}

exports.getSubcategory = async function (req, res, next) {
	var value = await Subcategory.findAll();
	res.json(value);
}

exports.getSub2category = async function (req, res, next) {
	var value = await Subsubcategory.findAll();
	res.json(value);
}

exports.getTeam = async function (req, res, next) {
	var value = await Team.findAll();
	res.json(value);
}