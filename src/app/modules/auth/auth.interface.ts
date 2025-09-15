export type TAuth = {
  name?: string;
  email: string;
  password: string;
  role?: "customer" | "vendor";
};

export type TExternalProviderAuth = {
  name: string;
  email: string;
};
