print("=== KALKULATOR KONVERSI SUHU ===")

celsius = float(input("Masukkan suhu dalam Celsius: "))
fahrenheit = celsius * 9 / 5 + 32
kelvin = celsius + 273.15

print("\n--- HASIL KONVERSI ---")
print(f"Celsius     : {celsius:.2f} derajat C")
print(f"Fahrenheit  : {fahrenheit:.2f} derajat F")
print(f"Kelvin      : {kelvin:.2f} K")
print(f"\nRumus: F = ({celsius:.2f} x 9/5) + 32 = {fahrenheit:.2f}")
print(f"       K = {celsius:.2f} + 273.15 = {kelvin:.2f}")