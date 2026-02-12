import { clsx, type ClassValue } from "clsx";
import * as Clipboard from 'expo-clipboard';
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// Copy utils
export const copyToClipboard = async (text: string) => {
  console.log('Pressed, copying:', text)

  await Clipboard.setStringAsync(text)
  alert('copied ' + text)
}


