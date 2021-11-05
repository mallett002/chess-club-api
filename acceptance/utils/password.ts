import bcrypt from 'bcryptjs';

export const encryptPassword = (plainTextPassword) => bcrypt.hash(plainTextPassword, 10);
