# ⚡ Pulse

Pulse is a lightweight **Markdown-based presentation tool** built with [Tauri](https://tauri.app/).  
It allows you to **turn your Markdown files into clean, interactive presentations** — fast, minimal, and cross-platform.

---

## 🚀 Features

- 📄 **Markdown support** → headings, lists, tables, images, and more  
- 🎨 **Basic styling** → clean and minimal slides, optimized for focus  
- 🖼️ **Image handling** → automatically resolves local image paths  
- ⌨️ **Keyboard navigation** → `←` and `→` arrows to switch between slides  
- 🕹️ **Presentation mode** → full-screen display with smooth transitions  
- 🏠 **Home screen & file selection** → open any `.md` file as a presentation  

---

## 📦 Installation

### Prerequisites
- [Rust](https://www.rust-lang.org/)  
- [Node.js](https://nodejs.org/)  

### Clone & Run
```bash
git clone https://github.com/YOUR_USERNAME/pulse.git
cd pulse
npm install
npm run tauri dev
```

If you get an error like: "Cannot find native binding. npm has a bug related to optional dependencies"

You must unninstall the npm nodes modules and packages-lock with this command:
`bash
rm -rf node_modules package-lock.json
`

Then install the dependaces:
`bash
npm install
`

Then launch another time the app with 
`bash
npm run tauri dev
`

⸻

🎯 Usage
	1.	Launch Pulse
	2.	Select a Markdown file (.md)
	3.	Present your slides using the arrow keys

Slide separation: use --- in your Markdown file to split slides.

Example:
```
# Welcome to Pulse
This is my first slide.

---

## Second Slide
- Point 1
- Point 2
```

⸻

🤝 Contributing

Contributions are welcome!
	•	Open an issue for bugs or feature requests
	•	Fork the repo and submit a pull request

⸻

📜 License

This project is licensed under the MIT License.
See the LICENSE file for details.

⸻

💡 Inspiration

Pulse is inspired by tools like Marp and Reveal.js,
but focuses on simplicity, speed, and a native desktop experience.
