export type FlashType = 'success' | 'error' | 'info' | 'warning' | 'default';

export interface FlashMessage {
  type: FlashType;
  message: string;
}
