import { NextResponse } from "next/server";

const products = [
  {
    id: 1,
    name: "Galaxy Arc Pods",
    description: "Adaptive earbuds that recalibrate EQ based on ambient noise.",
    price: 189,
  },
  {
    id: 2,
    name: "Electra Beam Projector",
    description: "Pocket-sized 4K projector with ultra-short throw lens.",
    price: 649,
  },
  {
    id: 3,
    name: "SmartFrame 2",
    description: "Modular display that magnetically docks to expand canvas.",
    price: 999,
  },
];

export async function GET() {
  return NextResponse.json({ products });
}
