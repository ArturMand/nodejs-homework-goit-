const Contacts = require("./model");

async function listContacts() {
  return await Contacts.find();
}

async function getContactById(contactId) {
  return await Contacts.findById(contactId);
}

async function removeContact(contactId) {
  return await Contacts.findByIdAndDelete(contactId);
}

async function addContact(body) {
  return await Contacts.create(body);
}

async function updateContact(id, body) {
  return await Contacts.findByIdAndUpdate(id, body, { new: true });
}
async function updateStatusFavorite(id) {
  const contact = await Contacts.findById(id);
  const updateFavorite = !contact.favorite;
  await Contacts.updateOne({ _id: id }, { favorite: updateFavorite });
  const updatedContact = await Contacts.findById(id);
  return updatedContact;
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusFavorite,
};
