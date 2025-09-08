import sys
from tkinter import Tk
from tkinter.filedialog import asksaveasfilename

# Masquer la fenêtre principale Tkinter
Tk().withdraw()

# Boîte de dialogue pour choisir le chemin et le nom du fichier
file_path = asksaveasfilename(
    title="Enregistrer le nouveau fichier",
    defaultextension=".txt",   # extension par défaut
    filetypes=[("All Files", "*.*"), ("Text Files", "*.txt")]
)

if not file_path:
    print("Aucun fichier choisi")
    sys.exit(1)

# Lire le texte depuis stdin
text = sys.stdin.read()

# Écrire le texte dans le nouveau fichier
with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print(file_path)  # renvoyer le chemin complet au frontend
