import prisma from '../lib/db';
import { ContactRequest, ContactResponse } from '../types/contact';

async function findExistingContacts(email?: string, phoneNumber?: string) {
  return prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ],
      deletedAt: null
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}

async function createPrimaryContact(email?: string, phoneNumber?: string) {
  const newContact = await prisma.contact.create({
    data: {
      email,
      phoneNumber,
      linkPrecedence: 'primary'
    }
  });

  return {
    contact: {
      primaryContatctId: newContact.id,
      emails: email ? [email] : [],
      phoneNumbers: phoneNumber ? [phoneNumber] : [],
      secondaryContactIds: []
    }
  };
}

async function createSecondaryContact(
  primaryContactId: number,
  email?: string,
  phoneNumber?: string
) {
  return prisma.contact.create({
    data: {
      email,
      phoneNumber,
      linkedId: primaryContactId,
      linkPrecedence: 'secondary'
    }
  });
}

async function updateContactsToPrimary(contactIds: number[], primaryContactId: number) {
  if (contactIds.length === 0) return;

  await prisma.contact.updateMany({
    where: {
      id: {
        in: contactIds
      }
    },
    data: {
      linkedId: primaryContactId,
      linkPrecedence: 'secondary'
    }
  });
}

async function getAllRelatedContacts(primaryContactId: number) {
  return prisma.contact.findMany({
    where: {
      OR: [
        { id: primaryContactId },
        { linkedId: primaryContactId }
      ],
      deletedAt: null
    }
  });
}

function prepareContactResponse(
  primaryContact: any,
  allRelatedContacts: any[]
): ContactResponse {
  const emails = Array.from(new Set(
    allRelatedContacts
      .map(c => c.email)
      .filter((email): email is string => email !== null)
  ));

  const phoneNumbers = Array.from(new Set(
    allRelatedContacts
      .map(c => c.phoneNumber)
      .filter((phone): phone is string => phone !== null)
  ));

  if (primaryContact.email && emails.includes(primaryContact.email)) {
    emails.splice(emails.indexOf(primaryContact.email), 1);
    emails.unshift(primaryContact.email);
  }
  if (primaryContact.phoneNumber && phoneNumbers.includes(primaryContact.phoneNumber)) {
    phoneNumbers.splice(phoneNumbers.indexOf(primaryContact.phoneNumber), 1);
    phoneNumbers.unshift(primaryContact.phoneNumber);
  }

  return {
    contact: {
      primaryContatctId: primaryContact.id,
      emails,
      phoneNumbers,
      secondaryContactIds: allRelatedContacts
        .filter(c => c.id !== primaryContact.id)
        .map(c => c.id)
    }
  };
}

export async function identifyContact(data: ContactRequest): Promise<ContactResponse> {
  const { email, phoneNumber } = data;


  const existingContacts = await findExistingContacts(email, phoneNumber);

  if (existingContacts.length === 0) {
    return createPrimaryContact(email, phoneNumber);
  }

  const primaryContact = existingContacts.find(
    contact => contact.linkPrecedence === 'primary'
  ) || existingContacts[0];

  const hasNewInfo = (email && !existingContacts.some(c => c.email === email)) ||
    (phoneNumber && !existingContacts.some(c => c.phoneNumber === phoneNumber));

  if (hasNewInfo) {
    await createSecondaryContact(primaryContact.id, email, phoneNumber);
  }

  const contactsToUpdate = existingContacts.filter(
    contact => contact.id !== primaryContact.id && contact.linkPrecedence === 'primary'
  );

  await updateContactsToPrimary(
    contactsToUpdate.map(c => c.id),
    primaryContact.id
  );

  const allRelatedContacts = await getAllRelatedContacts(primaryContact.id);

  return prepareContactResponse(primaryContact, allRelatedContacts);
}
