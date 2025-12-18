// 分類常數定義
export const CATEGORIES = [
  { value: 'Coding', label: '💻 Coding', icon: '💻' },
  { value: 'Writing', label: '✍️ Writing', icon: '✍️' },
  { value: 'Marketing', label: '📈 Marketing', icon: '📈' },
  { value: 'Image', label: '🎨 Image', icon: '🎨' },
  { value: 'Research', label: '🔬 Research', icon: '🔬' },
  { value: 'Productivity', label: '⚡ Productivity', icon: '⚡' },
  { value: 'Creative', label: '🎭 Creative', icon: '🎭' },
  { value: 'Business', label: '💼 Business', icon: '💼' },
  { value: 'Education', label: '📚 Education', icon: '📚' },
  { value: 'Entertainment', label: '🎮 Entertainment', icon: '🎮' },
  { value: 'Roleplay', label: '🎲 Roleplay', icon: '🎲' },
  { value: 'Adult', label: '🔞 Adult', icon: '🔞' },
  { value: 'Other', label: '📦 Other', icon: '📦' },
] as const;

export const MODELS = [
  { value: 'All', label: '🤖 All Models' },
  { value: 'ChatGPT', label: '🟢 ChatGPT' },
  { value: 'Claude', label: '🟣 Claude' },
  { value: 'Gemini', label: '🔵 Gemini' },
  { value: 'Midjourney', label: '🎨 Midjourney' },
  { value: 'Stable Diffusion', label: '🖼️ Stable Diffusion' },
  { value: 'DALL-E', label: '🌈 DALL-E' },
] as const;

export type CategoryType = typeof CATEGORIES[number]['value'];
export type ModelType = typeof MODELS[number]['value'];
