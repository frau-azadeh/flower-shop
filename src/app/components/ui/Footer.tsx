"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { Truck, AlarmClock, Headset, ShieldCheck, Phone } from "lucide-react";
import Input from "./Input";
import Button from "./Button";

export default function Footer() {
  const [phone, setPhone] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: ارسال شماره به API
    setPhone("");
  };

  return (
    <footer className="border-t border-border bg-background text-text bg-white">
      {/* ویژگی‌ها */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full p-3 ring-1 ring-border bg-white text-accent">
              <Truck className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold">ارسال به شهر تهران</div>
            <div className="text-xs text-text-muted">در کمتر از ۳ ساعت از ما گیاه تحویل بگیرید!</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full p-3 ring-1 ring-border bg-white text-accent">
              <AlarmClock className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold">زمان و نحوه دریافت گیاه</div>
            <div className="text-xs text-text-muted">ارسال از ۹ تا ۱۹ در شهر تهران</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full p-3 ring-1 ring-border bg-white text-accent">
              <Headset className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold">پشتیبانی همیشگی از گیاه</div>
            <div className="text-xs text-text-muted">آموزش نگهداری و تکثیر گیاهان آپارتمانی</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full p-3 ring-1 ring-border bg-white text-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold">ضمانت تحویل سالم گیاه</div>
            <div className="text-xs text-text-muted">بازگشت وجه در صورت آسیب گیاه</div>
          </div>
        </div>
      </div>

      {/* لینک‌ها + خبرنامه */}
      <div className="bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* فرم خبرنامه با Input شما */}
            <div>
              <div className="rounded-2xl bg-muted p-5 shadow-sm">
                <h3 className="text-base font-bold mb-3">همیشه اولین نفر باش!</h3>
                <p className="text-sm text-text-muted mb-4">
                  برای اطلاع از آخرین تخفیف‌ها شماره تماست رو وارد کن.
                </p>
                <form onSubmit={onSubmit} className="space-y-3">
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="tel"
                    placeholder="شماره تماس خود را وارد کنید"
                    icon={<Phone className="w-4 h-4" />}
                    className="bg-white border border-border focus:ring-primary"
                  />
                  <Button type="submit" variant="primary" className="w-full">
                    ارسال
                  </Button>
                </form>
              </div>
            </div>

            {/* ستون‌های لینک */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <h4 className="mb-3 text-base font-extrabold text-primary">خدمات مشتریان</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link className="hover:text-primary transition-colors" href="/help/how-to-order">نحوه ثبت سفارش</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/help/payments">شیوه‌های پرداخت</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/help/shipping">رویه ارسال سفارش</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/help/packaging">نحوه بسته‌بندی گیاه</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/help/samples">نمونه سفارشات ارسال شده</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 text-base font-extrabold text-primary">دسته‌بندی محصولات</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link className="hover:text-primary transition-colors" href="/products/indoor">خرید اینترنتی گل و گیاه آپارتمانی ارزان</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/products/cut-flowers">خرید اینترنتی گل از محلات</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/products/houseplants">خرید گل آپارتمانی</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/products/sale">حراج گل و گیاه</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/products/promo-pots">گلدان تبلیغاتی</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/products/fertilizers">خرید کود</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 text-base font-extrabold text-primary">مجله سارینالند</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link className="hover:text-primary transition-colors" href="/mag/humic-acid">کود اسید هیومیک چیست؟ + فواید اسید هیومیک</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/mag/fast-growing">گیاهان آپارتمانی با رشد سریع</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/mag/broadleaf">گیاهان آپارتمانی برگ پهن</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/mag/care-basics">روش نگهداری از انواع بیز گل</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/mag/sowing">نحوه و زمان کاشت انواع بذر گل</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-text-muted">
           <span>تمامی حقوق این وب سایت متعلق به <a href="https://sunflower-dev.com" className="text-primary font-bold">آزاده شریفی سلطانی </a>می باشد </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
