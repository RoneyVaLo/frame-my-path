import { useMemo, useState } from "react";
import CertificateFrame from "./CertificateFrame";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
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

const ITEMS_PER_PAGE = 4;

const CertificateWall = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [loading, setLoading] = useState(false);

  // Get unique institutions for filter
  const institutions = useMemo(() => {
    const unique = Array.from(
      new Set(certificates.map((cert) => cert.institution))
    );
    return unique.sort();
  }, []);

  // Filter certificates by institution
  const filteredCertificates = useMemo(() => {
    certificates.sort((a, b) => b.year - a.year);
    if (selectedInstitution === "") {
      return certificates;
    }
    return certificates.filter(
      (cert) => cert.institution === selectedInstitution
    );
  }, [selectedInstitution]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCertificates = filteredCertificates.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleInstitutionChange = (value) => {
    setSelectedInstitution(value);
    setCurrentPage(1);
  };

  const handlePreviousPage = async () => {
    setLoading(true);
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleNextPage = async () => {
    setLoading(true);
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#e8dfd0] via-[#d4c5b0] to-[#c9b89a] dark:from-[#2a2520] dark:via-[#1f1b17] dark:to-[#15120f]">
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')]" />

      <div className="relative container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-4 tracking-tight text-balance">
            Muro de la Fama
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Una colección de logros y certificaciones que representan años de
            dedicación y aprendizaje continuo
          </p>
        </header>

        <div className="flex justify-center mb-8 md:mb-12">
          <div className="z-50 flex flex-col md:flex-row items-center gap-3 bg-background/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg border border-border">
            <label
              htmlFor="institution-filter"
              className="text-sm font-medium text-foreground"
            >
              Filtrar por institución:
            </label>
            <Select
              value={selectedInstitution}
              onValueChange={handleInstitutionChange}
            >
              <SelectTrigger id="institution-filter" className="w-[280px]">
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
          className={`flex flex-wrap flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16 md:pl-20 pt-12 mb-12`}
        >
          {currentCertificates.map((cert, index) => (
            <CertificateFrame key={cert.id} certificate={cert} index={index} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-background/80 backdrop-blur-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-border">
              <span className="text-sm font-medium text-foreground">
                Página {currentPage} de {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-background/80 backdrop-blur-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No se encontraron títulos para esta institución.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateWall;
