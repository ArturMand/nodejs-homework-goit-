const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
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
  const contactId = req.params.id;
  const contactById = await getContactById(contactId);
  if (!contactById) {
    return res.status(400).json({
      message: `Bad request, your phonebook no have contact with ID: ${contactId}`,
    });
  }
  res.json({ contact: contactById });
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { error } = contactPostSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "missing required name field",
    });
    return;
  }
  const updatedPhonebook = await addContact(name, email, phone);

  res.status(201).json({ updatedPhonebook });
});

router.delete("/:id", async (req, res, next) => {
  const contactId = req.params.id;
  const phonebookWithOutContactById = await removeContact(contactId);
  if (!phonebookWithOutContactById) {
    return res.status(400).json({
      message: `Bad request, your phonebook no have contact with ID: ${contactId}`,
    });
  }

  res.json({ phonebookWithOutContactById });
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const updatedPhonebook = await updateContact(id, req.body);
  if (typeof updatedPhonebook === "undefined") {
    return res.status(400).json({
      message: `You no have contact with ID: ${id} in your phonebook `,
    });
  }
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

module.exports = router;
