const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

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
  const updatedPhonebook = await addContact(name, email, phone);
  if (!Array.isArray(updatedPhonebook)) {
    return res.status(400).json({ message: updatedPhonebook.message });
  }
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
  const { status, data } = updatedPhonebook;
  if (!status) {
    res.status(400).json({ message: updatedPhonebook.message });
    return;
  }

  res.status(201).json({ data });
});

module.exports = router;
