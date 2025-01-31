export const APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE || 'Shirtology';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Shirtology';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

export const LATEST_PRODUCTS_LIMIT = 4;

export const shippingAddressDefaultValues = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
};
