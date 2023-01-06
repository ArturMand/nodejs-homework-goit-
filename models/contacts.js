const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve(__dirname, "./contacts.json");

const getContactsList = async function () {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const dataParse = await JSON.parse(data);
    return dataParse;
  } catch (error) {
    console.log(`Error ${error} during reading file `);
  }
};
async function listContacts() {
  return await getContactsList();
}

async function getContactById(contactId) {
  const contacts = await getContactsList();
  return contacts.find(({ id }) => id === contactId);
}

async function removeContact(contactId) {
  const contacts = await getContactsList();
  const checkContactById = contacts.find(({ id }) => id === contactId);
  if (!checkContactById) return false;
  const deletedContacts = contacts.filter(({ id }) => id !== contactId);
  const parsedData = JSON.stringify(deletedContacts);
  await fs.writeFile(contactsPath, parsedData, "utf8");
  return JSON.parse(parsedData);
}

async function addContact(name, email, phone) {
  const contacts = await getContactsList();
  const data = { id: String(contacts.length + 1), name, email, phone };
  contacts.push(data);
  const parsedData = JSON.stringify(contacts);
  await fs.writeFile(contactsPath, parsedData, "utf8");
  return contacts;
}
async function updateContact(id, body) {
  const findedContact = await getContactById(id);
  if (typeof findedContact === "undefined") return findedContact;
  const contacts = await getContactsList();
  contacts.forEach((contact) => {
    if (contact.id === id) {
      if (body.name) {
        contact.name = body.name;
      }
      if (body.email) {
        contact.email = body.email;
      }
      if (body.phone) {
        contact.phone = body.phone;
      }
    }
  });
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  const updContact = await getContactById(id);
  return updContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
