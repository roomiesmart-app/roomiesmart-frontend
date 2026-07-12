import React from "react";
import type { PublishedSpace } from "../services/PublishService";

export const FALLBACK_SPACE_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600";

interface SpaceCardProps {
  space: PublishedSpace;
  imageHeightClass?: string;
  showTypeBadge?: boolean;

  // Botones/acciones del pie de la tarjeta
  children?: React.ReactNode;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  imageHeightClass = "h-44",
  showTypeBadge = false,
  children,
}) => (
  <article className="flex flex-col overflow-hidden rounded-[28px] border border-[#F1DED6] bg-white shadow-sm">
    <div className={`${imageHeightClass} w-full overflow-hidden bg-gray-100`}>
      <img
        src={space.images?.[0] || FALLBACK_SPACE_IMAGE}
        alt={space.title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
    <div className="flex flex-1 flex-col gap-2 p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold text-[#3B241C] line-clamp-1">
          {space.title}
        </h2>
        <p className="whitespace-nowrap text-lg font-extrabold text-[#8C3A27]">
          ${Number(space.monthly_price).toFixed(0)}
          <span className="text-xs font-semibold text-gray-400">/mes</span>
        </p>
      </div>
      <p className="text-sm text-gray-500">
        {space.neighborhood || space.location_address}
      </p>
      {showTypeBadge && space.space_type && (
        <span className="w-fit rounded-full bg-[#FDF0EB] px-3 py-1 text-xs font-semibold text-[#8C3A27]">
          {space.space_type}
        </span>
      )}
      {children && <div className="mt-auto pt-4">{children}</div>}
    </div>
  </article>
);
