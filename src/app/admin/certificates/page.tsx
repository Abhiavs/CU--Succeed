import { prisma } from "@/lib/prisma";
import CertificateToggle from "./CertificateToggle";

export default async function CertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    include: {
      student: true,
      program: true,
    },
    orderBy: { issueDate: 'desc' }
  });

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Certificates Manager</h1>
          <p className="text-muted-foreground font-light">View and manage certificates issued to students.</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">Certificate ID</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">Student Name</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">Program</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">Issue Date</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground text-right">Status / Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 text-sm font-mono text-muted-foreground">
                  {cert.id.substring(0, 8).toUpperCase()}...
                </td>
                <td className="py-4 px-6 text-sm text-white font-medium">
                  {cert.student.name}
                  <div className="text-xs text-muted-foreground font-light">{cert.student.email}</div>
                </td>
                <td className="py-4 px-6 text-sm text-white">
                  {cert.program.name}
                </td>
                <td className="py-4 px-6 text-sm text-muted-foreground">
                  {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="py-4 px-6 text-right">
                   <CertificateToggle certificateId={cert.id} initialStatus={cert.status} />
                </td>
              </tr>
            ))}
            {certificates.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <p>No certificates have been issued yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
