"use client";

import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { Truck, AlarmClock, Headset, ShieldCheck, Phone } from "lucide-react";
import Input from "./Input";
import Button from "./Button";

/* ===== Types (بدون any) ===== */
type Status = "draft" | "published";
interface PostRow {
  id: string;
  title: string;
  slug: string;
  status: Status;
}
interface ProductRow {
  id: string;
  name: string;
  slug: string;
}

/* ===== Footer ===== */
export default function Footer() {
  const [phone, setPhone] = useState<string>("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: ارسال شماره به API
    setPhone("");
  };

  // مقالات
  const [articles, setArticles] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");

  // آخرین محصولات
  const [latestProducts, setLatestProducts] = useState<ProductRow[]>([]);
  const [pLoading, setPLoading] = useState<boolean>(false);
  const [pErr, setPErr] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function fetchArticles() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch("/api/admin/posts/list", {
          credentials: "include",
        });
        const json: { ok?: true; rows?: PostRow[]; error?: string } =
          await res.json();
        if (!res.ok || !json.ok || !json.rows) {
          throw new Error(json.error || `HTTP ${res.status}`);
        }
        const latest = json.rows
          .filter((r) => r.status === "published")
          .slice(0, 4);
        if (isMounted) setArticles(latest);
      } catch (e) {
        if (isMounted)
          setErr(e instanceof Error ? e.message : "خطا در دریافت مقالات");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function fetchLatestProducts() {
      setPLoading(true);
      setPErr("");
      try {
        const res = await fetch("/api/admin/product/latest", { cache: "no-store" });
        const json: { ok?: true; rows?: ProductRow[]; error?: string } =
          await res.json();
        if (!res.ok || !json.ok || !json.rows) {
          throw new Error(json.error || `HTTP ${res.status}`);
        }
        if (isMounted) setLatestProducts(json.rows);
      } catch (e) {
        if (isMounted)
          setPErr(e instanceof Error ? e.message : "خطا در دریافت محصولات");
      } finally {
        if (isMounted) setPLoading(false);
      }
    }

    fetchArticles();
    fetchLatestProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="border-t border-border bg-background text-text bg-white">
      {/* ویژگی‌ها */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {/* ... همان 4 باکس ویژگی ... */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full p-3 ring-1 ring-border bg-white text-accent">
              <Truck className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold">ارسال به شهر تهران</div>
            <div className="text-xs text-text-muted">
              در کمتر از ۳ ساعت از ما گیاه تحویل بگیرید!
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full p-3 ring-1 ring-border bg-white text-accent">
              <AlarmClock className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold">زمان و نحوه دریافت گیاه</div>
            <div className="text-xs text-text-muted">
              ارسال از ۹ تا ۱۹ در شهر تهران
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full p-3 ring-1 ring-border bg-white text-accent">
              <Headset className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold">پشتیبانی همیشگی از گیاه</div>
            <div className="text-xs text-text-muted">
              آموزش نگهداری و تکثیر گیاهان آپارتمانی
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full p-3 ring-1 ring-border bg-white text-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold">ضمانت تحویل سالم گیاه</div>
            <div className="text-xs text-text-muted">
              بازگشت وجه در صورت آسیب گیاه
            </div>
          </div>
        </div>
      </div>

      {/* لینک‌ها + خبرنامه */}
      <div className="bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* خبرنامه */}
            <div>
              {/* ... همانی که داشتی ... */}
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

            {/* ستون‌های لینک + مجله */}
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {/* محصولات جدید (به‌جای دسته‌بندی ثابت) */}
              <div>
                <h4 className="mb-3 text-base font-extrabold text-primary">
                  محصولات جدید
                </h4>
                <ul className="space-y-2 text-sm">
                  {pLoading && (
                    <li className="text-text-muted">در حال بارگذاری…</li>
                  )}
                  {pErr && !pLoading && (
                    <li className="text-red-600">خطا: {pErr}</li>
                  )}
                  {!pLoading &&
                    !pErr &&
                    latestProducts.map((p) => (
                      <li key={p.id}>
                        <Link
                          className="hover:text-primary"
                          href={`/products/${p.slug}`}
                        >
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  {!pLoading && !pErr && latestProducts.length === 0 && (
                    <li className="text-text-muted">محصولی یافت نشد.</li>
                  )}
                </ul>
              </div>

              {/* لینک‌های خدمات مشتریان (بدون تغییر) */}
              <div>
                <h4 className="mb-3 text-base font-extrabold text-primary">
                  خدمات مشتریان
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link className="hover:text-primary" href="/help/how-to-order">
                      نحوه ثبت سفارش
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary" href="/help/payments">
                      شیوه‌های پرداخت
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary" href="/help/shipping">
                      رویه ارسال سفارش
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary" href="/help/packaging">
                      نحوه بسته‌بندی گیاه
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-primary" href="/help/samples">
                      نمونه سفارشات ارسال شده
                    </Link>
                  </li>
                </ul>
              </div>

              {/* مجله گل‌فروش (همانی که داشتی) */}
              <div>
                <h4 className="mb-3 text-base font-extrabold text-primary">
                  مجله گل‌فروش
                </h4>
                <ul className="space-y-2">
                  {loading && (
                    <li className="text-sm text-text-muted">در حال بارگذاری…</li>
                  )}
                  {err && !loading && (
                    <li className="text-sm text-red-600">خطا: {err}</li>
                  )}
                  {!loading &&
                    !err &&
                    articles.map((a) => (
                      <li key={a.id} className="text-sm">
                        <Link className="hover:text-blue-500" href={`/blog/${a.slug}`}>
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  {!loading && !err && articles.length === 0 && (
                    <li className="text-sm text-text-muted">مقاله‌ای یافت نشد.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-text-muted mb-5 md:mb-0">
            <span>
              تمامی حقوق این وب‌سایت متعلق به{" "}
              <a href="https://sunflower-dev.com" className="text-primary font-bold">
                آزاده شریفی سلطانی
              </a>{" "}
              است.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
