# debug_utf8.py
import os

def scan_files():
    print("🔍 ESCANEANDO ARCHIVOS EN BUSCA DE ENCODING INVALIDO...\n")
    for root, dirs, files in os.walk("."):
        for filename in files:
            path = os.path.join(root, filename)
            
            try:
                with open(path, "r", encoding="utf-8") as f:
                    f.read()
            except UnicodeDecodeError as e:
                print(f"❌ ERROR UTF-8 en: {path}")
                print(f"   → detalle: {e}")
            except:
                pass

if __name__ == "__main__":
    scan_files()
