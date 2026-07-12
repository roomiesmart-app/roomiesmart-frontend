import api from "../../identity-profile/services/api";

export interface CatalogItem {
  id: string;
  name: string;
}

async function fetchCatalog(path: string): Promise<CatalogItem[]> {
  const response = await api.get(`/api/v1/catalogs/${path}`);
  return response.data?.data || [];
}

export const fetchCities = () => fetchCatalog("cities");
export const fetchCommonAreas = () => fetchCatalog("common-areas");
export const fetchAmenities = () => fetchCatalog("amenities");

export const CATALOG_QUERY_OPTIONS = {
  staleTime: 10 * 60_000,
  retry: 2,
} as const;
