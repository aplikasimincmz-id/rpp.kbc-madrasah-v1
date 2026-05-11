"use client";

import { useState } from "react";
import { RppDocument } from "@/db/schema";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { jsPDF } from "jspdf";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, convertInchesToTwip,
  LineRuleType, PageOrientation, VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";
import {
  formatSemester, formatAlokasiWaktu, formatTanggalIndonesia, MODEL_PEMBELAJARAN_DEFAULT,
} from "@/lib/constants";
import { splitNumberedPoints } from "@/lib/rpp-format";

interface ExportButtonsProps { rpp: RppDocument; }

/* ======================================================================
   SHARED HELPERS
   ====================================================================== */
const F = "Times New Roman";
const SZ = 24;       // 12pt
const SZS = 20;      // 10pt
const SZT = 28;      // 14pt
const LS = 276;      // 1.15
const B = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const modelLabel = (rpp: RppDocument) =>
  (rpp as Record<string,unknown>).modelPembelajaran as string || MODEL_PEMBELAJARAN_DEFAULT;

/* ======================================================================
   COMPONENT
   ====================================================================== */
export default function ExportButtons({ rpp }: ExportButtonsProps) {
  const { showToast } = useToast();
  const [pdfBusy, setPdfBusy] = useState(false);
  const [docxBusy, setDocxBusy] = useState(false);

  /* ============================  PDF  ================================= */
  const handlePDF = async () => {
    setPdfBusy(true);
    try {
      const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();
      const m = 20;
      const cw = pw - m*2;
      let y = m;

      const chk = (n=15) => { if(y>ph-n){ doc.addPage(); y=m; } };
      const txt = (t:string, fs:number, bold=false, align:"left"|"center"|"right"="left") => {
        doc.setFontSize(fs); doc.setFont("helvetica",bold?"bold":"normal"); doc.setTextColor(0,0,0);
        doc.splitTextToSize(t,cw).forEach((l:string)=>{
          chk();
          if(align==="center") doc.text(l,pw/2,y,{align:"center"});
          else if(align==="right") doc.text(l,pw-m,y,{align:"right"});
          else doc.text(l,m,y);
          y+=fs*0.45;
        }); y+=1;
      };
      const bul = (t:string, fs=9) => {
        doc.setFontSize(fs); doc.setFont("helvetica","normal"); doc.setTextColor(0,0,0);
        doc.splitTextToSize(`• ${t}`,cw-5).forEach((l:string,i:number)=>{ chk(); doc.text(i===0?l:`  ${l}`,m+3,y); y+=fs*0.45; });
      };
      const sp = (n:number) => { y+=n; };
      const sec = (t:string) => { chk(30); doc.setFillColor(0,0,0); doc.rect(m,y-4,cw,8,"F"); doc.setTextColor(255,255,255); doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.text(t,m+3,y+1); doc.setTextColor(0,0,0); y+=10; };
      const sub = (t:string) => { chk(); txt(t,10,true); };

      // TITLE
      txt("PERENCANAAN PEMBELAJARAN KBC",14,true,"center");
      txt(`Materi: ${rpp.materiPokok}`,11,false,"center"); sp(8);

      // A
      sec("A. IDENTITAS MODUL");
      [["Madrasah",rpp.namaMadrasah],["Guru",`${rpp.namaGuru}${rpp.nipGuru?` (NIP: ${rpp.nipGuru})`:""}`],["Mata Pelajaran",rpp.mataPelajaran],["Kelas / Semester",formatSemester(rpp.kelas,rpp.semester)],["Materi Pokok",rpp.materiPokok],["Alokasi Waktu",formatAlokasiWaktu(rpp.alokasiWaktuJp,rpp.menitPerJp,rpp.jumlahPertemuan)],["Tahun Pelajaran",rpp.tahunPelajaran],["Model Pembelajaran",modelLabel(rpp)]].forEach(([l,v])=>txt(`${l}: ${v}`,9));
      sp(5);

      // B
      if(rpp.identifikasiKbc){
        const ik=rpp.identifikasiKbc;
        sec("B. IDENTIFIKASI & KBC (Karakteristik Berbasis Cinta)");
        sub("1. Kesiapan Murid:");
        txt(`Pengetahuan Awal: ${ik.kesiapanMurid.pengetahuanAwal}`,9);
        txt(`Gaya Belajar: ${ik.kesiapanMurid.gayaBelajar}`,9);
        txt(`Minat: ${ik.kesiapanMurid.minat}`,9); sp(3);
        sub("2. Dimensi Profil Lulusan:");
        if(ik.dimensiProfilLulusan.kreativitas) bul(ik.dimensiProfilLulusan.kreativitas);
        if(ik.dimensiProfilLulusan.kolaborasi) bul(ik.dimensiProfilLulusan.kolaborasi);
        if(ik.dimensiProfilLulusan.komunikasi) bul(ik.dimensiProfilLulusan.komunikasi);
        sp(3);
        sub("3. Topik KBC (Panca Cinta):");
        ik.topikKbc.forEach(t=>bul(t)); sp(3);
        sub("4. Materi Insersi KBC:");
        txt(ik.materiInsersiKbc,9); sp(5);
      }

      // C
      if(rpp.desainPembelajaran){
        const dp=rpp.desainPembelajaran;
        sec("C. DESAIN PEMBELAJARAN");
        sub("1. Capaian Pembelajaran (CP):"); txt(dp.capaianPembelajaran,9); sp(3);
        sub("2. Lintas Disiplin Ilmu:"); dp.lintasDisiplinIlmu.forEach(i=>bul(`${i.mapel}: ${i.deskripsi}`)); sp(3);
        sub("3. Tujuan Pembelajaran:");
        const tujuanPdf = splitNumberedPoints(dp.tujuanPembelajaran);
        if (tujuanPdf.length > 1) {
          tujuanPdf.forEach((item, idx) => txt(`${idx + 1}. ${item.replace(/^\d+\.\s*/, "")}`, 9));
        } else {
          txt(dp.tujuanPembelajaran,9);
        }
        sp(3);
        sub("4. Praktik Pedagogis:"); dp.praktikPedagogis.forEach(i=>bul(`${i.metode}: ${i.deskripsi}`)); sp(3);
        sub("5. Kemitraan Pembelajaran:"); dp.kemitraanPembelajaran.forEach(i=>bul(i)); sp(3);
        sub("6. Lingkungan Pembelajaran:"); dp.lingkunganPembelajaran.forEach(i=>bul(i)); sp(3);
        sub("7. Pemanfaatan Digital:"); dp.pemanfaatanDigital.forEach(i=>bul(i)); sp(5);
      }

      // D
      if(rpp.pengalamanBelajar?.length){
        sec("D. PENGALAMAN BELAJAR (Deep Learning)");
        rpp.pengalamanBelajar.forEach(p=>{
          chk(40);
          txt(`Pertemuan ${p.pertemuanKe} (${p.jumlahJp} JP = ${p.totalMenit} menit)`,10,true); sp(3);
          txt(`1. PENDAHULUAN (±${p.pendahuluan.durasiMenit} menit)`,9,true);
          p.pendahuluan.kegiatan.forEach(k=>bul(k,8));
          txt(`Penguatan Nilai KBC (Panca Cinta):`,8,true); txt(p.pendahuluan.penguatanKbc,8); sp(3);
          txt(`2. INTI (±${p.inti.durasiMenit} menit)`,9,true);
          txt(`a. Memahami (±${p.inti.memahami.durasiMenit} menit)`,9,true);
          p.inti.memahami.kegiatan.forEach(k=>bul(k,8));
          txt(`b. Mengaplikasi (±${p.inti.mengaplikasi.durasiMenit} menit)`,9,true);
          p.inti.mengaplikasi.kegiatan.forEach(k=>bul(k,8));
          txt(`c. Merefleksi (±${p.inti.merefleksi.durasiMenit} menit)`,9,true);
          p.inti.merefleksi.kegiatan.forEach(k=>bul(k,8));
          txt(`Penguatan Nilai KBC (Panca Cinta):`,8,true); txt(p.inti.penguatanKbc,8); sp(3);
          txt(`3. PENUTUP (±${p.penutup.durasiMenit} menit)`,9,true);
          p.penutup.kegiatan.forEach(k=>bul(k,8));
          txt(`Penguatan Nilai KBC (Panca Cinta):`,8,true); txt(p.penutup.penguatanKbc,8); sp(5);
        });
      }

      // E
      if(rpp.asesmen){
        sec("E. ASESMEN");
        sub("1. Asesmen Awal (Diagnostik):"); rpp.asesmen.diagnostik.forEach(i=>bul(i)); sp(3);
        sub("2. Asesmen Proses (Formatif):");
        txt(`Observasi: ${rpp.asesmen.formatif.observasi}`,9);
        txt(`Penilaian Unjuk Kerja: ${rpp.asesmen.formatif.unjukKerja}`,9);
        txt(`Penilaian Produk: ${rpp.asesmen.formatif.penilaianProduk}`,9); sp(3);
        sub("3. Asesmen Akhir (Sumatif):"); txt(rpp.asesmen.sumatif,9); sp(5);
      }

      // TTD
      doc.addPage(); y=m;
      txt(`${rpp.kota||".................."}, ${formatTanggalIndonesia()}`,10,false,"right"); sp(8);
      doc.setFontSize(10); doc.setTextColor(0,0,0);
      doc.text("Mengetahui,",m,y); y+=5;
      doc.setFont("helvetica","bold");
      doc.text("Kepala Madrasah",m,y); doc.text(`Guru Kelas ${rpp.kelas}`,pw-m-45,y); y+=30;
      doc.text(rpp.namaKepala||"................................",m,y); doc.text(rpp.namaGuru,pw-m-45,y); y+=5;
      doc.setFont("helvetica","normal");
      doc.text(`NIP: ${rpp.nipKepala||"................................"}`,m,y); doc.text(`NIP: ${rpp.nipGuru||"................................"}`,pw-m-45,y);

      // LAMPIRAN
      if(rpp.lampiran){
        const lp=rpp.lampiran;
        doc.addPage(); y=m;
        sec("LAMPIRAN"); sp(5);
        sub(`1. Rubrik Penilaian ${lp.rubrikHolistik.aspek} (Holistik)`); sp(3);
        lp.rubrikHolistik.kriteria.forEach(i=>txt(`Skor ${i.skor}: ${i.deskripsi}`,9)); sp(5);
        sub("2. Rubrik Penilaian (Analitik)"); sp(3);
        lp.rubrikAnalitik.aspekPenilaian.forEach((i,idx)=>{
          chk(25); txt(`${idx+1}. ${i.aspek} (${i.nilaiKbc})`,9,true);
          txt(`   Skor 1: ${i.skor1}`,8); txt(`   Skor 2: ${i.skor2}`,8); txt(`   Skor 3: ${i.skor3}`,8); txt(`   Skor 4: ${i.skor4}`,8); sp(2);
        });
        txt("Rumus Nilai Akhir: Nilai = (Total Skor / Skor Maksimal) x 100",9,true); sp(5);
        doc.addPage(); y=m;
        sub("3. Lembar Kerja Peserta Didik (LKPD)"); sp(3);
        txt(lp.lkpd.judul,11,true,"center"); txt(`Materi: ${rpp.materiPokok}`,9,false,"center"); sp(5);
        txt("Nama Kelompok: ................................",9);
        txt("Anggota: 1. ............ 2. ............ 3. ............ 4. ............",9); sp(5);
        lp.lkpd.bagian.forEach(b=>{ chk(30); txt(`${b.judulBagian} (${b.nilaiKbc})`,10,true); b.instruksi.forEach(i=>txt(i,9)); sp(3); });
        doc.addPage(); y=m;
        sub("4. Instrumen Asesmen (Pilihan Ganda)"); sp(5);
        txt("a. Kisi-kisi Soal",10,true); sp(3);
        lp.instrumenAsesmen.kisiKisi.forEach((i,idx)=>{ chk(15); txt(`${idx+1}. ${i.kompetensiDasar}`,9); txt(`   Materi: ${i.materi} | Indikator: ${i.indikatorSoal} | No. Soal: PG/${i.nomorSoal}`,8); sp(2); }); sp(5);
        txt("b. Naskah Soal Pilihan Ganda",10,true);
        txt("Petunjuk: Pilihlah jawaban yang paling tepat!",9); sp(3);
        lp.instrumenAsesmen.soalPilgan.forEach(s=>{
          chk(35);
          txt(`${s.nomor}. ${s.soal} (${s.nilaiKbc})`,9,true);
          txt(`   a. ${s.opsiA}`,9); txt(`   b. ${s.opsiB}`,9); txt(`   c. ${s.opsiC}`,9); txt(`   d. ${s.opsiD}`,9);
          txt(`   Kunci Jawaban: ${s.kunciJawaban.toUpperCase()}`,9,true); sp(3);
        });
      }

      doc.save(`RPP_${rpp.mataPelajaran}_${rpp.materiPokok.substring(0,30)}.pdf`);
      showToast("PDF berhasil diexport!","success");
    } catch(e){ console.error(e); showToast("Gagal export PDF","error"); }
    finally{ setPdfBusy(false); }
  };

  /* ============================  DOCX  ================================ */
  const handleDOCX = async () => {
    setDocxBusy(true);
    try {
      const c: (Paragraph|Table)[] = [];

      // helpers
      const p = (t:string,o?:{bold?:boolean;sz?:number;align?:typeof AlignmentType[keyof typeof AlignmentType];bef?:number;aft?:number}): Paragraph =>
        new Paragraph({ children:[new TextRun({text:t,bold:o?.bold,font:F,size:o?.sz||SZ,color:"000000"})], alignment:o?.align||AlignmentType.LEFT, spacing:{before:o?.bef||0,after:o?.aft??120,line:LS,lineRule:LineRuleType.AUTO} });
      const bl = (t:string): Paragraph =>
        new Paragraph({ children:[new TextRun({text:t,font:F,size:SZ,color:"000000"})], bullet:{level:0}, spacing:{after:60,line:LS,lineRule:LineRuleType.AUTO} });
      const hd = (t:string,lv:1|2=2): Paragraph =>
        p(t,{bold:true,sz:lv===1?SZT:SZ,align:lv===1?AlignmentType.CENTER:AlignmentType.LEFT,bef:240,aft:120});
      const sh = (t:string): Paragraph => p(t,{bold:true,bef:120,aft:60});
      const em = (): Paragraph => new Paragraph({children:[],spacing:{after:120,line:LS,lineRule:LineRuleType.AUTO}});
      const tc = (t:string,o?:{bold?:boolean;w?:number;align?:typeof AlignmentType[keyof typeof AlignmentType];bg?:string}): TableCell =>
        new TableCell({ width:o?.w?{size:o.w,type:WidthType.PERCENTAGE}:undefined, children:[new Paragraph({children:[new TextRun({text:t,bold:o?.bold,font:F,size:SZS,color:"000000"})],alignment:o?.align||AlignmentType.LEFT,spacing:{line:LS,lineRule:LineRuleType.AUTO}})], verticalAlign:VerticalAlign.CENTER, shading:o?.bg?{fill:o.bg}:undefined, borders:{top:B,bottom:B,left:B,right:B} });
      const tr = (l:string,v:string) => new TableRow({children:[
        new TableCell({width:{size:30,type:WidthType.PERCENTAGE},children:[new Paragraph({children:[new TextRun({text:l,bold:true,font:F,size:SZ,color:"000000"})],spacing:{line:LS,lineRule:LineRuleType.AUTO}})],borders:{top:B,bottom:B,left:B,right:B}}),
        new TableCell({width:{size:70,type:WidthType.PERCENTAGE},children:[new Paragraph({children:[new TextRun({text:`: ${v}`,font:F,size:SZ,color:"000000"})],spacing:{line:LS,lineRule:LineRuleType.AUTO}})],borders:{top:B,bottom:B,left:B,right:B}}),
      ]});
      const noBorder = {top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}};

      // TITLE
      c.push(hd("PERENCANAAN PEMBELAJARAN KBC",1));
      c.push(p(`Materi: ${rpp.materiPokok}`,{align:AlignmentType.CENTER})); c.push(em());

      // A
      c.push(hd("A. IDENTITAS MODUL"));
      c.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[
        tr("Madrasah",rpp.namaMadrasah), tr("Guru",`${rpp.namaGuru}${rpp.nipGuru?` (NIP: ${rpp.nipGuru})`:""}`),
        tr("Mata Pelajaran",rpp.mataPelajaran), tr("Kelas / Semester",formatSemester(rpp.kelas,rpp.semester)),
        tr("Materi Pokok",rpp.materiPokok), tr("Alokasi Waktu",formatAlokasiWaktu(rpp.alokasiWaktuJp,rpp.menitPerJp,rpp.jumlahPertemuan)),
        tr("Tahun Pelajaran",rpp.tahunPelajaran), tr("Model Pembelajaran",modelLabel(rpp)),
      ]})); c.push(em());

      // B
      if(rpp.identifikasiKbc){
        const ik=rpp.identifikasiKbc;
        c.push(hd("B. IDENTIFIKASI & KBC (Karakteristik Berbasis Cinta)"));
        c.push(sh("1. Kesiapan Murid:"));
        c.push(p(`Pengetahuan Awal: ${ik.kesiapanMurid.pengetahuanAwal}`));
        c.push(p(`Gaya Belajar: ${ik.kesiapanMurid.gayaBelajar}`));
        c.push(p(`Minat: ${ik.kesiapanMurid.minat}`));
        c.push(sh("2. Dimensi Profil Lulusan:"));
        if(ik.dimensiProfilLulusan.kreativitas) c.push(bl(ik.dimensiProfilLulusan.kreativitas));
        if(ik.dimensiProfilLulusan.kolaborasi) c.push(bl(ik.dimensiProfilLulusan.kolaborasi));
        if(ik.dimensiProfilLulusan.komunikasi) c.push(bl(ik.dimensiProfilLulusan.komunikasi));
        c.push(sh("3. Topik KBC (Panca Cinta):")); ik.topikKbc.forEach(t=>c.push(bl(t)));
        c.push(sh("4. Materi Insersi KBC:")); c.push(p(ik.materiInsersiKbc)); c.push(em());
      }

      // C
      if(rpp.desainPembelajaran){
        const dp=rpp.desainPembelajaran;
        c.push(hd("C. DESAIN PEMBELAJARAN"));
        c.push(sh("1. Capaian Pembelajaran (CP):")); c.push(p(dp.capaianPembelajaran));
        c.push(sh("2. Lintas Disiplin Ilmu:")); dp.lintasDisiplinIlmu.forEach(i=>c.push(bl(`${i.mapel}: ${i.deskripsi}`)));
        c.push(sh("3. Tujuan Pembelajaran:"));
        const tujuanDocx = splitNumberedPoints(dp.tujuanPembelajaran);
        if (tujuanDocx.length > 1) {
          tujuanDocx.forEach((item, idx) => c.push(p(`${idx + 1}. ${item.replace(/^\d+\.\s*/, "")}`)));
        } else {
          c.push(p(dp.tujuanPembelajaran));
        }
        c.push(sh("4. Praktik Pedagogis:")); dp.praktikPedagogis.forEach(i=>c.push(bl(`${i.metode}: ${i.deskripsi}`)));
        c.push(sh("5. Kemitraan Pembelajaran:")); dp.kemitraanPembelajaran.forEach(i=>c.push(bl(i)));
        c.push(sh("6. Lingkungan Pembelajaran:")); dp.lingkunganPembelajaran.forEach(i=>c.push(bl(i)));
        c.push(sh("7. Pemanfaatan Digital:")); dp.pemanfaatanDigital.forEach(i=>c.push(bl(i)));
        c.push(em());
      }

      // D
      if(rpp.pengalamanBelajar?.length){
        c.push(hd("D. PENGALAMAN BELAJAR (Deep Learning)"));
        rpp.pengalamanBelajar.forEach(pt=>{
          c.push(p(`Pertemuan ${pt.pertemuanKe} (${pt.jumlahJp} JP = ${pt.totalMenit} menit)`,{bold:true,bef:200}));
          c.push(sh(`1. PENDAHULUAN (±${pt.pendahuluan.durasiMenit} menit)`));
          pt.pendahuluan.kegiatan.forEach(k=>c.push(bl(k)));
          c.push(p("Penguatan Nilai KBC (Panca Cinta):",{bold:true}));
          c.push(p(pt.pendahuluan.penguatanKbc));
          c.push(sh(`2. INTI (±${pt.inti.durasiMenit} menit)`));
          c.push(p(`a. Memahami (±${pt.inti.memahami.durasiMenit} menit):`,{bold:true}));
          pt.inti.memahami.kegiatan.forEach(k=>c.push(bl(k)));
          c.push(p(`b. Mengaplikasi (±${pt.inti.mengaplikasi.durasiMenit} menit):`,{bold:true}));
          pt.inti.mengaplikasi.kegiatan.forEach(k=>c.push(bl(k)));
          c.push(p(`c. Merefleksi (±${pt.inti.merefleksi.durasiMenit} menit):`,{bold:true}));
          pt.inti.merefleksi.kegiatan.forEach(k=>c.push(bl(k)));
          c.push(p("Penguatan Nilai KBC (Panca Cinta):",{bold:true}));
          c.push(p(pt.inti.penguatanKbc));
          c.push(sh(`3. PENUTUP (±${pt.penutup.durasiMenit} menit)`));
          pt.penutup.kegiatan.forEach(k=>c.push(bl(k)));
          c.push(p("Penguatan Nilai KBC (Panca Cinta):",{bold:true}));
          c.push(p(pt.penutup.penguatanKbc)); c.push(em());
        });
      }

      // E
      if(rpp.asesmen){
        c.push(hd("E. ASESMEN"));
        c.push(sh("1. Asesmen Awal (Diagnostik):")); rpp.asesmen.diagnostik.forEach(i=>c.push(bl(i)));
        c.push(sh("2. Asesmen Proses (Formatif):"));
        c.push(p(`Observasi: ${rpp.asesmen.formatif.observasi}`));
        c.push(p(`Penilaian Unjuk Kerja: ${rpp.asesmen.formatif.unjukKerja}`));
        c.push(p(`Penilaian Produk: ${rpp.asesmen.formatif.penilaianProduk}`));
        c.push(sh("3. Asesmen Akhir (Sumatif):")); c.push(p(rpp.asesmen.sumatif)); c.push(em());
      }

      // TTD
      c.push(em()); c.push(p(`${rpp.kota||".................."}, ${formatTanggalIndonesia()}`,{align:AlignmentType.RIGHT})); c.push(em()); c.push(em());
      c.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[
        new TableRow({children:[
          new TableCell({width:{size:50,type:WidthType.PERCENTAGE},borders:noBorder,children:[
            new Paragraph({children:[new TextRun({text:"Mengetahui,",font:F,size:SZ,color:"000000"})],spacing:{line:LS,lineRule:LineRuleType.AUTO}}),
            new Paragraph({children:[new TextRun({text:"Kepala Madrasah",font:F,size:SZ,bold:true,color:"000000"})],spacing:{line:LS,lineRule:LineRuleType.AUTO}}),
          ]}),
          new TableCell({width:{size:50,type:WidthType.PERCENTAGE},borders:noBorder,children:[
            new Paragraph({children:[new TextRun({text:"",font:F,size:SZ})],spacing:{line:LS,lineRule:LineRuleType.AUTO}}),
            new Paragraph({children:[new TextRun({text:`Guru Kelas ${rpp.kelas}`,font:F,size:SZ,bold:true,color:"000000"})],spacing:{line:LS,lineRule:LineRuleType.AUTO}}),
          ]}),
        ]}),
        new TableRow({children:[
          new TableCell({borders:noBorder,children:[new Paragraph({children:[],spacing:{before:600,after:600}})]}),
          new TableCell({borders:noBorder,children:[new Paragraph({children:[],spacing:{before:600,after:600}})]}),
        ]}),
        new TableRow({children:[
          new TableCell({borders:noBorder,children:[
            new Paragraph({children:[new TextRun({text:rpp.namaKepala||"................................",font:F,size:SZ,bold:true,underline:{},color:"000000"})],spacing:{line:LS,lineRule:LineRuleType.AUTO}}),
            new Paragraph({children:[new TextRun({text:`NIP: ${rpp.nipKepala||"................................"}`,font:F,size:SZ,color:"000000"})],spacing:{line:LS,lineRule:LineRuleType.AUTO}}),
          ]}),
          new TableCell({borders:noBorder,children:[
            new Paragraph({children:[new TextRun({text:rpp.namaGuru,font:F,size:SZ,bold:true,underline:{},color:"000000"})],spacing:{line:LS,lineRule:LineRuleType.AUTO}}),
            new Paragraph({children:[new TextRun({text:`NIP: ${rpp.nipGuru||"................................"}`,font:F,size:SZ,color:"000000"})],spacing:{line:LS,lineRule:LineRuleType.AUTO}}),
          ]}),
        ]}),
      ]}));

      // LAMPIRAN
      if(rpp.lampiran){
        const lp=rpp.lampiran;
        c.push(em()); c.push(hd("LAMPIRAN",1)); c.push(em());

        // Rubrik Holistik - TABEL
        c.push(sh(`1. Rubrik Penilaian ${lp.rubrikHolistik.aspek} (Holistik)`));
        c.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[
          new TableRow({children:[tc("Skor",{bold:true,w:15,align:AlignmentType.CENTER,bg:"E0E0E0"}),tc("Kriteria",{bold:true,w:85,bg:"E0E0E0"})]}),
          ...lp.rubrikHolistik.kriteria.map(i=>new TableRow({children:[tc(i.skor.toString(),{bold:true,align:AlignmentType.CENTER}),tc(i.deskripsi)]})),
        ]})); c.push(em());

        // Rubrik Analitik - TABEL
        c.push(sh("2. Rubrik Penilaian (Analitik)"));
        c.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[
          new TableRow({children:[tc("No",{bold:true,w:5,align:AlignmentType.CENTER,bg:"E0E0E0"}),tc("Aspek Penilaian",{bold:true,w:25,bg:"E0E0E0"}),tc("Skor 1",{bold:true,w:17,align:AlignmentType.CENTER,bg:"E0E0E0"}),tc("Skor 2",{bold:true,w:17,align:AlignmentType.CENTER,bg:"E0E0E0"}),tc("Skor 3",{bold:true,w:18,align:AlignmentType.CENTER,bg:"E0E0E0"}),tc("Skor 4",{bold:true,w:18,align:AlignmentType.CENTER,bg:"E0E0E0"})]}),
          ...lp.rubrikAnalitik.aspekPenilaian.map((i,idx)=>new TableRow({children:[
            tc((idx+1).toString(),{align:AlignmentType.CENTER}),
            new TableCell({width:{size:25,type:WidthType.PERCENTAGE},children:[
              new Paragraph({children:[new TextRun({text:i.aspek,bold:true,font:F,size:SZS,color:"000000"})],spacing:{line:LS,lineRule:LineRuleType.AUTO}}),
              new Paragraph({children:[new TextRun({text:`(${i.nilaiKbc})`,font:F,size:18,color:"000000"})],spacing:{line:LS,lineRule:LineRuleType.AUTO}}),
            ],verticalAlign:VerticalAlign.CENTER,borders:{top:B,bottom:B,left:B,right:B}}),
            tc(i.skor1),tc(i.skor2),tc(i.skor3),tc(i.skor4),
          ]})),
        ]}));
        c.push(p("Rumus Nilai Akhir: Nilai = (Total Skor / Skor Maksimal) x 100",{bold:true})); c.push(em());

        // LKPD
        c.push(sh("3. Lembar Kerja Peserta Didik (LKPD)"));
        c.push(p(lp.lkpd.judul,{bold:true,align:AlignmentType.CENTER}));
        c.push(p(`Materi: ${rpp.materiPokok}`,{align:AlignmentType.CENTER})); c.push(em());
        c.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[
          new TableRow({children:[tc("Nama Kelompok",{bold:true,w:25}),tc("................................................................",{w:75})]}),
          new TableRow({children:[tc("Anggota",{bold:true,w:25}),tc("1. ................  2. ................  3. ................  4. ................",{w:75})]}),
        ]})); c.push(em());
        lp.lkpd.bagian.forEach(b=>{ c.push(p(`${b.judulBagian} (${b.nilaiKbc})`,{bold:true})); b.instruksi.forEach(i=>c.push(p(i))); c.push(em()); });

        // Kisi-kisi - TABEL
        c.push(sh("4. Instrumen Asesmen (Pilihan Ganda)")); c.push(em());
        c.push(p("a. Kisi-kisi Soal",{bold:true}));
        c.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[
          new TableRow({children:[tc("No",{bold:true,w:5,align:AlignmentType.CENTER,bg:"E0E0E0"}),tc("Kompetensi Dasar",{bold:true,w:30,bg:"E0E0E0"}),tc("Materi",{bold:true,w:20,bg:"E0E0E0"}),tc("Indikator Soal",{bold:true,w:30,bg:"E0E0E0"}),tc("No. Soal",{bold:true,w:15,align:AlignmentType.CENTER,bg:"E0E0E0"})]}),
          ...lp.instrumenAsesmen.kisiKisi.map((i,idx)=>new TableRow({children:[tc((idx+1).toString(),{align:AlignmentType.CENTER}),tc(i.kompetensiDasar),tc(i.materi),tc(i.indikatorSoal),tc(`PG / ${i.nomorSoal}`,{align:AlignmentType.CENTER})]})),
        ]})); c.push(em());

        // Soal PG
        c.push(p("b. Naskah Soal Pilihan Ganda",{bold:true}));
        c.push(p("Petunjuk: Pilihlah jawaban yang paling tepat!")); c.push(em());
        lp.instrumenAsesmen.soalPilgan.forEach(s=>{
          c.push(new Paragraph({children:[new TextRun({text:`${s.nomor}. ${s.soal} `,font:F,size:SZ,color:"000000"}),new TextRun({text:`(${s.nilaiKbc})`,bold:true,font:F,size:SZ,color:"000000"})],spacing:{after:60,line:LS,lineRule:LineRuleType.AUTO}}));
          c.push(p(`     a. ${s.opsiA}`,{aft:40})); c.push(p(`     b. ${s.opsiB}`,{aft:40})); c.push(p(`     c. ${s.opsiC}`,{aft:40})); c.push(p(`     d. ${s.opsiD}`,{aft:40}));
          c.push(p(`     Kunci Jawaban: ${s.kunciJawaban.toUpperCase()}`,{bold:true})); c.push(em());
        });
      }

      const doc = new Document({sections:[{properties:{page:{size:{orientation:PageOrientation.PORTRAIT,width:convertInchesToTwip(8.27),height:convertInchesToTwip(11.69)},margin:{top:convertInchesToTwip(0.79),right:convertInchesToTwip(0.79),bottom:convertInchesToTwip(0.79),left:convertInchesToTwip(0.79)}}},children:c}]});
      const blob = await Packer.toBlob(doc);
      saveAs(blob,`RPP_${rpp.mataPelajaran}_${rpp.materiPokok.substring(0,30)}.docx`);
      showToast("DOCX berhasil diexport!","success");
    } catch(e){ console.error(e); showToast("Gagal export DOCX","error"); }
    finally{ setDocxBusy(false); }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handlePDF} isLoading={pdfBusy}>📄 Export PDF</Button>
      <Button variant="primary" onClick={handleDOCX} isLoading={docxBusy}>📝 Export DOCX</Button>
    </div>
  );
}
