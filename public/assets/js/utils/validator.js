// Simple validators
export const isEmail = (value) => /.+@.+\..+/.test(String(value).trim());
export const minLength = (value, len) => String(value).trim().length >= len;
export const required = (value) => String(value).trim().length > 0;