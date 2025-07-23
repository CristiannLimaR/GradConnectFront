import {
  getWOffers as getOffersReq,
  searchWOffer as searchOfferReq,
  saveWOffer as saveOfferReq,
  editWOffer as editOfferReq,
  deleteWOffer as deleteOfferReq,
} from "../service/api";

import { useState } from "react";
import { toast } from "sonner";

export const useOffer = () => {
  const [offers, setOffers] = useState([]);

  // LISTAR
  const getWOffers = async () => {
    const response = await getOffersReq();

    if (response.error) {
      toast.error("Error al obtener wOffers", {
        description:
          response.error?.response?.data || "Error al obtener wOffers",
        duration: 2000,
      });
      return { error: true };
    }

    setOffers(response?.data?.offers || []);
    console.log(response.data);
    return response.data;
  };

  // BUSCAR
  const searchOffer = async (id) => {
    const response = await searchOfferReq();

    if (response.error) {
      toast.error("Error al obtener wOffers", {
        description:
          response.error?.response?.data || "Error al buscar la oferta.",
        duration: 2000,
      });
      return { error: true };
    }

    return response.data;
  };

  // CREATE
  const saveOffer = async (data) => {
    const response = await saveOfferReq();

    if (response.error) {
      toast.error("Error al obtener wOffers", {
        description:
          response.error?.response?.data || "Error al guardar la oferta.",
        duration: 2000,
      });
      return { error: true };
    }

    return response.data;
  };

  // EDIT
  const editOffer = async (id, data) => {
    const response = await editOfferReq();

    if (response.error) {
      toast.error("Error al obtener wOffers", {
        description:
          response.error?.response?.data || "Error al editar la oferta.",
        duration: 2000,
      });
      return { error: true };
    }

    return response.data;
  };

  // DELETE
  const deleteOffer = async (id) => {
    const response = await deleteOfferReq();

    if (response.error) {
      toast.error("Error al obtener wOffers", {
        description:
          response.error?.response?.data || "Error al editar la oferta.",
        duration: 2000,
      });
      return { error: true };
    }

    return response.data;
  };

  return {
    offers,
    getWOffers,
    searchOffer,
    saveOffer,
    editOffer,
    deleteOffer,
  };
};
