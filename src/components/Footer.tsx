import { useState } from "react";

export default function Footer() {
  return (
    <footer className="border-t border-blue-200/30 bg-blue-100/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="text-xs text-blue-300">
            <span className="opacity-50">Made by </span>
            <a
              href="https://github.com/grandpa1001"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              Grandpa1001
            </a>
            <span className="opacity-50"> • </span>
            <span className="opacity-50">Wersja 1.0.V009</span>
            <span className="opacity-50"> • </span>
            <button
              onClick={() =>
                alert(
                  "Aby dodać aplikację do ekranu głównego:\n• Na Androidzie: kliknij 3 kropki > Dodaj do ekranu głównego.\n• Na iPhonie: kliknij Udostępnij > Dodaj do ekranu początkowego."
                )
              }
              className="inline-block underline text-blue-300 hover:text-blue-500 bg-transparent border-none p-0"
              style={{ background: 'transparent', border: 'none', padding: 0, margin: 0 }}
            >
              Kliknij tu, by dodać aplikację
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}  