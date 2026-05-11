"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/Checkbox";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import {
  JENJANG,
  KELAS_PER_JENJANG,
  SEMESTER,
  MATA_PELAJARAN,
  NILAI_PANCA_CINTA,
  DIMENSI_PROFIL_LULUSAN,
  MODEL_PEMBELAJARAN_OPTIONS,
  generateTahunPelajaran,
  type Jenjang,
} from "@/lib/constants";

interface UserData {
  namaGuru?: string;
  nip?: string;
  namaMadrasah?: string;
  namaKepala?: string;
  nipKepala?: string;
  kota?: string;
}

interface RPPFormProps {
  userData?: UserData;
}

interface FormData {
  namaMadrasah: string;
  namaGuru: string;
  nipGuru: string;
  namaKepala: string;
  nipKepala: string;
  jenjang: Jenjang | "";
  mataPelajaran: string;
  kelas: string;
  semester: string;
  materiPokok: string;
  alokasiWaktuJp: string;
  menitPerJp: string;
  jumlahPertemuan: string;
  tahunPelajaran: string;
  nilaiPancaCinta: string[];
  dimensiProfilLulusan: string[];
  modelPembelajaran: string;
  kota: string;
}

export default function RPPForm({ userData }: RPPFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState<FormData>({
    namaMadrasah: userData?.namaMadrasah || "",
    namaGuru: userData?.namaGuru || "",
    nipGuru: userData?.nip || "",
    namaKepala: userData?.namaKepala || "",
    nipKepala: userData?.nipKepala || "",
    jenjang: "",
    mataPelajaran: "",
    kelas: "",
    semester: "",
    materiPokok: "",
    alokasiWaktuJp: "2",
    menitPerJp: "35",
    jumlahPertemuan: "1",
    tahunPelajaran: generateTahunPelajaran()[1] || "",
    nilaiPancaCinta: [],
    dimensiProfilLulusan: [],
    modelPembelajaran: "",
    kota: userData?.kota || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update mata pelajaran options when jenjang changes
  const [mapelOptions, setMapelOptions] = useState<{ value: string; label: string }[]>([]);
  const [kelasOptions, setKelasOptions] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    if (formData.jenjang) {
      const mapels = MATA_PELAJARAN[formData.jenjang] || [];
      setMapelOptions(mapels.map((m) => ({ value: m, label: m })));
      
      const kelases = KELAS_PER_JENJANG[formData.jenjang] || [];
      setKelasOptions(kelases.map((k) => ({ value: k, label: `Kelas ${k}` })));
      
      // Reset mata pelajaran and kelas when jenjang changes
      setFormData((prev) => ({ ...prev, mataPelajaran: "", kelas: "" }));
    }
  }, [formData.jenjang]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleCheckboxChange = (nilaiId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      nilaiPancaCinta: checked
        ? [...prev.nilaiPancaCinta, nilaiId]
        : prev.nilaiPancaCinta.filter((id) => id !== nilaiId),
    }));
  };

  const handleDimensiChange = (dimensiId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      dimensiProfilLulusan: checked
        ? [...prev.dimensiProfilLulusan, dimensiId]
        : prev.dimensiProfilLulusan.filter((id) => id !== dimensiId),
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.namaMadrasah) newErrors.namaMadrasah = "Nama Madrasah wajib diisi";
      if (!formData.namaGuru) newErrors.namaGuru = "Nama Guru wajib diisi";
    } else if (step === 2) {
      if (!formData.jenjang) newErrors.jenjang = "Jenjang wajib dipilih";
      if (!formData.mataPelajaran) newErrors.mataPelajaran = "Mata Pelajaran wajib dipilih";
      if (!formData.kelas) newErrors.kelas = "Kelas wajib dipilih";
      if (!formData.semester) newErrors.semester = "Semester wajib dipilih";
      if (!formData.materiPokok) newErrors.materiPokok = "Materi Pokok wajib diisi";
      if (!formData.tahunPelajaran) newErrors.tahunPelajaran = "Tahun Pelajaran wajib dipilih";
    } else if (step === 3) {
      if (formData.nilaiPancaCinta.length < 1) {
        showToast("Pilih minimal 1 Topik KBC (Panca Cinta)", "warning");
        return false;
      }
      if (formData.dimensiProfilLulusan.length < 1) {
        showToast("Pilih minimal 1 Dimensi Profil Lulusan", "warning");
        return false;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    try {
      // Convert selected nilai to labels
      const selectedNilaiLabels = formData.nilaiPancaCinta.map(
        (id) => NILAI_PANCA_CINTA.find((n) => n.id === id)?.label || id
      );

      // Convert selected dimensi to labels
      const selectedDimensiLabels = formData.dimensiProfilLulusan.map(
        (id) => DIMENSI_PROFIL_LULUSAN.find((d) => d.id === id)?.label || id
      );

      // Get model label
      const selectedModel = formData.modelPembelajaran
        ? MODEL_PEMBELAJARAN_OPTIONS.find((m) => m.id === formData.modelPembelajaran)
        : null;

      const response = await fetch("/api/rpp/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          kelas: parseInt(formData.kelas),
          semester: parseInt(formData.semester),
          alokasiWaktuJp: parseInt(formData.alokasiWaktuJp),
          menitPerJp: parseInt(formData.menitPerJp),
          jumlahPertemuan: parseInt(formData.jumlahPertemuan),
          nilaiPancaCinta: selectedNilaiLabels,
          dimensiProfilLulusan: selectedDimensiLabels,
          modelPembelajaran: selectedModel?.label || "",
          modelPembelajaranId: selectedModel?.id || "",
          sintaksModel: selectedModel?.sintaks || [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal generate RPP");
      }

      showToast("RPP berhasil di-generate!", "success");
      router.push(`/preview/${data.rpp.id}`);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Terjadi kesalahan",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
              step === currentStep
                ? "bg-kemenag-green text-white"
                : step < currentStep
                ? "bg-kemenag-gold text-slate-900"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {step < currentStep ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step
            )}
          </div>
          {step < 3 && (
            <div
              className={`w-16 sm:w-24 h-1 mx-2 ${
                step < currentStep ? "bg-kemenag-gold" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Identitas Madrasah & Guru</h2>
        <p className="text-slate-500 mt-1">Masukkan data identitas untuk RPP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nama Madrasah"
          name="namaMadrasah"
          value={formData.namaMadrasah}
          onChange={handleInputChange}
          placeholder="MI/MTs/MA ..."
          error={errors.namaMadrasah}
          required
        />
        <Input
          label="Kota/Kabupaten"
          name="kota"
          value={formData.kota}
          onChange={handleInputChange}
          placeholder="Jakarta"
        />
        <Input
          label="Nama Guru"
          name="namaGuru"
          value={formData.namaGuru}
          onChange={handleInputChange}
          placeholder="Nama lengkap beserta gelar"
          error={errors.namaGuru}
          required
        />
        <Input
          label="NIP Guru"
          name="nipGuru"
          value={formData.nipGuru}
          onChange={handleInputChange}
          placeholder="19xxxxxx"
        />
        <Input
          label="Nama Kepala Madrasah"
          name="namaKepala"
          value={formData.namaKepala}
          onChange={handleInputChange}
          placeholder="Nama lengkap beserta gelar"
        />
        <Input
          label="NIP Kepala Madrasah"
          name="nipKepala"
          value={formData.nipKepala}
          onChange={handleInputChange}
          placeholder="19xxxxxx"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Detail Pembelajaran</h2>
        <p className="text-slate-500 mt-1">Tentukan mata pelajaran dan materi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Jenjang Pendidikan"
          name="jenjang"
          value={formData.jenjang}
          onChange={handleInputChange}
          options={JENJANG.map((j) => ({ value: j, label: j }))}
          placeholder="Pilih Jenjang"
          error={errors.jenjang}
          required
        />
        <Select
          label="Mata Pelajaran"
          name="mataPelajaran"
          value={formData.mataPelajaran}
          onChange={handleInputChange}
          options={mapelOptions}
          placeholder="Pilih Mata Pelajaran"
          error={errors.mataPelajaran}
          disabled={!formData.jenjang}
          required
        />
        <Select
          label="Kelas"
          name="kelas"
          value={formData.kelas}
          onChange={handleInputChange}
          options={kelasOptions}
          placeholder="Pilih Kelas"
          error={errors.kelas}
          disabled={!formData.jenjang}
          required
        />
        <Select
          label="Semester"
          name="semester"
          value={formData.semester}
          onChange={handleInputChange}
          options={SEMESTER.map((s) => ({ value: s.value, label: s.label }))}
          placeholder="Pilih Semester"
          error={errors.semester}
          required
        />
        <Select
          label="Tahun Pelajaran"
          name="tahunPelajaran"
          value={formData.tahunPelajaran}
          onChange={handleInputChange}
          options={generateTahunPelajaran().map((t) => ({ value: t, label: t }))}
          placeholder="Pilih Tahun"
          error={errors.tahunPelajaran}
          required
        />
        <Input
          label="Alokasi Waktu (JP)"
          name="alokasiWaktuJp"
          type="number"
          min="1"
          max="10"
          value={formData.alokasiWaktuJp}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Menit per JP"
          name="menitPerJp"
          type="number"
          min="30"
          max="45"
          value={formData.menitPerJp}
          onChange={handleInputChange}
          helperText="MI: 35 menit, MTs/MA: 40-45 menit"
        />
        <Input
          label="Jumlah Pertemuan"
          name="jumlahPertemuan"
          type="number"
          min="1"
          max="5"
          value={formData.jumlahPertemuan}
          onChange={handleInputChange}
        />
      </div>

      <Textarea
        label="Materi Pokok"
        name="materiPokok"
        value={formData.materiPokok}
        onChange={handleInputChange}
        placeholder="Masukkan materi pokok yang akan diajarkan..."
        error={errors.materiPokok}
        required
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Nilai Panca Cinta & Dimensi Profil Lulusan</h2>
        <p className="text-slate-500 mt-1">
          Pilih nilai dan dimensi yang akan ditekankan dalam pembelajaran
        </p>
      </div>

      {/* Nilai Panca Cinta */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <span className="w-7 h-7 bg-kemenag-green text-white rounded-full flex items-center justify-center text-sm">1</span>
          Topik KBC (Panca Cinta)
          <span className="text-red-500 text-sm">*min. 1</span>
        </h3>
        <p className="text-slate-500 text-sm mb-3 ml-9">Pilih minimal 1 topik KBC (Panca Cinta) yang akan ditekankan</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-9">
          {NILAI_PANCA_CINTA.map((nilai) => (
            <Checkbox
              key={nilai.id}
              label={nilai.label}
              checked={formData.nilaiPancaCinta.includes(nilai.id)}
              onChange={(e) => handleCheckboxChange(nilai.id, e.target.checked)}
            />
          ))}
        </div>
      </div>

      {/* Dimensi Profil Lulusan */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <span className="w-7 h-7 bg-kemenag-green text-white rounded-full flex items-center justify-center text-sm">2</span>
          Dimensi Profil Lulusan
          <span className="text-red-500 text-sm">*min. 1</span>
        </h3>
        <p className="text-slate-500 text-sm mb-3 ml-9">Pilih minimal 1 dimensi profil lulusan yang dikembangkan</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-9">
          {DIMENSI_PROFIL_LULUSAN.map((dimensi) => (
            <Checkbox
              key={dimensi.id}
              label={dimensi.label}
              checked={formData.dimensiProfilLulusan.includes(dimensi.id)}
              onChange={(e) => handleDimensiChange(dimensi.id, e.target.checked)}
            />
          ))}
        </div>
      </div>

      {/* Model Pembelajaran */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <span className="w-7 h-7 bg-kemenag-green text-white rounded-full flex items-center justify-center text-sm">3</span>
          Model Pembelajaran
          <span className="text-slate-400 text-sm font-normal">(opsional)</span>
        </h3>
        <p className="text-slate-500 text-sm mb-3 ml-9">Kosongkan untuk disesuaikan otomatis berdasarkan materi</p>
        <div className="ml-9">
          <Select
            name="modelPembelajaran"
            value={formData.modelPembelajaran}
            onChange={handleInputChange}
            options={MODEL_PEMBELAJARAN_OPTIONS.map((m) => ({ value: m.id, label: m.label }))}
            placeholder="— Otomatis (AI menyesuaikan) —"
          />
          {formData.modelPembelajaran && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-1">Sintaks:</p>
              <div className="flex flex-wrap gap-1.5">
                {MODEL_PEMBELAJARAN_OPTIONS.find((m) => m.id === formData.modelPembelajaran)?.sintaks.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-kemenag-green/10 text-kemenag-green text-xs rounded-full font-medium">
                    {i + 1}. {s}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, modelPembelajaran: "" }))}
                className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
              >
                Reset ke otomatis
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ringkasan */}
      <div className="p-4 bg-kemenag-gold/10 rounded-lg border border-kemenag-gold/30">
        <h3 className="font-semibold text-slate-900 mb-2">Ringkasan RPP:</h3>
        <ul className="space-y-1 text-sm text-slate-700">
          <li>• Madrasah: {formData.namaMadrasah || "-"}</li>
          <li>• Guru: {formData.namaGuru || "-"}</li>
          <li>• Mata Pelajaran: {formData.mataPelajaran || "-"}</li>
          <li>• Kelas/Semester: {formData.kelas || "-"} / {formData.semester === "1" ? "Ganjil" : formData.semester === "2" ? "Genap" : "-"}</li>
          <li>• Materi: {formData.materiPokok || "-"}</li>
          <li>• Alokasi: {formData.alokasiWaktuJp} x {formData.menitPerJp} menit ({formData.jumlahPertemuan} pertemuan)</li>
          <li>• Model: {formData.modelPembelajaran
            ? MODEL_PEMBELAJARAN_OPTIONS.find((m) => m.id === formData.modelPembelajaran)?.label
            : "Otomatis"}</li>
          <li>• Panca Cinta: {formData.nilaiPancaCinta.length > 0
            ? formData.nilaiPancaCinta.map((id) => NILAI_PANCA_CINTA.find((n) => n.id === id)?.label).join(", ")
            : "-"}</li>
          <li>• Dimensi Profil: {formData.dimensiProfilLulusan.length > 0
            ? formData.dimensiProfilLulusan.map((id) => DIMENSI_PROFIL_LULUSAN.find((d) => d.id === id)?.label).join(", ")
            : "-"}</li>
        </ul>
      </div>
    </div>
  );

  return (
    <Card className="max-w-4xl mx-auto">
      {renderStepIndicator()}

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={handlePrev}>
              ← Sebelumnya
            </Button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps ? (
            <Button type="button" onClick={handleNext}>
              Selanjutnya →
            </Button>
          ) : (
            <Button type="submit" isLoading={isLoading}>
              {isLoading ? "Generating RPP..." : "Generate RPP"}
            </Button>
          )}
        </div>
      </form>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 border-4 border-kemenag-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Generating RPP...
            </h3>
            <p className="text-slate-500 text-sm">
              Sedang menyusun RPP berdasarkan data yang Anda masukkan. Proses ini
              membutuhkan waktu beberapa detik.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
