import { Link } from "react-router-dom";

interface ProductLogoProps {
  logo_url?: string | null;
  title: string;
  profile?: {
    username: string;
    avatar_url?: string | null;
  };
}

export const ProductLogo = ({ logo_url, title, profile }: ProductLogoProps) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      {logo_url && (
        <img
          src={logo_url}
          alt={title}
          className="w-16 h-16 object-cover rounded-lg shadow-md"
        />
      )}
      <div className="flex-1">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-sm text-gray-500">
          por{" "}
          <Link
            to={`/perfil/${profile?.username}`}
            className="hover:text-primary transition-colors"
          >
            {profile?.username}
          </Link>
        </p>
      </div>
    </div>
  );
};