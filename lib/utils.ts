import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// List of authorized admin email addresses
const ADMIN_EMAILS = [
  // Add your admin emails here
  'smaleesha84@gmail.com',  
  'chandeepaabhisheka455@gmail.com',
  'kanishkadewinda1102@gmail.com'
]

const TECHNICIAN_EMAILS = [
  // Add your admin emails here
  's19524@sci.pdn.ac.lk',  
]

export function isAdmin(email: string | null | undefined) {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export function isTechnician(email: string | null | undefined) {
  if (!email) return false
  return TECHNICIAN_EMAILS.includes(email.toLowerCase())
}
