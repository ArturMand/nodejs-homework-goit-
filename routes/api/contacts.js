const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusFavorite,
} = require("../../controllers/contacts");
const {
  validateObjectId,
  validateContact,
  validateUpdateContact,
} = require("../../helpers/validationsUserJoi");

router.get("/", listContacts);
router.get("/:id", validateObjectId, getContactById);
router.post("/", validateContact, addContact);
router.delete("/:id", validateObjectId, removeContact);
router.put("/:id", validateObjectId, validateUpdateContact, updateContact);
router.put("/:id/favorite", validateObjectId, updateStatusFavorite);

module.exports = router;
