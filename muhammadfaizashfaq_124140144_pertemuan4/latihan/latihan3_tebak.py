angka_rahasia = 7
percobaan = 0

print("=== GAME TEBAK ANGKA RAHASIA ===")
print("Saya menyimpan satu angka rahasia. Coba tebak!")

while True:
    tebakan = int(input("Tebak angka: "))
    percobaan += 1

    if tebakan < angka_rahasia:
        print("Terlalu kecil!")
    elif tebakan > angka_rahasia:
        print("Terlalu besar!")
    else:
        print("Selamat, tebakan benar!")
        print(f"Kamu berhasil menebak dalam {percobaan} percobaan.")
        break