import sys

format = sys.argv[1]
looper = sys.argv[2]
protect = sys.argv[3]
pageSize = sys.argv[4]
code = sys.argv[5]

print(f"""
format: {format},
looper: {looper},
protect: {protect},
pageSize: {pageSize},
code: {code}
""")

"""
format: 'HTMl' ou 'PDF': str
looper: false or true: bool,
protect: false or true: bool,
pageSize: 'A4': str
code: str
"""