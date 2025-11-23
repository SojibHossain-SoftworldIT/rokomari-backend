export type TFooterSubmenu = {
  title: string;
  url: string;
  isDynamicPage: boolean;
  isActive: boolean;
};

export type TFooterMenu = {
  menuTitle: string;
  submenus: TFooterSubmenu[];
  isActive: boolean;
  order: number;
};

export type TFooterSettings = {
  menus: TFooterMenu[];
  isActive: boolean;
};