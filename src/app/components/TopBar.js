'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient'

export default function TopBar() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error.message)
    }
  }

  return (
    <div>
      <header className="bg-black px-6 py-2 flex items-center">
        <div>
          <img src="/delveLogo.svg" alt="Logo" className="w-20 h-20" />
        </div>
        <h1 className="text-xl font-bold text-white flex-1 text-center">
          Client Supabase Diagnostics
        </h1>
        <div className="text-white text-lg flex justify-end">
          <span 
            className="cursor-pointer hover:opacity-80" 
            onClick={handleLogout}
            title="Logout"
          >
            👤
          </span>
        </div>
      </header>
    </div>
  )
}