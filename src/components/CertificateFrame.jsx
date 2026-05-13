import { useState } from "react";
import { cn } from "../utils/cn";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";
import { useEffect } from "react";

const OFFSETS = [0, 24, 8, 32, 16, 40];

const CertificateFrame = ({ certificate, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = certificate.image;
    img.onload = () => {
      setIsHorizontal(img.width > img.height);
      setImageLoaded(true);
    };
  }, [certificate.image]);

  const rotations = [
    "-rotate-1",
    "rotate-1",
    "-rotate-2",
    "rotate-2",
    "0",
    "-rotate-1",
  ];
  const rotation = rotations[index % rotations.length];
  const mtOffset = OFFSETS[index % OFFSETS.length];

  return (
    <>
      <div
        onClick={() => setIsDialogOpen(true)}
        className={cn(
          "group relative transition-all duration-300 ease-out cursor-pointer",
          "w-[250px] md:w-[300px] lg:w-[340px]",
          rotation,
          isHovered && "scale-105 z-10 cursor-zoom-in",
        )}
        style={{ marginTop: `${mtOffset}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Frame shadow */}
        <div
          className={cn(
            "absolute -inset-4 blur-xl rounded-sm transition-all duration-300",
            isHovered ? "opacity-70 bg-gold/15" : "opacity-40 bg-black/20",
          )}
        />

        {/* Outer frame (wood effect) */}
        <div className="relative bg-linear-to-br from-wood-light via-wood-mid to-wood-dark p-4 md:p-6 rounded-sm shadow-2xl transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgba(200,164,92,0.15)]">
          {/* Inner frame (mat board) */}
          <div className="bg-linear-to-br from-mat-light to-mat-dark p-3 md:p-4 shadow-inner">
            {/* Certificate container */}
            <div
              className={cn(
                "relative bg-white shadow-md overflow-hidden",
                isHorizontal ? "aspect-4/3" : "aspect-3/4",
              )}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 animate-shimmer" />
              )}
              <img
                src={certificate.image || "/placeholder.svg"}
                alt={`Certificado de ${certificate.title}`}
                className={cn(
                  "object-cover transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0",
                )}
                loading="lazy"
              />

              {/* Overlay with certificate info on hover */}
              <div
                className={cn(
                  "absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent",
                  "flex flex-col justify-end p-4 md:p-6",
                  "transition-opacity duration-300",
                  isHovered ? "opacity-100" : "opacity-0",
                )}
              >
                <h3 className="text-white font-serif font-bold text-lg md:text-xl mb-2 text-balance">
                  {certificate.title}
                </h3>
                <p className="text-white/90 text-sm md:text-base mb-1">
                  {certificate.institution}
                </p>
                <p className="text-white/70 text-xs md:text-sm font-mono">
                  {certificate.year}
                </p>
              </div>
            </div>
          </div>

          {/* Hanging wire effect */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-2">
            <div className="w-full h-0.5 bg-linear-to-r from-transparent via-[#4a4a4a] to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#4a4a4a] rounded-full shadow-sm" />
          </div>
        </div>

        {/* Certificate label below frame */}
        <div className="mt-4 text-center opacity-100">
          <p className="text-sm font-medium text-foreground text-balance">
            {certificate.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {certificate.year}
          </p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-y-auto">
          <DialogHeader className="p-6 pb-4 shrink-0">
            <DialogTitle className="text-2xl font-serif font-bold text-balance">
              {certificate.title}
            </DialogTitle>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-2">
              <p className="font-medium">{certificate.institution}</p>
              <p className="font-mono">{certificate.year}</p>
            </div>
          </DialogHeader>
          <div className="overflow-y-auto overflow-x-hidden flex-1 min-h-0">
            <div
              className={cn(
                "relative w-full bg-muted",
                isHorizontal ? "aspect-4/3" : "aspect-3/4",
              )}
            >
              <img
                src={certificate.image || "/placeholder.svg"}
                alt={`Certificado de ${certificate.title}`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CertificateFrame;
