"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// --- Types ---
interface Pomp {
  id: string | number;
  naam: string;
  status: string;
}

export default function Home() {
  const router = useRouter();

  // --- State ---
  const [pompen, setPompen] = useState<Pomp[]>([]);
  const [isAanHetLaden, setIsAanHetLaden] = useState<boolean>(true);
  const [foutmelding, setFoutmelding] = useState<string | null>(null);

  // --- Data Ophalen ---
  useEffect(() => {
    const haalPompenOp = async () => {
      try {
        // PAS OP: Vervang dit door je eigen IP
        const response = await fetch("http://192.168.x.x/api/pompen.php");

        if (!response.ok) {
          throw new Error("Kon de data niet ophalen");
        }

        const data = (await response.json()) as Pomp[];
        setPompen(data);
      } catch (error) {
        console.error("Fout bij ophalen:", error);
        setFoutmelding("Kan geen verbinding maken met de Pi.");
      } finally {
        setIsAanHetLaden(false);
      }
    };

    haalPompenOp();
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  // --- Statistieken ---
  const totaalAantal = pompen.length;
  const aantalAan = pompen.filter((p) => p.status.toLowerCase() === "aan").length;
  const aantalUit = totaalAantal - aantalAan;

  // --- Kleuren ---
  const colors = {
    primaryPink: "#d6006e",
    darkBlue: "#0f172a",
    textDark: "#333",
    textLight: "#666",
  };

  return (
    <>
      {/* HIERONDER STAAT DE CSS (STIJL)
         Dit zorgt ervoor dat de layout verandert op mobiel.
      */}
      <style jsx global>{`
        body { margin: 0; padding: 0; font-family: sans-serif; background-color: ${colors.primaryPink}; }
        
        .layout-container {
          display: flex;
          padding: 20px;
          gap: 20px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        /* De Sidebar (Menu) */
        .sidebar {
          width: 250px;
          flex-shrink: 0;
        }

        /* De Statistiek Tegels */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        /* --- MOBIELE AANPASSINGEN --- */
        @media (max-width: 768px) {
          .layout-container {
            flex-direction: column; /* Alles onder elkaar zetten */
            padding: 10px;
          }
          .sidebar {
            width: 100%; /* Sidebar breed maken */
            margin-bottom: 10px;
          }
          .stats-grid {
             grid-template-columns: 1fr; /* Tegels onder elkaar op mobiel */
          }
        }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        
        {/* 1. Witte Topbalk */}
        <header style={{ backgroundColor: "white", padding: "10px 20px", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", width: "36px", height: "36px", gap: "2px" }}>
               <div style={{ backgroundColor: colors.primaryPink, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "10px" }}>A</div>
               <div style={{ backgroundColor: "#bccf00", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "10px" }}>S</div>
               <div style={{ backgroundColor: "#bccf00", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "10px" }}>V</div>
               <div style={{ backgroundColor: colors.primaryPink, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "10px" }}>Z</div>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "16px", color: colors.textDark }}>Sondedashboard</h2>
            </div>
        </header>

        {/* 2. Main Layout (Gebruikt nu CSS klassen voor responsiveness) */}
        <div className="layout-container">
          
          {/* SIDEBAR */}
          <aside className="sidebar" style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px", height: "fit-content" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: colors.textDark }}>Menu</h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ backgroundColor: colors.darkBlue, color: "white", padding: "10px 15px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px" }}>
                Overzicht Pompen
              </div>
              <button onClick={logout} style={{ textAlign: "left", backgroundColor: "transparent", border: "none", color: "#d60000", padding: "10px 15px", marginTop: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
                Uitloggen
              </button>
            </nav>
          </aside>

          {/* CONTENT */}
          <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>
            
            {/* Statistiek Tegels */}
            <div className="stats-grid">
              <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px" }}>
                <span style={{ display: "block", color: colors.textLight, fontSize: "12px" }}>Totaal</span>
                <strong style={{ fontSize: "24px", color: colors.textDark }}>{totaalAantal}</strong>
              </div>
              <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px" }}>
                <span style={{ display: "block", color: colors.textLight, fontSize: "12px" }}>Actief</span>
                <strong style={{ fontSize: "24px", color: "#00a884" }}>{aantalAan}</strong>
              </div>
              <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px" }}>
                <span style={{ display: "block", color: colors.textLight, fontSize: "12px" }}>In Rust</span>
                <strong style={{ fontSize: "24px", color: colors.textLight }}>{aantalUit}</strong>
              </div>
            </div>

            {/* De Lijst met Pompen */}
            <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "18px" }}>Pomp status</h3>
              </div>

              {isAanHetLaden && <p>Laden...</p>}
              {foutmelding && <p style={{ color: "red" }}>{foutmelding}</p>}

              {!isAanHetLaden && !foutmelding && (
                // WRAPPER VOOR HORIZONTAAL SCROLLEN OP TELEFOON
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "500px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #eee" }}>
                        <th style={{ padding: "10px", color: colors.textLight, fontSize: "12px" }}>NAAM</th>
                        <th style={{ padding: "10px", color: colors.textLight, fontSize: "12px" }}>ID</th>
                        <th style={{ padding: "10px", color: colors.textLight, fontSize: "12px" }}>STATUS</th>
                        <th style={{ padding: "10px", textAlign: "right", color: colors.textLight, fontSize: "12px" }}>ACTIE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pompen.map((pomp) => (
                        <tr key={pomp.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                          <td style={{ padding: "12px 10px", fontWeight: "bold", fontSize: "14px" }}>{pomp.naam}</td>
                          <td style={{ padding: "12px 10px", color: colors.textLight, fontSize: "14px" }}>{pomp.id}</td>
                          <td style={{ padding: "12px 10px" }}>
                            <span style={{ 
                              padding: "4px 8px", 
                              borderRadius: "15px", 
                              fontSize: "11px", 
                              fontWeight: "bold",
                              whiteSpace: "nowrap", // Voorkomt dat tekst breekt
                              backgroundColor: pomp.status === "Aan" ? "#e6fffa" : "#f3f4f6",
                              color: pomp.status === "Aan" ? "#00a884" : "#6b7280"
                            }}>
                              {pomp.status}
                            </span>
                          </td>
                          <td style={{ padding: "12px 10px", textAlign: "right", color: colors.primaryPink, fontSize: "13px", fontWeight: "bold" }}>
                            Bekijk
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}