import { ExternalLink, Youtube, FileText } from "lucide-react";

interface ProductLinksProps {
  website_url?: string | null;
  linkedin_url?: string | null;
  video_url?: string | null;
  pitchdeck_url?: string | null;
}

export const ProductLinks = ({
  website_url,
  linkedin_url,
  video_url,
  pitchdeck_url,
}: ProductLinksProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        {website_url && (
          <a
            href={website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent hover:text-accent-dark transition-colors group"
          >
            <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
            Sitio web
          </a>
        )}
        
        {linkedin_url && (
          <a
            href={linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent hover:text-accent-dark transition-colors group"
          >
            <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
            LinkedIn
          </a>
        )}

        {video_url && (
          <a
            href={video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent hover:text-accent-dark transition-colors group"
          >
            <Youtube size={16} className="group-hover:scale-110 transition-transform" />
            Ver demo en video
          </a>
        )}
      </div>

      <div className="space-y-2">
        {pitchdeck_url && (
          <a
            href={pitchdeck_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors group"
          >
            <FileText size={16} className="group-hover:scale-110 transition-transform" />
            Descargar Pitch Deck
          </a>
        )}
      </div>
    </div>
  );
};