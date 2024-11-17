import localFont from "next/font/local";
import "../styles/globals.css";
import { FaUserAlt } from 'react-icons/fa';
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Compliance Dashboard",
  description: "Compliance Check Dashboard for Delve",
};

let check = false;

export default function RootLayout({ children }) {
  if(check) {
    return (
      <html lang="en" className="dark">
        <body className="flex h-screen bg-black text-gray-200">
  
          <main className="flex-grow flex flex-col">
            <AuthProvider>
              <header className="bg-black px-6 py-4 flex justify-between items-center">
                <label
                  htmlFor="sidebar-toggle"
                  className="text-gray-200 text-lg p-2 rounded-md cursor-pointer focus:outline-none focus:ring"
                >
                  Menu
                </label>
                <h1 className="text-2xl text-gray-200">Diagnostics Dashboard</h1>
                <FaUserAlt />
              </header>
              <div className="p-6 space-y-6">{children}</div>
            </AuthProvider>
          </main>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="en" className="dark">
        <body className="flex h-screen bg-black text-gray-200">
          <AuthProvider>
            <main className="flex-grow flex flex-col">
              <div className="p-6 space-y-6">{children}</div>
            </main>
          </AuthProvider>
        </body>
      </html>
    );
  }

  
}
