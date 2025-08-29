import sys
import os
import json
import subprocess

lib_path = os.getcwd()
print(lib_path)

file_path = sys.argv[1]
file_name = os.path.basename(file_path)

def add_recent_file(json_file_path, new_path, new_title):
    """
    Ajoute un fichier récent en tête des listes en supprimant la dernière ligne.
    
    :param json_file_path: chemin vers le fichier JSON
    :param new_path: chemin du fichier à ajouter
    :param new_title: titre du fichier à ajouter
    """
    # Lire le fichier JSON
    with open(json_file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Supprimer le dernier élément de chaque liste
    if data.get("recent_files_paths"):
        data["recent_files_paths"].pop()
    if data.get("recent_files_titles"):
        data["recent_files_titles"].pop()

    # Ajouter le nouveau fichier en premier
    data["recent_files_paths"].insert(0, new_path)
    data["recent_files_titles"].insert(0, new_title)

    # Écrire le JSON mis à jour
    with open(json_file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# Exemple d'utilisation
try: 
    add_recent_file(
        "../src/datas/data.json",
        file_path,
        file_name
    )
    print("ajout du nouveau fichier dans le json")
except:
    print("Erreur")