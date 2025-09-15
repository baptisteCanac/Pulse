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