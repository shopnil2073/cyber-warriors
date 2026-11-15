// Cyber Warriors - Admin Emails Configuration

export const ADMIN_EMAILS = [
  "shopnilhossainhim@gmail.com",
  "razibulislamhridoy@gmail.com",
  "samiaakter2073@gmail.com",
  "hmmamun2010@gmail.com",
  "tanjimuddin1437@gmail.com",
  "mdharunanwer@gmail.com",
  "akasharsenal14@gmail.com",
  "samiulakter2075@gmail.com",
];

export function isCommandCenterEmail(email: string): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}