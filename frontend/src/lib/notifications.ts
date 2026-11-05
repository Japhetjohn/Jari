export type FarmNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  fullText: string;
};

export const farmNotifications: FarmNotification[] = [
  { id: "vaccine-reminder", title: "Vaccination reminder", detail: "A Newcastle vaccination is coming up.", time: "2 hours ago", fullText: "Check the care plan for the birds in your layer group. Contact your animal health worker if you need help with the vaccination." },
  { id: "feed-stock", title: "Feed stock update", detail: "Review the feed you have left.", time: "Today", fullText: "Keeping feed purchase and usage notes up to date can help you plan when to restock." },
  { id: "farm-support", title: "Farm support available", detail: "There may be a support option for your farm.", time: "Yesterday", fullText: "Visit Ways to get support to see available opportunities and check what information is needed to apply." },
  { id: "farm-review", title: "Farm review", detail: "You can ask JARI to review your farm details.", time: "This week", fullText: "Send your farm name, location and phone number from Farm verification. The JARI team will review your request." },
];
