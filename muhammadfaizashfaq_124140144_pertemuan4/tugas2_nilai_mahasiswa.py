mahasiswa = [
    {
        "nama": "Muhammad Faiz Ashfaq",
        "nim": "124140144",
        "nilai_uts": 85,
        "nilai_uas": 90,
        "nilai_tugas": 88,
    },
    {
        "nama": "Syahrul Afwan",
        "nim": "124140096",
        "nilai_uts": 78,
        "nilai_uas": 82,
        "nilai_tugas": 80,
    },
    {
        "nama": "Ridho Maulana Saputra",
        "nim": "124140090",
        "nilai_uts": 70,
        "nilai_uas": 75,
        "nilai_tugas": 72,
    },
    {
        "nama": "Adit Saputra",
        "nim": "124140078",
        "nilai_uts": 65,
        "nilai_uas": 68,
        "nilai_tugas": 70,
    },
    {
        "nama": "Aryo Fajar Pratomo",
        "nim": "124140012",
        "nilai_uts": 58,
        "nilai_uas": 60,
        "nilai_tugas": 55,
    },
    {
        "nama": "Richard Halim",
        "nim": "124140084",
        "nilai_uts": 45,
        "nilai_uas": 48,
        "nilai_tugas": 50,
    },
]


def hitung_nilai_akhir(data: dict) -> float:
    """Menghitung nilai akhir dengan bobot 30% UTS, 40% UAS, dan 30% tugas."""
    nilai_uts = data["nilai_uts"]
    nilai_uas = data["nilai_uas"]
    nilai_tugas = data["nilai_tugas"]

    return (0.30 * nilai_uts) + (0.40 * nilai_uas) + (0.30 * nilai_tugas)


def tentukan_grade(nilai: float) -> str:
    """Menentukan grade A-E berdasarkan nilai akhir mahasiswa."""
    if nilai >= 80:
        return "A"
    elif nilai >= 70:
        return "B"
    elif nilai >= 60:
        return "C"
    elif nilai >= 50:
        return "D"
    else:
        return "E"

rekap = []

for data in mahasiswa:
    nilai_akhir = hitung_nilai_akhir(data)
    grade = tentukan_grade(nilai_akhir)

    rekap.append(
        {
            "nama": data["nama"],
            "nim": data["nim"],
            "nilai_akhir": nilai_akhir,
            "grade": grade,
        }
    )

print("=" * 60)
print("REKAP NILAI MAHASISWA")
print("=" * 60)
print(f"{'No':<4}{'Nama':<22}{'NIM':<12}{'Nilai Akhir':>12}{'Grade':>7}")
print("-" * 60)

for nomor, data in enumerate(rekap, start=1):
    print(
        f"{nomor:<4}{data['nama']:<22}{data['nim']:<12}"
        f"{data['nilai_akhir']:>12.2f}{data['grade']:>7}"
    )

print("-" * 60)

tertinggi = rekap[0]
terendah = rekap[0]

for data in rekap:
    if data["nilai_akhir"] > tertinggi["nilai_akhir"]:
        tertinggi = data
    if data["nilai_akhir"] < terendah["nilai_akhir"]:
        terendah = data

print()
print("--- NILAI EKSTREM ---")
print(
    f"Nilai tertinggi : {tertinggi['nama']} ({tertinggi['nim']}) - "
    f"{tertinggi['nilai_akhir']:.2f} ({tertinggi['grade']})"
)
print(
    f"Nilai terendah  : {terendah['nama']} ({terendah['nim']}) - "
    f"{terendah['nilai_akhir']:.2f} ({terendah['grade']})"
)