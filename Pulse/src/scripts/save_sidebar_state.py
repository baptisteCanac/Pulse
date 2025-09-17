import sys
import json

check = sys.argv[1]
check_bool = check.lower() == "true"

json_path = "../src/datas/data.json"

with open(json_path, "r", encoding="utf-8") as file:
    data = json.load(file)

# 2. Modifier la valeur souhaitée
data["sidebar_opened"] = check_bool  # par exemple, changer à 0

# 3. Écrire à nouveau dans le fichier JSON
with open(json_path, "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print("Ok")