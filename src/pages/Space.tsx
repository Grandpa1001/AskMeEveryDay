import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { encrypt, decrypt } from "../utils/encryption";

interface QuestionData {
  text?: string;
  encryptedText?: string;
}

function isToday(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const savedDate = new Date(dateStr);
  const today = new Date();
  return (
    savedDate.getDate() === today.getDate() &&
    savedDate.getMonth() === today.getMonth() &&
    savedDate.getFullYear() === today.getFullYear()
  );
}

export default function Space() {
  const { uid } = useParams();
  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [error, setError] = useState("");
  const [canAdd, setCanAdd] = useState(true);
  const [canDraw, setCanDraw] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [hasQuestions, setHasQuestions] = useState(true);
  const [questionCount, setQuestionCount] = useState<number>(0);


  useEffect(() => {
    if (!uid) return;

    const load = async () => {
      const ref = doc(db, "spaces", uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setError("Nie znaleziono przestrzeni.");
        setLoading(false);
        return;
      }

      const data = snap.data();

      // Sprawdzenie daty i reset liczników jeśli inny dzień
      const isStatsToday = isToday(data.dailyStats?.date);

      const dailyStats = isStatsToday
        ? data.dailyStats
        : {
            addCount: 0,
            drawCount: 0,
            date: new Date().toISOString(),
          };

      // Aktualizacja licznika w bazie jeśli resetujemy
      if (!isStatsToday) {
        await updateDoc(ref, { dailyStats });
      }

      setSpace({ id: snap.id, ...data, dailyStats });
      setLoading(false);

      // Sprawdzenie dostępności akcji
      setCanAdd(dailyStats.addCount < data.config.maxDailyAdd);
      setCanDraw(dailyStats.drawCount < data.config.maxDailyDraw);

      // Sprawdzenie czy są pytania
      const questionsSnap = await getDocs(collection(db, "spaces", uid, "questions"));
      setHasQuestions(questionsSnap.size > 0);
      setQuestionCount(questionsSnap.size);
    };

    load();
  }, [uid]);

  const handleAddQuestion = async () => {
    setError("");
    if (!newQuestion.trim()) {
      setError("Wpisz pytanie przed dodaniem.");
      return;
    }
    if (!canAdd) {
      setError("Osiągnięto dzienny limit dodawania pytań.");
      return;
    }

    const encryptedText = encrypt(newQuestion.trim());
    await addDoc(collection(db, "spaces", uid!, "questions"), {
      encryptedText,
    });

    const newAddCount = (space.dailyStats.addCount || 0) + 1;

    await updateDoc(doc(db, "spaces", uid!), {
      "dailyStats.addCount": newAddCount,
      "dailyStats.date": new Date().toISOString(),
    });

    setSpace((prev: any) => ({
      ...prev,
      dailyStats: {
        ...prev.dailyStats,
        addCount: newAddCount,
      },
    }));

    setNewQuestion("");
    setCanAdd(newAddCount < space.config.maxDailyAdd);

    // Sprawdzenie czy są pytania po dodaniu
    const questionsSnap = await getDocs(collection(db, "spaces", uid!, "questions"));
    setHasQuestions(questionsSnap.size > 0);
    setQuestionCount(questionsSnap.size);
  };

  const handleDrawQuestion = async () => {
    setError("");
    if (!canDraw) {
      setError("Osiągnięto dzienny limit losowań.");
      return;
    }

    const snapshot = await getDocs(collection(db, "spaces", uid!, "questions"));
    const all = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as QuestionData)
    }));

    if (all.length === 0) {
      setError("Przestrzeń nie posiada pytań.");
      return;
    }

    const random = all[Math.floor(Math.random() * all.length)];
    
    // Obsługa starego i nowego formatu
    let questionText: string;
    if (random.encryptedText) {
      questionText = decrypt(random.encryptedText);
    } else if (random.text) {
      questionText = random.text;
    } else {
      setError("Nieprawidłowy format pytania.");
      return;
    }

    await deleteDoc(doc(db, "spaces", uid!, "questions", random.id));

    const newDrawCount = (space.dailyStats.drawCount || 0) + 1;

    await updateDoc(doc(db, "spaces", uid!), {
      "dailyStats.drawCount": newDrawCount,
      "dailyStats.date": new Date().toISOString(),
    });

    setQuestion(questionText);

    setSpace((prev: any) => ({
      ...prev,
      dailyStats: {
        ...prev.dailyStats,
        drawCount: newDrawCount,
      },
    }));

    setCanDraw(newDrawCount < space.config.maxDailyDraw);

    // Sprawdzenie czy są jeszcze pytania po losowaniu
    const questionsSnap = await getDocs(collection(db, "spaces", uid!, "questions"));
    setHasQuestions(questionsSnap.size > 0);
    setQuestionCount(questionsSnap.size);
  };

  const handleDeleteSpace = async () => {
    const confirm = window.confirm(
      "Czy na pewno chcesz usunąć tę przestrzeń? To nieodwracalne."
    );
    if (!confirm) return;

    await deleteDoc(doc(db, "spaces", uid!));
    alert("Przestrzeń usunięta.");
    window.location.href = "/";
  };

  if (loading) return <div className="p-4 text-center">Ładowanie...</div>;
  if (error)
    return (
      <div className="p-4 text-center text-red-600 font-semibold">{error}</div>
    );
  if (!space) return null;

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center px-4">
      <div className="w-full bg-white rounded-2xl shadow-lg py-6 px-4 sm:px-6 text-center relative sm:min-w-[480px] md:max-w-md">
        <h1 className="text-2xl font-semibold text-blue-600 mb-2">AskMeEveryDay</h1>
        <h2 className="text-3xl font-semibold text-blue-700 mb-4">{space.name}</h2>
        <p className="text-center text-sm text-blue-400 mb-6">
          Kod przestrzeni: <span className="font-mono">{uid}</span>
        </p>
        {questionCount > 0 && (
          <p className="text-center text-sm text-gray-500 mb-4">
            Liczba pytań w bazie: {questionCount}
          </p>
        )}

        {question && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded text-center italic text-blue-800">
            {question}
          </div>
        )}

        {error && (
          <div className="mb-4 text-center text-red-600 font-semibold">{error}</div>
        )}

        <div className="mb-6 flex flex-col space-y-4">
          {hasQuestions ? (
            <button
              onClick={handleDrawQuestion}
              disabled={!canDraw}
              className={`w-full py-3 rounded-md font-semibold text-white transition
                ${canDraw ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}
            >
              {canDraw
                ? "Wylosuj pytanie"
                : `Dzienny limit losowań (${space.config.maxDailyDraw}) osiągnięty`}
            </button>
          ) : (
            <div className="w-full py-3 rounded-md px-4 bg-blue-100 text-blue-500 text-center font-semibold">
              Przestrzeń nie posiada więcej pytań.
            </div>
          )}

          {canAdd ? (
            <>
              <textarea
                placeholder="Dodaj nowe pytanie"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full border border-blue-300 rounded-md p-2 resize-none bg-blue-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
              />
              <button
                onClick={handleAddQuestion}
                className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Dodaj pytanie
              </button>
            </>
          ) : (
            <p className="text-center text-sm text-blue-500">
              Osiągnięto dzienny limit dodawania pytań ({space.config.maxDailyAdd})
            </p>
          )}
          <a
            href="/"
            className="inline-block text-blue-500 hover:underline text-sm"
          >
            Wróć do ekranu logowania
          </a>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-transparent shadow-none border-none text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              style={{ boxShadow: 'none', background: 'transparent' }}
              title="Opcje"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <circle cx="10" cy="4" r="1.5" />
                <circle cx="10" cy="10" r="1.5" />
                <circle cx="10" cy="16" r="1.5" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg z-10">
                <button
                  onClick={handleDeleteSpace}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-b-lg"
                  style={{ boxShadow: 'none', background: 'transparent' }}
                >
                  Usuń przestrzeń
                </button>
              </div>
            )}
          </div>
        </div>

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
