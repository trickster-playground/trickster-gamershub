export default function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <h4 className="mb-4 text-xs font-semibold tracking-widest text-white uppercase">
        {title}
      </h4>

      {children}
    </div>
  );
}
