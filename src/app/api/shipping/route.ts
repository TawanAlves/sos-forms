// app/api/shipping/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   const body = await req.json();
   const { postalCodeTo } = body;

   const payload = {
      from: { postal_code: process.env.MELHOR_ENVIO_CEP_ORIGEM }, // seu CEP de origem
      to: { postal_code: postalCodeTo },
      products: [
         {
            id: "palmilha",
            width: 15,   // cm
            height: 3,   // cm
            length: 30,  // cm
            weight: 0.3, // kg
            insurance_value: 150,
            quantity: 1,
         },
      ],
      options: {
         receipt: false,
         own_hand: false,
      },
   };

   const response = await fetch(
      "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate",
      // Sandbox: "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate"
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
            "User-Agent": "SeuApp contato@seuapp.com", // obrigatório pela API
         },
         body: JSON.stringify(payload),
      }
   );

   const data = await response.json();

   if (!response.ok) {
      return NextResponse.json({ error: data }, { status: 400 });
   }

   // Filtra apenas opções disponíveis (sem erro) e ordena pelo preço
   const options = data
      .filter((s: any) => !s.error)
      .sort((a: any, b: any) => a.custom_price - b.custom_price);

   return NextResponse.json({ options });
}