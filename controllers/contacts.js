const Contacts = require("../db/modelContacts");

const listContacts = async (req, res) => {
  try {
    const contats = await Contacts.find();
    res.status(200).json({ contats });
  } catch (error) {
    res.status(500).send("something wrong in db" + error);
  }
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const contactById = await getContactById(id);
    if (!contactById) {
      res.status(400).json({
        message: `Bad request, your phonebook no have contact with ID: ${id}`,
      });
    }
    res.json({ contactById });
  } catch (error) {
    res.status(500).send("something wrong in db" + error);
  }
};

const removeContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await Contacts.findByIdAndDelete(contactId);
    if (!deletedContact) {
      return res.status(400).json({
        message: `Bad request, your phonebook no have contact with ID: ${contactId}`,
      });
    }
    res.status(200).json({ deletedContact });
  } catch (error) {
    res.status(500).send("something wrong in db" + error);
  }
};

const addContact = async (req, res) => {
  try {
    const contact = await Contacts.create(req.body);
    res.status(201).json({ contact });
  } catch (error) {
    res.status(500).send("something wrong in db" + error);
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    if (!body) {
      res.status(400).json({ message: "missing fields" });
    }
    const updatedPhonebook = await Contacts.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.status(201).json({ updatedPhonebook });
  } catch (error) {
    res.status(500).send("something wrong in db" + error);
  }
};

const updateStatusFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contacts.findById(id);
    if (!contact) {
      res.status(400).json({
        message: `Bad request, your phonebook no have contact with ID: ${id}`,
      });
    }
    const updateFavorite = !contact.favorite;
    const updatedContact = await Contacts.findByIdAndUpdate(
      { _id: id },
      { favorite: updateFavorite },
      { new: true }
    );
    res.status(200).json({ updatedContact });
  } catch (error) {
    res.status(500).send("something wrong in db" + error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusFavorite,
};
