import WhyUs from "./components/WhyUs";

export default function Home() {
  return (
    <div className="bg-background flex flex-col items-center justify-items-center min-h-screen ">
      <h1 className="text-accent font-bold text-2xl m-10">گل فروش</h1>

      <WhyUs />
    </div>
  );
}
