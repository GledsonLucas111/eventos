"use client";
import { useState } from "react";

export default function EventImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  
  return failed ? (
    <div className="grid h-full place-items-center bg-slate-100 text-xs text-slate-500">
      Imagem indisponível
    </div>
  ) : (
    <img
      className="h-full w-full object-cover"
      src={src}
      alt=""
      onError={() => setFailed(true)}
    />
  );
}
