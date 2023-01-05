const isUniqueContact = async ({ name, email, phone }, params, params2) => {
  if (name?.toLowerCase().trim() === "") {
    return {
      status: false,
      message: `Field name is required`,
    };
  } else if (email?.toLowerCase().trim() === "") {
    return {
      status: false,
      message: `Field email is required`,
    };
  } else if (phone?.trim() === "") {
    return {
      status: false,
      message: `Field phone is required`,
    };
  }
  if (params2?.req === "POST") {
    if (params.name.toLowerCase().trim() === name.toLowerCase().trim()) {
      return {
        status: false,
        message: `You have contact in your phonebook with name:${name}. His id:${params.id}`,
      };
    } else if (
      params.email.toLowerCase().trim() === email.toLowerCase().trim()
    ) {
      return {
        status: false,
        message: `You have contact in your phonebook with email:${email}. His id:${params.id}`,
      };
    } else if (
      params.phone.toLowerCase().trim() === phone.toLowerCase().trim()
    ) {
      return {
        status: false,
        message: `You have contact in your phonebook with phone:${phone}. His id:${params.id}`,
      };
    }
  }
  if (Array.isArray(params)) {
    const findNotUniqueContact = params.find(
      (contact) =>
        contact.name.toLowerCase().trim() === name.toLowerCase().trim() ||
        contact.email.toLowerCase().trim() === email.toLowerCase().trim() ||
        contact.phone.toLowerCase().trim() === phone.toLowerCase().trim()
    );
    if (!findNotUniqueContact) return { status: true };

    for (const key in findNotUniqueContact) {
      console.log("work 2 ");
      if (
        findNotUniqueContact[key].toLowerCase().trim() ===
        name.toLowerCase().trim()
      ) {
        return {
          status: false,
          message: `You have contact in your phonebook with name:${name}. His id:${findNotUniqueContact.id}`,
        };
      } else if (
        findNotUniqueContact[key].toLowerCase().trim() ===
        email.toLowerCase().trim()
      ) {
        return {
          status: false,
          message: `You have contact in your phonebook with email:${email}. His id:${findNotUniqueContact.id}`,
        };
      } else if (
        findNotUniqueContact[key].toLowerCase().trim() ===
        phone.toLowerCase().trim()
      ) {
        return {
          status: false,
          message: `You have contact in your phonebook with phone:${phone}. His id:${findNotUniqueContact.id}`,
        };
      }
    }
  }
  return {
    status: true,
  };
};

module.exports = isUniqueContact;
