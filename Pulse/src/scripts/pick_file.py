import tkinter as tk
from tkinter import filedialog

root = tk.Tk()
root.withdraw()  # ne pas afficher la fenêtre principale
file_path = filedialog.askopenfilename()
print(file_path)