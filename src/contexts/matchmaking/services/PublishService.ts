import api from "../../identity-profile/services/api";
import { supabase } from "../../../config/supabaseClient";

const bucket = import.meta.env.VITE_SUPABASE_BUCKET || "public";

export async function uploadDepartmentPhotos(
  files: File[],
  folderPath: string,
) {
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
      throw uploadError;
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
  images: string[];
}) {
  const response = await api.post("/api/v1/roomies/spaces", payload);
  return response.data;
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
