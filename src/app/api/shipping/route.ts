// app/api/shipping/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   const { postalCodeTo } = await req.json();

   const payload = {
      from: { postal_code: process.env.MELHOR_ENVIO_CEP_ORIGEM },
      to: { postal_code: postalCodeTo },
      products: [
         {
            id: "palmilha",
            width: 15,
            height: 5,
            length: 30,
            weight: 0.5,
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
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
            "User-Agent": "SOS FORMS claytonfuzetti@podoshop.com.br",
         },
         body: JSON.stringify(payload),
      }
   );

   const data = await response.json();

   if (!response.ok) {
      console.error("Melhor Envios erro:", JSON.stringify(data));
      return NextResponse.json({ error: data }, { status: 400 });
   }

   const options = (Array.isArray(data) ? data : [])
      .filter((s: any) => !s.error)
      .sort((a: any, b: any) => Number(a.custom_price) - Number(b.custom_price));

   return NextResponse.json({ options });
}