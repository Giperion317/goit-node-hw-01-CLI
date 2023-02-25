const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.resolve("./db/contacts.json");
const { v4: uuidv4 } = require("uuid");
require("colors");

async function getContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.log(`Message:`, error.message);
  }
}

async function listContacts() {
  try {
    const contacts = await getContacts();
    console.table(contacts);
    return;
  } catch (error) {
    console.log(`Message:`, error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await getContacts();
    if (contacts.find(({ id }) => id === contactId)) {
      const findContact = contacts.filter(({ id }) => id === contactId);
      console.table(findContact);
      return;
    }
    const message = `Contact with id:${contactId} not found`;
    console.log(message.red);
  } catch (error) {
    console.log(`Message:`, error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getContacts();
    if (contacts.find(({ id }) => id === contactId)) {
      const updateContacts = contacts.filter(({ id }) => id !== contactId);
      await fs.writeFile(contactsPath, JSON.stringify(updateContacts));
      console.log(`Contact with id:${contactId} deleted`.yellow);
      console.table(updateContacts);
      return;
    }
    const message = `Contact with id:${contactId} not found`;
    console.log(message.red);
  } catch (error) {
    console.log(`Message:`, error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await getContacts();
    const newContact = { id: uuidv4(), name, email, phone };
    if (contacts.find(({ name }) => newContact.name === name)) {
      const message = `Contact with this name:${name} already exists`;
      console.log(message.red);
      return;
    }
    const updateContacts = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(updateContacts));
    const message = `Contact with name:${name} added successfully`;
    console.log(message.green);
    console.table(updateContacts);
    return;
  } catch (error) {
    console.log(`Message:`, error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
