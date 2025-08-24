import Hero from "@/app/components/home/Hero";
import Categories from "@/app/components/home/Categories";
import FeaturedProducts from "@/app/components/home/FeaturedProducts";
import WhyUs from "./components/WhyUs";
import BlogPreview from "@/app/components/home/BlogPreview";
import CTA from "@/app/components/home/CTA";

export const revalidate = 60;

export default function Home() {
  return (
    <main className="bg-background">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyUs />
      <BlogPreview />
      <CTA />
    </main>
  );
}
