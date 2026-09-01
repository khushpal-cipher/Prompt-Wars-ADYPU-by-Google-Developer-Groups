import React from "react";
import {
  ShieldCheck,
  Lock,
  FileText,
  Scale,
  EyeOff,
  ServerOff,
  CheckCircle2,
  AlertOctagon,
} from "lucide-react";

export function PrivacyPillars() {
  const pillars = [
    {
      title: "Section 15 Legal Inadmissibility",
      desc: "By statutory mandate under Section 15 of the Census Act, 1948, no person has the right to inspect any census book or register. Individual census records are strictly inadmissible as evidence in any civil, criminal, or revenue court.",
      icon: Scale,
      badge: "Census Act 1948 §15",
    },
    {
      title: "Strict Inter-Agency Firewalls",
      desc: "Census data is compiled strictly in aggregated, anonymized macro-demographic tables. It cannot be cross-referenced, transferred to, or queried by Income Tax, Police, Intelligence, or private commercial databases.",
      icon: EyeOff,
      badge: "No Commercial / Police Access",
    },
    {
      title: "Penal Safeguards Against Breach",
      desc: "Section 11 of the Census Act prescribes severe criminal penalties, fines, and imprisonment for any census officer or enumerator who unlawfully discloses or misuses confidential citizen responses.",
      icon: AlertOctagon,
      badge: "Section 11 Penal Sanctions",
    },
    {
      title: "Zero Server Persistence on Portal",
      desc: "The Jan Ganana self-enumeration architecture utilizes client-side isolated memory for drafts. Your answers generate a local cryptographic QR token and are never uploaded to centralized servers without explicit authorized handshake.",
      icon: ServerOff,
      badge: "Zero-Knowledge Architecture",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3 transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Statutory Legal Citation Box */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <FileText className="h-4 w-4 text-saffron" />
          <span>Statutory Text of Section 15, The Census Act 1948</span>
        </div>
        <blockquote className="rounded-xl border-l-4 border-primary bg-card/90 p-4 font-serif text-xs italic text-foreground leading-relaxed shadow-xs">
          &ldquo;Records of census not open to inspection nor admissible in evidence: No person shall have a right to inspect any book, register or record made by a census-officer in the discharge of his duty as such, or any schedule delivered under section 10, and notwithstanding anything to the contrary in the Indian Evidence Act, 1872, no entry in any such book, register, record or schedule shall be admissible as evidence in any civil proceeding whatsoever or in any criminal proceeding...&rdquo;
        </blockquote>
        <p className="text-[11px] text-muted-foreground text-right font-mono">
          — The Census Act, 1948 (Act No. 37 of 1948), Gazette of India
        </p>
      </div>
    </div>
  );
}
