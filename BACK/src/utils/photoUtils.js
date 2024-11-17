import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { deleteImageError, saveImageError } from "../services/errorService.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const savePhotoUtils = async (img, width) => {
  try {
    const uploadResult = await cloudinary.uploader
      .upload(`data:${img.mimetype};base64,${img.data.toString("base64")}`, {
        folder: "uploads",
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("uploadResult", uploadResult);
    return uploadResult.secure_url;
  } catch (error) {
    console.error(error);
    saveImageError();
  }
};

/*export const deletePhotoUtils = async (imgName) => {
  try {
    //especifica la ruta en donde está guardado el archivo y el nombre del archivo a guardar
    const imgPath = path.join(UPLOADS_DIR, imgName);

    try {
      // intenta acceder a esa imagen
      await fs.access(imgPath);
    } catch {
      //si no hay imagen, simplemente retorna y no borra nada.
      return;
    }

    // si hay imagen lo que hago es borrarlo
    await fs.unlink(imgPath);
  } catch (error) {
    console.error(error);
    deleteImageError();
  }
};*/

export const deletePhotoUtils = async (imgName) => {
  const parts = imgName.split("/");

  // Eliminar el prefijo de la URL hasta '/upload/'
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) {
    throw new Error('URL no válida: no contiene "/upload/"');
  }

  // Tomar las partes después de 'upload' y antes de la extensión
  const publicIdWithExtension = parts.slice(uploadIndex + 1).join("/");

  // Remover la extensión (.jpg, .png, etc.)
  const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

  cloudinary.api.resources({ type: "upload" }, (error, result) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Imágenes:", result.resources);
    }
  });
};

export const duplicatePhotoUtils = async (imgName) => {
  try {
    // Crea la ruta de la imagen a copiar
    const imagePath = path.join(UPLOADS_DIR, imgName);

    // Leer la imagen original desde la ruta proporcionada
    const originalImage = await fs.readFile(imagePath);

    // configuro el nombre que va a tener la imagen
    const newImgName = `${uuidv4()}.jpg`;

    // configuro el path del lugar donde voy a guardar la imagen
    const pathImg = path.join(UPLOADS_DIR, newImgName);

    // Guardar el archivo en el disco
    await fs.writeFile(pathImg, originalImage);

    return newImgName;
  } catch (error) {
    console.error(error);
    saveImageError();
  }
};
