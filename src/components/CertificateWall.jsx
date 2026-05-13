import { useMemo, useState, useEffect } from "react";
import CertificateFrame from "./CertificateFrame";
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Award,
  Filter,
} from "lucide-react";
import { Button } from "./ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import certificates from "../assets/certificates.json";
import Loader from "./Loader";

const ITEMS_PER_PAGE = 6;

const CertificateWall = ({ isDark, onToggleTheme }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [transition, setTransition] = useState("idle");
  const [pageLoaded, setPageLoaded] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
      setInitialLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const institutions = useMemo(() => {
    const unique = Array.from(
      new Set(certificates.map((cert) => cert.institution)),
    );
    return unique.sort();
  }, []);

  const filteredCertificates = useMemo(() => {
    const sorted = [...certificates].sort((a, b) => b.year - a.year);
    if (selectedInstitution === "") {
      return sorted;
    }
    return sorted.filter((cert) => cert.institution === selectedInstitution);
  }, [selectedInstitution]);

  const totalPages = Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCertificates = filteredCertificates.slice(startIndex, endIndex);

  const handleInstitutionChange = (value) => {
    setSelectedInstitution(value);
    setCurrentPage(1);
  };

  const goToPage = (nextPage) => {
    if (transition !== "idle" || nextPage < 1 || nextPage > totalPages) return;
    setTransition("exiting");
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      setCurrentPage(nextPage);
    }, 200);

    setTimeout(() => {
      setTransition("entering");
    }, 250);

    setTimeout(() => {
      setTransition("idle");
    }, 500);
  };

  const handlePreviousPage = () => goToPage(currentPage - 1);
  const handleNextPage = () => goToPage(currentPage + 1);

  if (initialLoading) return <Loader />;

  return (
    <div className="relative min-h-screen bg-linear-to-br from-wall-start via-wall-mid to-wall-end">
      <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')]" />

      {/* Dark mode toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleTheme}
          className="bg-background/80 backdrop-blur-sm border-border shadow-lg hover:border-gold/50 transition-colors text-foreground"
          aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="relative container mx-auto px-4 py-12 md:py-20">
        {/* Hero Header */}
        <header className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 border border-border text-muted-foreground text-xs font-medium mb-6 tracking-wide uppercase shadow-sm">
            <Award className="h-3.5 w-3.5 text-gold" />
            <span>Portafolio de certificaciones</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 tracking-tight text-balance bg-linear-to-r from-foreground via-gold to-foreground bg-clip-text text-transparent">
            Muro de la Fama
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-gold/40 via-gold to-gold/40 mx-auto rounded-full mb-6" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Una colección de logros y certificaciones que representan años de
            dedicación y aprendizaje continuo
          </p>
        </header>

        {/* Counter + Filter bar */}
        <div className="relative z-99 flex flex-col items-center gap-4 mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 border border-border text-sm font-medium shadow-sm">
            <Award className="h-4 w-4 text-gold" />
            <span className="text-foreground">
              {filteredCertificates.length} certificado
              {filteredCertificates.length !== 1 ? "s" : ""}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-foreground">
              {institutions.length} institucion
              {institutions.length !== 1 ? "es" : ""}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 bg-background/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg border border-border">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground shrink-0">
              <Filter className="h-4 w-4 text-gold" />
              <label htmlFor="institution-filter">
                Filtrar por institución:
              </label>
            </div>
            <Select
              value={selectedInstitution}
              onValueChange={handleInstitutionChange}
            >
              <SelectTrigger
                id="institution-filter"
                className={`w-[280px] transition-colors ${selectedInstitution ? "border-gold/50 text-gold-text" : ""}`}
              >
                <SelectValue placeholder="Todas las instituciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las instituciones</SelectItem>
                {institutions.map((institution) => (
                  <SelectItem key={institution} value={institution}>
                    {institution}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Certificate Grid */}
        <div
          className={`flex flex-wrap flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16 md:pl-20 pt-12 mb-12 transition-all duration-200 ${
            transition === "exiting"
              ? "opacity-0 scale-95"
              : "opacity-100 scale-100"
          }`}
        >
          {currentCertificates.map((cert, index) => (
            <div
              key={cert.id}
              className="animate-fade-slide-up"
              style={{ animationDelay: `${pageLoaded ? index * 50 : 0}ms` }}
            >
              <CertificateFrame certificate={cert} index={index} />
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-background/80 backdrop-blur-sm hover:border-gold/50 hover:text-gold-text transition-colors"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-5 py-2 rounded-lg shadow-lg border border-border">
              {Array.from({ length: totalPages }, (_, i) => (
                <span
                  key={i}
                  className={`text-sm font-medium transition-colors ${
                    i + 1 === currentPage
                      ? "text-gold-text"
                      : "text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon-lg"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-background/80 backdrop-blur-sm hover:border-gold/50 hover:text-gold-text transition-colors"
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        {filteredCertificates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Award className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              No se encontraron certificados
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              No hay certificados de esta institución. Intenta con otro filtro.
            </p>
            <Button
              variant="outline"
              onClick={() => handleInstitutionChange("")}
            >
              Ver todos los certificados
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateWall;
