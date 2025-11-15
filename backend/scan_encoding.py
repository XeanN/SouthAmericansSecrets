import os

def is_utf8(path):
    try:
        with open(path, "rb") as f:
            f.read().decode("utf-8")
        return True
    except Exception as e:
        return False, str(e)

print("\n🔍 Escaneando archivos .py y .env...\n")

for root, dirs, files in os.walk("."):
    for file in files:
        if file.endswith(".py") or file.endswith(".env"):
            full_path = os.path.join(root, file)
            result = is_utf8(full_path)

            if result is True:
                continue
            else:
                print(f"❌ Archivo con error de codificación: {full_path}")
                print(f"   → ERROR: {result[1]}\n")
