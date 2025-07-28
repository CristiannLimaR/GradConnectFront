import {
  getWOffers as getOffersReq,
  searchWOffer as searchOfferReq,
  saveWOffer as saveOfferReq,
  editWOffer as editOfferReq,
  deleteWOffer as deleteOfferReq,
  getOffersByEnterprise as getOffersByEnterpriseReq
} from "../../service/api";

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
    const response = await searchOfferReq(id);

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
    const response = await saveOfferReq(data);

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
    const response = await editOfferReq(id, data);

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
    const response = await deleteOfferReq(id);

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

  // WOffers por empresa
  const getOffersByEnterprise = async (enterpriseId) => {
    const response = await getOffersByEnterpriseReq(enterpriseId)

    if (response.error) {
      toast.error("Error al obtener wOffers por empresa", {
        description:
          response.error?.response?.data || "Error al obtener wOffers por empresa",
        duration: 2000,
      });
      return { error: true };
    }

    return response.data
  }

  return {
    offers,
    getWOffers,
    searchOffer,
    saveOffer,
    editOffer,
    deleteOffer,
    getOffersByEnterprise
  };
};