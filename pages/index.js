import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

const wordsMock = [
  {
    term: "Cavalo",
    category: "Farm Animals",
    color: "red",
  },
  {
    term: "Panela",
    category: "Kitchen Tools",
    color: "blue",
  },
  {
    term: "Rosa",
    category: "Colors",
    color: "yellow",
  },
  {
    term: "Azul",
    category: "Colors",
    color: "yellow",
  },
  {
    term: "Prato",
    category: "Kitchen Tools",
    color: "blue",
  },
  {
    term: "Morango",
    category: "Fruits",
    color: "green",
  },
  {
    term: "Melancia",
    category: "Fruits",
    color: "green",
  },
  {
    term: "Copo",
    category: "Kitchen Tools",
    color: "blue",
  },
  {
    term: "Abacate",
    category: "Fruits",
    color: "green",
  },
  {
    term: "Vinho",
    category: "Colors",
    color: "yellow",
  },
  {
    term: "Ovelha",
    category: "Farm Animals",
    color: "red",
  },
  {
    term: "Vaca",
    category: "Farm Animals",
    color: "red",
  },
  {
    term: "Limão",
    category: "Fruits",
    color: "green",
  },
  {
    term: "Porco",
    category: "Farm Animals",
    color: "red",
  },
  {
    term: "Laranja",
    category: "Colors",
    color: "yellow",
  },
  {
    term: "Faca",
    category: "Kitchen Tools",
    color: "blue",
  },
];

export default function Home() {
  const [lives, setLives] = useState(0);
  const [words, setWords] = useState([]);
  const [selecteds, setSelecteds] = useState([]);
  const [corrects, setCorrects] = useState([]);
  const [results, setResults] = useState([]);
  const [connectionsN, setConnectionsN] = useState([]);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    setWords(wordsMock);
    setLives(4);
    setConnectionsN(1);
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
    if (allTheSame) {
      setCorrects([...corrects, firstCategory]);
      const newWords = words.filter(
        (w) => !selecteds.find((s) => s.term === w.term)
      );
      setWords(newWords);
      setSelecteds([]);
    } else {
      setLives(lives - 1);
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 1000);
    }
    setResults([...results, selecteds]);
  };

  const share = () => {
    const copyText = document.getElementById("results").outerText;
    navigator.clipboard.writeText(copyText.replaceAll("\n\n", "\n"));
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Connections in Portuguese</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Welcome to Connections in Portuguese!</h1>

        {lives === 0 || words.length === 0 ? (
          <p className={styles.description}>
            Don't be affraid, let's try it out!
          </p>
        ) : null}

        <div>Corrects: {corrects.join(" - ")}</div>

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
                  Hey congrats!!! You made it!.
                  <br />
                  Connection #{connectionsN}
                </span>
              ) : (
                <span className={styles.resultsHeader}>
                  Hey sorry, try it again.
                  <br />
                  Connection #{connectionsN}
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
              <div onClick={submit} className={styles.button}>
                Submit
              </div>
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
