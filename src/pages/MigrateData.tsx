import { useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { encrypt } from "../utils/encryption";

export default function MigrateData() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    spacesProcessed: 0,
    questionsFound: 0,
    questionsMigrated: 0,
  });

  const handleMigrate = async () => {
    setIsLoading(true);
    setError("");
    setProgress("Rozpoczynam migrację...");
    setStats({ spacesProcessed: 0, questionsFound: 0, questionsMigrated: 0 });

    try {
      // Pobierz wszystkie przestrzenie
      const spacesSnapshot = await getDocs(collection(db, "spaces"));
      const spaces = spacesSnapshot.docs;
      setStats(prev => ({ ...prev, spacesProcessed: spaces.length }));

      let totalQuestionsFound = 0;
      let totalQuestionsMigrated = 0;

      // Przetwórz każdą przestrzeń
      for (const spaceDoc of spaces) {
        setProgress(`Przetwarzanie przestrzeni ${spaceDoc.id}...`);
        
        // Pobierz wszystkie pytania dla tej przestrzeni
        const questionsSnapshot = await getDocs(collection(db, `spaces/${spaceDoc.id}/questions`));
        const questions = questionsSnapshot.docs;
        totalQuestionsFound += questions.length;
        setStats(prev => ({ ...prev, questionsFound: totalQuestionsFound }));

        // Przetwórz każde pytanie
        for (const questionDoc of questions) {
          const questionData = questionDoc.data();
          
          // Sprawdź czy pytanie ma pole text ale nie ma encryptedText
          if (questionData.text && !questionData.encryptedText) {
            try {
              // Szyfruj tekst
              const encryptedText = encrypt(questionData.text);
              
              // Aktualizuj dokument
              await updateDoc(doc(db, `spaces/${spaceDoc.id}/questions/${questionDoc.id}`), {
                encryptedText,
              });
              
              totalQuestionsMigrated++;
              setStats(prev => ({ ...prev, questionsMigrated: totalQuestionsMigrated }));
            } catch (err) {
              console.error(`Błąd podczas szyfrowania pytania ${questionDoc.id}:`, err);
              setError(`Błąd podczas szyfrowania pytania ${questionDoc.id}`);
            }
          }
        }
      }

      setProgress("Migracja zakończona!");
    } catch (err) {
      console.error("Błąd podczas migracji:", err);
      setError("Wystąpił błąd podczas migracji");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Migracja Danych</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Ten narzędzie szyfruje wszystkie nieszyfrowane pytania w bazie danych.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {progress && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
              {progress}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-2">Statystyki:</h2>
            <ul className="space-y-1">
              <li>Przetworzone przestrzenie: {stats.spacesProcessed}</li>
              <li>Znalezione pytania: {stats.questionsFound}</li>
              <li>Zaszyfrowane pytania: {stats.questionsMigrated}</li>
            </ul>
          </div>

          <button
            onClick={handleMigrate}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Migracja w toku..." : "Rozpocznij migrację"}
          </button>
        </div>
      </div>
    </div>
  );
} 