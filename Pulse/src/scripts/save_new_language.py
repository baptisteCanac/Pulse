import sys
import json

choosen_language = sys.argv[1]
json_path = "../src/datas/languages.json"

with open(json_path, "r", encoding="utf-8") as file:
    data = json.load(file)

# 2. Modifier la valeur souhaitée
data["choosen_language"] = int(choosen_language)  # par exemple, changer à 0

# 3. Écrire à nouveau dans le fichier JSON
with open(json_path, "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print("Ok")