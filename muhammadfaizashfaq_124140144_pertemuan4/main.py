import math_operations

from math_operations import celsius_ke_fahrenheit, celsius_ke_kelvin

print("=" * 60)
print("PROGRAM MODUL MATEMATIKA - PERTEMUAN 4")
print("=" * 60)

print("\n--- 1. PERSEGI ---")
print(f"{'Sisi':>8}{'Luas':>12}{'Keliling':>12}")
print("-" * 32)

for sisi in (5, 10):
    luas = math_operations.luas_persegi(sisi)
    keliling = math_operations.keliling_persegi(sisi)
    print(f"{sisi:>8.2f}{luas:>12.2f}{keliling:>12.2f}")

print("\n--- 2. PERSEGI PANJANG ---")
print(f"{'Panjang':>8}{'Lebar':>8}{'Luas':>12}{'Keliling':>12}")
print("-" * 40)

for panjang, lebar in [(8, 4), (12, 5)]:
    luas = math_operations.luas_persegi_panjang(panjang, lebar)
    keliling = math_operations.keliling_persegi_panjang(panjang, lebar)
    print(f"{panjang:>8.2f}{lebar:>8.2f}{luas:>12.2f}{keliling:>12.2f}")

print("\n--- 3. LINGKARAN ---")
print(f"Konstanta PI = {math_operations.PI}")
print(f"{'Jari-jari':>10}{'Luas':>12}{'Keliling':>12}")
print("-" * 34)

for jari_jari in (7, 10):
    luas = math_operations.luas_lingkaran(jari_jari)
    keliling = math_operations.keliling_lingkaran(jari_jari)
    print(f"{jari_jari:>10.2f}{luas:>12.2f}{keliling:>12.2f}")

print("\n--- 4. KONVERSI SUHU ---")
print(f"{'Celsius':>10}{'Fahrenheit':>14}{'Kelvin':>12}")
print("-" * 36)

for celsius in (0, 25, 100):
    fahrenheit = celsius_ke_fahrenheit(celsius)
    kelvin = celsius_ke_kelvin(celsius)
    print(f"{celsius:>10.2f}{fahrenheit:>14.2f}{kelvin:>12.2f}")

print("\nSelesai.")