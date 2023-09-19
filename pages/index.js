import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { connectionsNMock, livesMock, wordsMock } from "../mock";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function Home() {
  const [lives, setLives] = useState(0);
  const [words, setWords] = useState([]);
  const [selecteds, setSelecteds] = useState([]);
  const [corrects, setCorrects] = useState([]);
  const [results, setResults] = useState([]);
  const [connectionsN, setConnectionsN] = useState([]);
  const [shake, setShake] = useState(false);
  const notify = () => toast("Copied results to clipboard!");

  useEffect(() => {
    fetchData();
    setTimeout(() => {
      const settings = JSON.parse(localStorage.getItem("settings") || "{}");
      if (settings && settings.day === obterDataFormatada()) {
        const { words, corrects, results, lives } = settings;
        setWords(words);
        setCorrects(corrects);
        setResults(results);
        setLives(lives);
      }
    }, 1000);
  }, []);

  function obterDataFormatada() {
    const dataAtual = new Date();

    const dia = String(dataAtual.getDate()).padStart(2, "0");
    const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
    const ano = dataAtual.getFullYear();

    return `${dia}-${mes}-${ano}`;
  }

  function fetchData() {
    setWords(wordsMock);
    setLives(livesMock);
    setConnectionsN(connectionsNMock);
  }

  const isSelected = (word) => {
    return selecteds.filter((s) => s.term === word.term)?.length;
  };

  const handleClickWord = (word) => {
    let newSelecteds;
    if (isSelected(word)) {
      newSelecteds = selecteds.filter((s) => s.term !== word.term);
    } else {
      if (selecteds.length === 4) return;
      newSelecteds = [...selecteds, word];
    }
    setSelecteds(newSelecteds);
  };

  const submit = () => {
    if (selecteds.length < 4) return;
    const firstCategory = selecteds[0].category;
    const allTheSame = selecteds.every((s) => s.category === firstCategory);
    let newCorrects = corrects;
    let newWords = words;
    let newLives = lives;
    if (allTheSame) {
      newCorrects = [...corrects, selecteds];
      setCorrects(newCorrects);
      newWords = words.filter((w) => !selecteds.find((s) => s.term === w.term));
      setWords(newWords);
      setSelecteds([]);
    } else {
      newLives = lives - 1;
      setLives(newLives);
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 1000);
    }
    const newResults = [...results, selecteds];
    setResults(newResults);
    const settings = {
      words: newWords,
      corrects: newCorrects,
      results: newResults,
      lives: newLives,
      day: obterDataFormatada(),
    };
    localStorage.setItem("settings", JSON.stringify(settings));
  };

  const share = () => {
    const copyText = document.getElementById("results").outerText;
    navigator.clipboard.writeText(copyText.replaceAll("\n\n", "\n"));
    notify();
  };

  const getColor = (color) => {
    switch (color) {
      case "yellow":
        return "🟨";
      case "green":
        return "🟩";
      case "blue":
        return "🟦";
      case "red":
      default:
        return "🟥";
    }
  };

  const clear = () => {
    setSelecteds([]);
  };

  return (
    <div className={styles.container}>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <Head>
        <title>Connections in Portuguese</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Welcome to Connections in Portuguese!</h1>

        <div className={styles.correctSection}>
          {corrects.map((c) => (
            <div
              key={c[0].category}
              className={`${styles.correctItem} ${styles[c[0].color]}`}
            >
              <span className={styles.correctTitle}>{c[0].category}</span>
              <div className={styles.correctTermsList}>
                {c.map((w) => (
                  <span key={w.term} className={styles.correctTerm}>
                    {w.term}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          {words.map((word) => (
            <span
              key={word.term}
              onClick={() => handleClickWord(word)}
              className={`${styles.card} ${
                isSelected(word) ? styles.selected : {}
              } ${isSelected(word) && shake ? styles.shake : {}}`}
            >
              {word.term}
            </span>
          ))}
        </div>

        {lives === 0 || words.length === 0 ? (
          <div className={styles.resultsContainer}>
            <div id="results" className={styles.results}>
              {words.length === 0 ? (
                <span className={styles.resultsHeader}>
                  Portuguese Connection #{connectionsN}
                </span>
              ) : (
                <span className={styles.resultsHeader}>
                  Portuguese Connection #{connectionsN}
                </span>
              )}
              {results.map((t, i) => (
                <p className={styles.resultsLine} key={i}>
                  {t.map((r, id) => getColor(r.color))}
                </p>
              ))}
            </div>
            <div onClick={share} className={styles.button}>
              Share
            </div>
          </div>
        ) : (
          <div>
            <span>Lives {Array.from(Array(lives)).map(() => "❤️")}</span>
            <div className={styles.buttonGroup}>
              <button
                onClick={submit}
                disabled={selecteds.length < 4}
                className={styles.button}
              >
                Submit
              </button>
              <button
                onClick={clear}
                disabled={selecteds.length === 0}
                className={styles.button}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </main>

      <footer>
        <span>Powered by Paulo</span>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
