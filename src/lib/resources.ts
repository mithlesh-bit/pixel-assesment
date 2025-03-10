/* eslint-disable @typescript-eslint/no-unused-vars */

export const isDomainAvailable = (domain: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() > 0.5); // Randomly return true or false for availability
    }, 500);
  });
};

// Validate domain and ensure it ends with .com, .app, or .xyz
export const validateDomain = (domain: string): boolean => {
  const regex = /^[a-z0-9-]+\.(com|xyz|app)$/i;
  return regex.test(domain);
};
