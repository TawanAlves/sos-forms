// app/api/shipping/route.ts
import { NextRequest, NextResponse } from "next/server";

// 1. Gera o token OAuth2
async function getMelhorEnvioToken() {
   const res = await fetch("https://www.melhorenvio.com.br/oauth/token", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         "User-Agent": "SOS FORMS claytonfuzetti@podoshop.com.br",
      },
      body: JSON.stringify({
         grant_type: "client_credentials",
         client_id: process.env.MELHOR_ENVIO_CLIENT_ID,
         client_secret: process.env.MELHOR_ENVIO_SECRET,
         scope: "shipping-calculate",
      }),
   });

   const data = await res.json();
   return data.access_token as string;
}

export async function POST(req: NextRequest) {
   const { postalCodeTo } = await req.json();

   const token = await getMelhorEnvioToken();

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
            Authorization: `Bearer ${token}`,
            "User-Agent": "SOS FORMS claytonfuzetti@podoshop.com.br",
         },
         body: JSON.stringify(payload),
      }
   );

   const data = await response.json();

   if (!response.ok) {
      console.error("Melhor Envios erro:", data);
      return NextResponse.json({ error: data }, { status: 400 });
   }

   const options = data
      .filter((s: any) => !s.error)
      .sort((a: any, b: any) => a.custom_price - b.custom_price);

   return NextResponse.json({ options });
}  