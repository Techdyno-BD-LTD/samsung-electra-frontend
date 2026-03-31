/** Parses formatted currency strings like "৳ 1,50,000" or "150,000" to number 150000 */
export const parseCurrency = (priceStr?: string): number => {
  if (!priceStr) return 0;
  // Remove formatting characters, keep only digits
  const numeric = priceStr.replace(/[^0-9]/g, "");
  return parseInt(numeric, 10) || 0;
};

/** 
 * Formats a number back to "৳1,50,000" format manually to ensure 
 * consistency between server and browser (preventing hydration errors).
 */
export const formatCurrency = (amount: number): string => {
  const roundedAmount = Math.round(amount);
  const amountStr = roundedAmount.toString();
  
  // Hand-rolled Indian grouping logic (last 3, then 2, 2...)
  let lastThree = amountStr.substring(amountStr.length - 3);
  const otherNumbers = amountStr.substring(0, amountStr.length - 3);
  
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  
  return "৳" + (formattedOther + lastThree);
};
