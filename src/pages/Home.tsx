import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Home() {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedCode = localStorage.getItem("lastSpaceCode");
    if (savedCode) {
      setJoinCode(savedCode);
    }
  }, []);

  const handleJoin = async () => {
    setError("");
    const trimmed = joinCode.trim();

    if (!/^\d{10}$/.test(trimmed)) {
      setError("Wpisz poprawny 10-cyfrowy kod.");
      return;
    }

    localStorage.setItem("lastSpaceCode", trimmed);
    const ref = doc(db, "spaces", trimmed);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      setError("Nie znaleziono przestrzeni o tym kodzie.");
      return;
    }

    navigate(`/space/${trimmed}`);
  };

  const handleCreate = () => {
    navigate("/create");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center px-4">
      <div className="w-full bg-white rounded-2xl shadow-lg py-4 px-4 sm:px-6 text-center sm:min-w-[480px] md:max-w-sm">
        <div className="text-4xl mb-2">💑</div>
        <h1 className="text-2xl font-semibold text-blue-600 mb-6">AskMeEveryDay</h1>

        <input
          type="text"
          placeholder="Wpisz kod przestrzeni"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          className="w-full border border-blue-300 rounded-md p-2 mb-2 bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Dołącz do przestrzeni
        </button>

        <div className="mt-6 text-sm text-gray-500">
          Nie masz jeszcze wspólnej przestrzeni?
        </div>

        <button
          onClick={handleCreate}
          className="w-full mt-2 bg-blue-100 text-blue-700 py-2 rounded-md hover:bg-blue-200 transition"
        >
          Stwórz nową przestrzeń
        </button>
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
