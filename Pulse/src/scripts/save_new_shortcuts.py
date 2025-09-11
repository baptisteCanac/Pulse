import sys
import json
from pathlib import Path

# Récupération des arguments
home = sys.argv[1]
open_overlay = sys.argv[2]

# Chemin vers le JSON
json_path = Path("../src/datas/data.json")

# Lire le JSON existant
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Mise à jour des raccourcis
if "shortcuts" not in data:
    data["shortcuts"] = {}

data["shortcuts"]["go_home"] = home
data["shortcuts"]["open_overlay"] = open_overlay

# Réécrire dans le fichier
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Ok")