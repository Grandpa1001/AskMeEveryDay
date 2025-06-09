import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { generateUID } from "../utils/generateUID";

export default function CreateSpace() {
  const [name, setName] = useState("");
  const [maxAdd, setMaxAdd] = useState("1");
  const [maxDraw, setMaxDraw] = useState("1");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNumberChange = (value: string, setter: (value: string) => void) => {
    // Pozwól na puste pole
    if (value === "") {
      setter("");
      return;
    }

    // Usuń wszystkie znaki oprócz cyfr
    const numbersOnly = value.replace(/\D/g, "");
    
    // Jeśli nie ma cyfr, ustaw 1
    if (numbersOnly === "") {
      setter("1");
      return;
    }

    // Konwertuj na liczbę i sprawdź zakres
    const num = parseInt(numbersOnly, 10);
    if (num > 99) {
      setter("99");
    } else if (num < 1) {
      setter("1");
    } else {
      setter(numbersOnly);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return alert("Wprowadź nazwę przestrzeni");
    if (!maxAdd || !maxDraw) return alert("Wprowadź poprawne wartości dla limitów");
    
    setLoading(true);
    let uid = "";
    let exists = true;
    while (exists) {
      uid = generateUID();
      const ref = doc(db, "spaces", uid);
      const snap = await getDoc(ref);
      exists = snap.exists();
    }
    const today = new Date().toISOString().split("T")[0];
    await setDoc(doc(db, "spaces", uid), {
      name,
      createdAt: new Date(),
      config: {
        maxDailyAdd: Number(maxAdd),
        maxDailyDraw: Number(maxDraw)
      },
      dailyStats: {
        date: today,
        addCount: 0,
        drawCount: 0
      }
    });
    navigate(`/space/${uid}`);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center px-4">
      <div className="w-full bg-white rounded-2xl shadow-lg py-8 px-4 sm:px-6 text-center sm:min-w-[480px] md:max-w-sm">
        <h1 className="text-2xl font-semibold text-blue-600 mb-2">AskMeEveryDay</h1>
        <h2 className="text-xl font-semibold text-blue-700 mb-6">Stwórz nową przestrzeń</h2>
        <div className="mb-4 flex flex-col items-center">
          <label className="block text-sm font-medium text-blue-700 mb-1 text-left w-full">Nazwa przestrzeni</label>
          <input
            type="text"
            placeholder="Nazwa przestrzeni"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-blue-300 rounded-md p-2 bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            maxLength={32}
          />
          <p className="text-xs text-gray-400 mt-1 w-full text-left">Wymyśl unikalną nazwę dla swojej przestrzeni.</p>
        </div>
        <div className="mb-4 flex flex-col items-center">
          <label className="block text-sm font-medium text-blue-700 mb-1 text-left w-full">Maks. liczba dodanych pytań dziennie</label>
          <input
            type="text"
            inputMode="numeric"
            value={maxAdd}
            onChange={(e) => handleNumberChange(e.target.value, setMaxAdd)}
            className="w-full border border-blue-300 rounded-md p-2 bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
            maxLength={2}
          />
          <p className="text-xs text-gray-400 mt-1 w-full text-left">Podaj liczbę od 1 do 99.</p>
        </div>
        <div className="mb-6 flex flex-col items-center">
          <label className="block text-sm font-medium text-blue-700 mb-1 text-left w-full">Maks. liczba losowań dziennie</label>
          <input
            type="text"
            inputMode="numeric"
            value={maxDraw}
            onChange={(e) => handleNumberChange(e.target.value, setMaxDraw)}
            className="w-full border border-blue-300 rounded-md p-2 bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
            maxLength={2}
          />
          <p className="text-xs text-gray-400 mt-1 w-full text-left">Podaj liczbę od 1 do 99.</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={loading || !maxAdd || !maxDraw}
          className={`w-full py-3 rounded-md font-semibold text-white transition
            ${loading || !maxAdd || !maxDraw ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Tworzenie..." : "Utwórz przestrzeń"}
        </button>
        <a
          href="/"
          className="mt-4 inline-block text-blue-500 hover:underline text-sm"
        >
          Anuluj
        </a>
      </div>

      <div className="text-xs text-blue-300 mt-8 text-center sm:hidden">
        Made by Grandpa1001 •{" "}
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
  );
}
