import sys
from pathlib import Path
import webbrowser
import pyzipper
import tkinter as tk
from tkinter import filedialog, Tk, simpledialog
from pathlib import Path
import pexpect

if __name__ == "__main__":
    format = 'html'
    looper = True
    protect = True
    pageSize = 'A4'
    code = r"""
<h1>🎉 bienvenue sur Pulse</h1>

<strong>Pulse simplifie la création et l'affichage de présentations Markdown (Marp)</strong>
pour les conférenciers et formateurs.

---

<h2>🎯 Pourquoi Pulse ?</h2>

<ul><li>Écrire vos slides directement dans un éditeur Markdown  </li><li>Visualiser vos présentations <strong>en temps réel</strong>  </li><li>Design moderne et épuré sans effort  </li><li>Réduire le temps de préparation pour les conférences  </li></ul>
---

<h2>✨ Fonctionnalités clés</h2>

1. <strong>Édition simple</strong>
<ul><ul><li>Tapez vos slides comme du texte  </li><li>Utilisez des titres, listes, tableaux et code facilement  </li></ul></ul>
2. <strong>Affichage instantané</strong>
<ul><ul><li>Pulse transforme votre Markdown en présentation interactive  </li><li>Aucun paramétrage complexe nécessaire  </li></ul></ul>
3. <strong>Support complet Marp</strong>
<ul><ul><li>Thèmes, couleurs, images et code intégré  </li><li>Pagination automatique  </li></ul></ul>
4. <strong>Support complet de mermaid</strong>
<ul><ul><li>Diagrames</li><li>Pagination automatique  </li></ul></ul>
---

<h2>💻 Exemple d’utilisation</h2>

<span class="quote">Avec Pulse, cette simple syntaxe devient <strong>une présentation professionnelle</strong>.</span>

---

<h2>🌟 Avantages pour le conférencier</h2>

<ul class="bullet-list">
<li>Plus besoin de PowerPoint ou Keynote</li>
<li>Tout est <strong>dans le Markdown</strong></li>
<li>Facile à modifier même en dernière minute</li>
<li>Compatible multi-plateformes (Windows, Mac, Linux)</li>
</ul>
---

<h2>🚀 Pulse en action</h2>

<ul class="bullet-list">
<li>Ouvrez votre fichier <span class="inline-code">.md</span></li>
<li>Modifiez vos slides directement dans l’éditeur</li>
<li>Affichez la présentation en <strong>plein écran avec Pulse</strong></li>
<li>Ajoutez vos notes, images et code en quelques secondes</li>
</ul>
---

<h2>Exemple de code python</h2>

<pre><code class="language-python">def bonjour(nom: str) -&gt; str:
   return f"Bonjour {nom}"
</code></pre>

<h2>Exemple de code javascript</h2>
<pre><code class="language-javascript">function bonjour(nom) {
    return <span class="inline-code">Bonjour ${nom}</span>;
}
</code></pre>
---

<h2>🖋️ Exemple de diagramme Mermaid</h2>

<pre class="mermaid">graph TD
    A[Début] --> B{Choix ?}
    B -->|Oui| C[Action 1]
    B -->|Non| D[Action 2]
    C --> E[Fin]
    D --> E[Fin]</pre>

<span class="quote">Avec Pulse, vous pouvez intégrer facilement des diagrammes Mermaid directement dans vos présentations Markdown !</span>

---

<h2>Exemple de formule LateX</h2>


<span class="math-display" data-latex="\int_0^\infty e^{-x}\, dx = 1"></span>

---

<span class="math-display" data-latex="\frac{d}{dx} \Big( \sin(x) \Big) = \cos(x)"></span>

---


<h2>🎉 Conclusion</h2>

Pulse rend la création de présentations :

<ul class="bullet-list">
<li>Simple</li>
<li>Rapide</li>
<li>Accessible à tous</li>
<li>Et surtout <strong>agréable pour le conférencier</strong></li>
</ul>
<span class="quote">Fini le stress des logiciels complexes, place à la fluidité et à l’efficacité !</span>

"""
    if format == "html":
        def getCssPresentationCode():
            # lire_css.py
            with open("../stylesheets/style_presentation.css", "r", encoding="utf-8") as f:
                contenu = f.read()

            with open("../stylesheets/presentation.css", "r", encoding="utf-8") as f:
                contenu2 = f.read()

            return contenu + contenu2 # affiche le CSS

        def getColorMode():
            with open("../js/lib/ColorMode.js", "r", encoding="UTF-8") as f:
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

        else:
            webbrowser.open(out.resolve().as_uri())
    elif format == "pdf":
        print("format pdf pas encore développé")

else:
    format = sys.argv[1]
    looper = sys.argv[2]
    protect = sys.argv[3]
    pageSize = sys.argv[4]
    code = sys.argv[5]