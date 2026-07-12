import api from "../../identity-profile/services/api";
import { getSupabase } from "../../../config/supabaseClient";

const bucket = import.meta.env.VITE_SUPABASE_BUCKET || "department-photos";

export interface PublishedSpace {
  id: string;
  owner_id: string;
  city_id: string | null;
  title: string;
  description: string;
  monthly_price: number;
  location_address: string;
  neighborhood: string | null;
  space_type: string | null;
  common_areas: string[];
  amenities: string[];
  images: string[];
  is_available: boolean;
  created_at?: string;
}

export async function uploadDepartmentPhotos(
  files: File[],
  folderPath: string,
) {
  const supabase = getSupabase();
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const filePath = `${folderPath}/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      if (/bucket/i.test(uploadError.message)) {
        throw new Error(
          `El bucket "${bucket}" no existe en Supabase Storage. ` +
            "Verifica el nombre en la consola y en VITE_SUPABASE_BUCKET.",
        );
      }
      throw new Error(`Error subiendo "${file.name}": ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    if (!publicUrlData?.publicUrl) {
      throw new Error("No se pudo obtener la URL pública de la imagen");
    }

    uploadedUrls.push(publicUrlData.publicUrl);
  }

  return uploadedUrls;
}

export async function createSpace(payload: {
  ownerId: string;
  cityId: string;
  title: string;
  description: string;
  monthlyPrice: number;
  locationAddress: string;
  neighborhood: string;
  spaceType: string;
  commonAreas: string[];
  amenities: string[];
  images: string[];
}) {
  const response = await api.post("/api/v1/roomies/spaces", payload);
  return response.data;
}

export async function listSpaces(): Promise<PublishedSpace[]> {
  const response = await api.get("/api/v1/roomies/spaces");
  return response.data?.data || response.data || [];
}

export async function updateSpace(
  spaceId: string,
  payload: Partial<{
    cityId: string;
    title: string;
    description: string;
    monthlyPrice: number;
    locationAddress: string;
    neighborhood: string;
    spaceType: string;
    commonAreas: string[];
    amenities: string[];
    images: string[];
  }>,
): Promise<PublishedSpace> {
  const response = await api.put(`/api/v1/roomies/spaces/${spaceId}`, payload);
  return response.data;
}

export async function unpublishSpace(spaceId: string): Promise<void> {
  await api.delete(`/api/v1/roomies/spaces/${spaceId}`);
}

export async function addExpense(payload: {
  departmentId: string;
  payerId: string;
  amount: number;
  description: string;
}) {
  const response = await api.post("/api/expenses", payload);
  return response.data;
}

export async function getExpenses(departmentId: string) {
  const response = await api.get(`/api/expenses/${departmentId}`);
  return response.data;
}
