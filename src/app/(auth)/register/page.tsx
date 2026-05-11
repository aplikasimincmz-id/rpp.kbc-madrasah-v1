"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    namaGuru: "",
    nip: "",
    namaMadrasah: "",
    kota: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          namaGuru: formData.namaGuru,
          nip: formData.nip,
          namaMadrasah: formData.namaMadrasah,
          kota: formData.kota,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registrasi gagal");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Daftar Akun</h1>
        <p className="text-slate-500 mt-1">Buat akun baru untuk mulai generate RPP</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Lengkap (dengan Gelar)"
          type="text"
          value={formData.namaGuru}
          onChange={(e) => setFormData({ ...formData, namaGuru: e.target.value })}
          placeholder="Drs. Ahmad, M.Pd"
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="guru@madrasah.sch.id"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            required
          />
          <Input
            label="Konfirmasi Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="••••••••"
            required
          />
        </div>
        <Input
          label="NIP"
          type="text"
          value={formData.nip}
          onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
          placeholder="19xxxxxxxx (opsional)"
        />
        <Input
          label="Nama Madrasah"
          type="text"
          value={formData.namaMadrasah}
          onChange={(e) => setFormData({ ...formData, namaMadrasah: e.target.value })}
          placeholder="MI/MTs/MA ... (opsional)"
        />
        <Input
          label="Kota/Kabupaten"
          type="text"
          value={formData.kota}
          onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
          placeholder="Jakarta (opsional)"
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Daftar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-kemenag-green font-semibold hover:underline">
          Masuk di sini
        </Link>
      </p>
    </Card>
  );
}
