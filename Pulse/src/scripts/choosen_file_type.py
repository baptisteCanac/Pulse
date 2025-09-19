import json

with open("../src/datas/data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

file_path = data['recent_files_paths'][0]

# Ouvrir le fichier en lecture
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()  # Lit tout le fichier dans une seule chaîne de caractères

lines = content.splitlines()

# On compte les lignes qui contiennent uniquement '---', éventuellement avec des espaces autour
count = sum(1 for line in lines if line.strip() == '---')

if count >= 2:
    print("presenter")
else:
    print("reader")