// const STATS = [
//   { value: "500+", label: "Schools onboarded" },
//   { value: "40,000+", label: "Students managed" },
//   { value: "₦2B+", label: "Fees processed" },
//   { value: "98%", label: "Parent satisfaction" },
// ];

// export default function StatsBar() {
//   return (
//     <section className="w-full border-y border-border-default bg-white px-6 py-10">
//       <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-8 md:grid-cols-4">
//         {STATS.map((s, i) => (
//           <div
//             key={s.label}
//             className={`flex flex-col items-center gap-1 ${i !== STATS.length - 1 ? "md:border-r md:border-border-default" : ""}`}
//           >
//             <span className="text-[40px] font-semibold leading-none tracking-tight text-brand-green">
//               {s.value}
//             </span>
//             <span className="text-[15px] text-text-body">{s.label}</span>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
