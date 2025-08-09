import { ShoppingCart } from "lucide-react";
import Button from "./components/ui/Button";

export default function Home() {
  return (
    <div className="bg-background text-text font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-accent font-bold text-2xl">فروشگاه گل</h1>
       <h1 className="text-primary font-bold text-2xl">به فروشگاه گل من خوش آمدید</h1> 
        <Button>خرید
          <ShoppingCart className="w-4 h-4"/>
        </Button>
    </div>
  );
}
