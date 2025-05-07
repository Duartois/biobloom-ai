
export interface BioPageFormData {
  name: string;
  bio: string;
  theme: 'default' | 'minimal' | 'neobrutal' | 'glass';
  themeColor: string;
  background_type: 'color' | 'image';
  backgroundImage: string;
  opacity: number;
  grayscale: boolean;
}

export const DEFAULT_BACKGROUND_COLOR = '#F8F9FA';

// Função utilitária para garantir que URLs tenham protocolo
export const ensureProtocol = (url: string): string => {
  if (!url) return '';
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};
