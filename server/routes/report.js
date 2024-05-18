const express = require('express');
const ReportRouter = express.Router();
const {postCreateReport, getUserReportsByStatus, getLocations, getRooms} = require("../controllers/reportController");

ReportRouter.post("/createReport", postCreateReport);

ReportRouter.get("/getReports/:id/:status",getUserReportsByStatus);

ReportRouter.get("/getLocations",getLocations);

ReportRouter.get("/getRooms/:buildingId",getRooms);

module.exports = ReportRouter;
