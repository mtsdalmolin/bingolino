export default function cloudinaryLoader({ src }: { src: string }) {
  if (src.includes("marker"))
    return `${process.env.NEXT_PUBLIC_BINGOLINO_URL!}${src}`;
  return src;
}
