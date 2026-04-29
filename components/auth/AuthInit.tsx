"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { loadStoredAuth } from "@/store/features/auth/authSlice";

export default function AuthInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadStoredAuth());
  }, [dispatch]);

  return null;
}
