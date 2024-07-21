const express = require("express");
const {
  createForm,
  getForms,
  updateForm,
  deleteForm,
} = require("../controllers/formController");
const router = express.Router();

router.post("/form", createForm);
router.get("/forms", getForms);
router.put("/form/:id", updateForm);
router.delete("/form/:id", deleteForm);

module.exports = router;
