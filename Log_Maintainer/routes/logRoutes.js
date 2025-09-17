const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

// MVP: Protocol layer
router.get("/", logController.getLogs);
router.get("/:id", logController.getLogById);
router.post("/", logController.createLog);
router.put("/:id", logController.updateLog);
router.delete("/:id", logController.deleteLog);

module.exports = router;
