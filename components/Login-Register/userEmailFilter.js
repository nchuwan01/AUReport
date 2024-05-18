export const isAuEmail = (email) => {
    email = email.toLowerCase();

    const emailTag = email.split('@')[1];
    const auTag = 'aurora.edu';

    return emailTag.endsWith(auTag) || false;
};
