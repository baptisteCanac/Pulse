import sys
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, Tk, simpledialog
import pexpect

format = sys.argv[1]
looper = sys.argv[2].lower() in ("true", "1", "yes", "on")
protect = sys.argv[3].lower() in ("true", "1", "yes", "on")
pageSize = sys.argv[4]
code = sys.stdin.read()

if format == "html":
    def getCssPresentationCode():
        # lire_css.py
        with open("../src/stylesheets/style_presentation.css", "r", encoding="utf-8") as f:
            contenu = f.read()

        with open("../src/stylesheets/presentation.css", "r", encoding="utf-8") as f:
            contenu2 = f.read()

        return contenu + contenu2 # affiche le CSS

    def getColorMode():
        with open("../src/js/lib/ColorMode.js", "r", encoding="UTF-8") as f:
            contenu = f.read()

        return contenu
        
    def wrap_sections(content: str) -> tuple[str, list[str]]:
        """
        Transforme un texte contenant des séparateurs '---'
        en blocs <section>...</section>.
            
        Retourne un tuple :
        - wrapped : le contenu HTML complet avec toutes les sections concaténées
        - parts   : la liste de chaque section (déjà emballée)
        """
        raw_parts = [p.strip() for p in content.split('---') if p.strip()]
        parts = [f"<section style='display:none'>\n{p}\n</section>" for p in raw_parts]
        wrapped = "\n".join(parts)
            
        return wrapped, parts


    code, parts = wrap_sections(code)
    cssCode = getCssPresentationCode()
    ColorModeCode = getColorMode()

    htmlCode = f"""
<!DOCTYPE html>
<html>
    <head>
        <link href="https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
        <script type='module'>
        {ColorModeCode}

        const colorMode = new ColorMode("presentation");
        colorMode.lightModePresentation();

        let currentSlide = 0;
        let i = 0;

        const parts = {parts};
        console.log(parts.length);

        function showCurrentSlide(index){{
            const sections = document.querySelectorAll('section');
            sections.forEach((element, i) => {{
                element.style.display = (i === index) ? 'flex' : 'none';
            }});
        }};

        document.addEventListener("keydown", event => {{
            if (event.key === "ArrowLeft") goToPreviousSlide();
            if (event.key === "ArrowRight") goToNextSlide();
        }});

        {"""function goToPreviousSlide() {{
            console.log('previous');
            if (currentSlide > 0) {{
                currentSlide--;
            }} else {{
                currentSlide = parts.length - 1;
            }}
            showCurrentSlide(currentSlide);
        }};""" if looper else """function goToPreviousSlide() {{
            console.log('previous');
            if (currentSlide > 0) {{
                currentSlide--;
                showCurrentSlide(currentSlide);
            }}
        }};"""}

        {"""function goToNextSlide() {{
            console.log('next');
            if (currentSlide < parts.length - 1) {{
                currentSlide++;
            }} else {{
                currentSlide = 0;
            }}
            showCurrentSlide(currentSlide);
        }};""" if looper else """function goToNextSlide() {{
            console.log('next');
            if (currentSlide < parts.length -1) {{
                currentSlide++;
                showCurrentSlide(currentSlide);
            }}
        }};"""}

        showCurrentSlide(currentSlide);

        Prism.highlightAll();

        document.querySelectorAll('.math-display').forEach(el => {{
    katex.render(el.dataset.latex, el, {{
        throwOnError: false,
        displayMode: true
    }});
}});

        </script>
        <meta charset='UTF-8'>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pulse</title>
        <style>
        {cssCode}
        </style>
    </head>
    <body class='presentation-light'>
        <script src="https://cdn.jsdelivr.net/npm/prismjs/prism.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/prismjs/components/prism-python.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/prismjs/components/prism-javascript.min.js"></script>
        
        {code}
    </body>
</html
        """

    out = Path("test.html")
    out.write_text(htmlCode, encoding="utf-8")

    if protect:
        def ask_save_file(default_name="secret.zip", filetypes=(("Archive ZIP", "*.zip"), ("Tous les fichiers", "*.*"))):
            root = tk.Tk()
            root.withdraw()  # cacher la fenêtre principale

            # ouvrir la popup "Enregistrer sous"
            filepath = filedialog.asksaveasfilename(
                defaultextension=".zip",
                initialfile=default_name,
                filetypes=filetypes,
                title="Enregistrer l’archive ZIP"
            )

            root.destroy()
            return Path(filepath) if filepath else None

        root = Tk()
        root.withdraw()
        zip_path = filedialog.asksaveasfilename(
            defaultextension=".zip",
            initialfile="secret.zip",
            filetypes=[("Archive ZIP", "*.zip"), ("Tous les fichiers", "*.*")]
        )
        root.destroy()

        if zip_path:
            password = simpledialog.askstring("Mot de passe", "Entrez le mot de passe :", show="*")

            def zip_with_password(zip_file, file_to_add, password):
                cmd = f"zip -er {zip_file} {file_to_add}"
                child = pexpect.spawn(cmd)

                child.expect("password:")
                child.sendline(password)
                child.expect("password:")
                child.sendline(password)
                child.expect(pexpect.EOF)
                child.close()

                print(f"Archive créée : {zip_file}")

            zip_with_password(zip_path, "test.html", password)
elif format == "pdf":
    print("format pdf pas encore développé")

print(str(out.resolve()), flush=True)