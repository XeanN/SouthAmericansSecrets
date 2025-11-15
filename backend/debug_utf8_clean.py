import os

ROOT = os.path.abspath(".")

def scan_files():
    for root, dirs, files in os.walk(ROOT):
        # ignorar completamente el venv
        if ".venv" in root:
            continue

        for file in files:
            if not file.endswith(".py"):
                continue  # solo código Python tuyo

            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    f.read()
            except Exception as e:
                print(f"❌ ERROR EN: {path}")
                print(f"   → {e}")

scan_files()
