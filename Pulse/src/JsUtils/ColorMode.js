export default class ColorMode {
    constructor(type) {
        if (type === "index"){
            this.sidebar = document.querySelector("aside");
            this.footer = this.sidebar.querySelector("div.mt-6");
            this.mainCard = document.querySelector("main > div");
            this.button = document.getElementById("openFileButton");
        }else{
            console.log("coucou");
        }
    }

    lightMode() {
        document.getElementById("titleColorMode").innerText = "Dark mode";
        document.getElementById("emojiColorMode").innerText = "🌙";

        document.body.classList.remove("bg-gray-900", "text-white");
        document.body.classList.add("bg-white", "text-gray-900");

        this.sidebar.classList.remove("bg-gray-800");
        this.sidebar.classList.add("bg-gray-100");

        this.footer.classList.remove("text-gray-400");
        this.footer.classList.add("text-gray-600");

        this.mainCard.classList.remove("bg-gray-800");
        this.mainCard.classList.add("bg-gray-50");

        this.button.classList.remove("bg-blue-600");
        this.button.classList.add("bg-blue-500");

        // 🔥 Fichiers récents
        document.querySelectorAll(".recent-file").forEach(el => {
            el.classList.remove("bg-gray-700", "text-white");
            el.classList.add("bg-gray-200", "text-gray-900");
        });
    }

    darkMode() {
        document.getElementById("titleColorMode").innerText = "Light mode";
        document.getElementById("emojiColorMode").innerText = "☀️";

        document.body.classList.remove("bg-white", "text-gray-900");
        document.body.classList.add("bg-gray-900", "text-white");

        this.sidebar.classList.remove("bg-gray-100");
        this.sidebar.classList.add("bg-gray-800");

        this.footer.classList.remove("text-gray-600");
        this.footer.classList.add("text-gray-400");

        this.mainCard.classList.remove("bg-gray-50");
        this.mainCard.classList.add("bg-gray-800");

        this.button.classList.remove("bg-blue-500");
        this.button.classList.add("bg-blue-600");

        // 🔥 Fichiers récents
        document.querySelectorAll(".recent-file").forEach(el => {
            el.classList.remove("bg-gray-200", "text-gray-900");
            el.classList.add("bg-gray-700", "text-white");
        });
    }

    lightModePresentation() {
    // toggle class on body
    document.body.classList.add("presentation-light");
    document.body.classList.remove("presentation-dark");

    // remove existing dark presentation styles if present
    const darkStyle = document.getElementById("presentation-dark-styles");
    if (darkStyle) darkStyle.remove();

    // create or update the light style element
    let style = document.getElementById("presentation-light-styles");
    const css = `
/* Presentation light mode overrides */
body.presentation-light {
  background: #ffffff !important;
  color: #111827 !important; /* gray-900 */
}

/* sections inherit background and text color */
body.presentation-light section {
  background: transparent !important;
  color: inherit !important;
}

/* Headings */
body.presentation-light h1,
body.presentation-light h2,
body.presentation-light h3,
body.presentation-light h4,
body.presentation-light h5,
body.presentation-light h6 {
  color: #0f172a !important; /* a dark color for headings */
}

/* Paragraphs and lists */
body.presentation-light p,
body.presentation-light li {
  color: #0f172a !important;
}

/* Code blocks */
body.presentation-light code,
body.presentation-light pre {
  background: #f3f4f6 !important; /* gray-100 */
  color: #7b1e1b !important; /* warm color for code text */
  border-radius: 6px;
}

/* Tables */
body.presentation-light table {
  background: #f8fafc !important; /* very light */
  color: #0f172a !important;
  border-radius: 8px;
  overflow: hidden;
}

body.presentation-light th {
  background: #e6e9ee !important; /* light header */
  color: #0f172a !important;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0 !important;
}

body.presentation-light td {
  background: #ffffff !important;
  color: #0f172a !important;
  border-bottom: 1px solid #eef2f6 !important;
}

body.presentation-light tr:nth-child(even) td {
  background: #fbfdff !important;
}

/* hr */
body.presentation-light hr {
  border-top: 2px solid #e6e9ee !important;
}

body.presentation-light hr::after {
  color: #6b7280 !important; /* gray-500 */
}

/* Images */
body.presentation-light section img {
  box-shadow: 0 6px 18px rgba(16,24,40,0.06) !important;
}

/* Keep presentation navigation classes unchanged */
body.presentation-light .hidden { display: none !important; }
body.presentation-light .active { display: flex !important; }
`;

    if (!style) {
      style = document.createElement("style");
      style.id = "presentation-light-styles";
      style.textContent = css;
      document.head.appendChild(style);
    } else {
      style.textContent = css; // update if exists
    }
  }
    
}