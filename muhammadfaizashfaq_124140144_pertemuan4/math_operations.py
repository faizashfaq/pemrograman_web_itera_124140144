PI = 3.14159


def luas_persegi(sisi: float) -> float:
    return sisi * sisi


def keliling_persegi(sisi: float) -> float:
    return 4 * sisi


def luas_persegi_panjang(panjang: float, lebar: float) -> float:
    return panjang * lebar


def keliling_persegi_panjang(panjang: float, lebar: float) -> float:
    return 2 * (panjang + lebar)


def luas_lingkaran(jari_jari: float) -> float:
    return PI * jari_jari * jari_jari


def keliling_lingkaran(jari_jari: float) -> float:
    return 2 * PI * jari_jari


def celsius_ke_fahrenheit(celsius: float) -> float:
    return celsius * 9 / 5 + 32


def celsius_ke_kelvin(celsius: float) -> float:
    return celsius + 273.15


if __name__ == "__main__":
    print("[TEST MODUL] math_operations")
    print("Luas persegi (sisi 5)        :", luas_persegi(5))
    print("Keliling persegi (sisi 5)    :", keliling_persegi(5))
    print("Luas persegi panjang (8 x 4) :", luas_persegi_panjang(8, 4))
    print("Keliling persegi panjang     :", keliling_persegi_panjang(8, 4))
    print("Luas lingkaran (r = 7)       :", luas_lingkaran(7))
    print("Keliling lingkaran (r = 7)   :", keliling_lingkaran(7))
    print("25 C ke Fahrenheit           :", celsius_ke_fahrenheit(25))
    print("25 C ke Kelvin               :", celsius_ke_kelvin(25))