import sys

if len(sys.argv) < 2:
    print("Erreur : pas de chemin fourni")
    sys.exit(1)

path = sys.argv[1]

# Lire le texte depuis stdin
text = sys.stdin.read()

# Écrire le texte dans le fichier
with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print(f"Fichier sauvegardé : {path}")
