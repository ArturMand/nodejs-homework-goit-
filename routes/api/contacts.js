const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusFavorite,
} = require("../../models/contacts");

const contactPostSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().min(3).max(20).required(),
  phone: Joi.string().min(3).max(20).required(),
});
const contactPutSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  email: Joi.string().email().min(3).max(20).optional(),
  phone: Joi.string().min(3).max(20).optional(),
});

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json({ contacts });
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const contactById = await getContactById(id);
    res.json({ contactById });
  } catch (error) {
    res.status(400).json({
      message: `Bad request, your phonebook no have contact with ID: ${id}`,
    });
  }
});

router.post("/", async (req, res, next) => {
  const { body } = req;
  const { error } = contactPostSchema.validate(body);
  if (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "missing required name field",
    });
    return;
  }
  try {
    const updatedPhonebook = await addContact(body);
    res.status(201).json({ updatedPhonebook });
  } catch (error) {
    res.status(400).json({
      message: `${error}`,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  const contactId = req.params.id;
  const deletedContact = await removeContact(contactId);
  if (!deletedContact) {
    return res.status(400).json({
      message: `Bad request, your phonebook no have contact with ID: ${contactId}`,
    });
  }

  res.status(200).json({ deletedContact });
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const updatedPhonebook = await updateContact(id, req.body);

  if (!req.body) {
    res.status(400).json({ message: "missing fields" });
  }
  const { error } = contactPutSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(201).json({ updatedPhonebook });
});
router.put("/:id/favorite", async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedContact = await updateStatusFavorite(id);
    res.status(201).json({ updatedContact });
  } catch (error) {
    res.status(400).json({
      message: `Bad request, your phonebook no have contact with ID: ${id}`,
    });
  }
});

module.exports = router;
