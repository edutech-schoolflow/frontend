import Image from "next/image";

const STEPS = [
  {
    number: "1",
    title: "Sign up",
    desc: "Create your parent or school account in seconds.",
  },
  {
    number: "2",
    title: "Set up profiles",
    desc: "Parents add children; schools set up classes, teachers, and schedules.",
  },
  {
    number: "3",
    title: "Manage tasks",
    desc: "Track fees, activities, events, and communications all in one place.",
  },
  {
    number: "4",
    title: "Stay updated",
    desc: "Receive real-time notifications and updates to stay on top of everything.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-white px-25 py-20">

      <div className="flex flex-col gap-12.5">

        <h2 className="text-center text-3xl font-bold text-text-heading">
          Get started in 4 easy steps
        </h2>

        {/*
          * Figma: image W:400 H:558 corner-radius:10 | steps W:820 H:558 gap:20
          * Total content: 400 + 20 gap + 820 = 1240px
          */}
        <div className="flex gap-5">

          {/* Left — W:400 H:558 corner-radius:10 (exact Figma dimensions) */}
          <div className="relative h-139.5 w-100 shrink-0 overflow-hidden rounded-[10px]">
            <Image
              src="/images/svg/graduation.svg"
              alt="Students graduating"
              fill
              className="object-cover object-center"
            />
          </div>

          {/*
            * Right — 2×2 steps grid W:820 H:558 gap:20
            * Each card: W:400 H:269, padding V:39 H:46, gap:58, corner-radius:10, fill:white
            * Number circle: large, bg-brand-mint border-brand-green filled
            */}
          <div className="grid flex-1 grid-cols-2 gap-5">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="flex h-[269px] flex-col gap-[58px] rounded-[10px] border border-border-default bg-white py-[39px] px-[25.5px]"
              >
                <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border-2 border-brand-green bg-brand-mint">
                  <span className="text-xl font-semibold text-brand-green">
                    {step.number}
                  </span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-2xl font-medium leading-[28px] text-text-heading">{step.title}</h3>
                  <p className="text-xl font-light leading-[24.5px] text-text-body">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
