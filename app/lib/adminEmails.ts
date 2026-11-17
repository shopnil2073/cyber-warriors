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

// AdminConsole.tsx ফাইলের ইমপোর্ট এরর দূর করার জন্য এগুলো যোগ করা হলো:
export const ALLOWED_ADMIN_EMAILS = ADMIN_EMAILS;
export const SUPER_ADMIN_EMAIL = ADMIN_EMAILS[0]; // প্রথম ইমেইলটি সুপার অ্যাডমিন হিসেবে সেট করা হলো

export function isCommandCenterEmail(email: string): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}