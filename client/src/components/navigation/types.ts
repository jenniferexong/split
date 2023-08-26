export interface TabBarMenuButton {
  label: string;
  to?: string;
  onClick?: () => Promise<void>;
}
