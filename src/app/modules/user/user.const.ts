export const userRoles = [
  "customer",
  "vendor",
  "vendor-staff",
  "admin",
  "admin-staff",
  "super-admin",
];

export const possibleGenders = ["male", "female", "other"];

export const userStatus = ["active", "banned"];

export const userRole = {
  customer: "customer",
  admin: "admin",
  "super-admin": "super-admin",
  vendor: "vendor",
} as const;
