import { QuantityType } from "@prisma/client";
import prisma, { generateUUID } from "./src/config/database.js";
import fs from "fs";
const data = await fs.readFileSync("./data.json", "utf-8");
const newdata = await fs.readFileSync("./newdata.json", "utf-8");
const products = JSON.parse(data);
const newProducts = JSON.parse(newdata);

const slot1 = products.slice(0, 10);
const slot2 = products.slice(10, 20);
const slot3 = products.slice(20, 30);
const slot4 = products.slice(30, 40);
const slot5 = products.slice(40, 50);
const slot6 = products.slice(50, 60);
const slot7 = products.slice(60, 70);
const slot8 = products.slice(70, 80);
const slot9 = products.slice(80, 90);
const slot10 = products.slice(90, 100);
const slot11 = products.slice(100, 110);
const slot12 = products.slice(110, 119);
const slot13 = products.slice(119, 130);
const slot14 = products.slice(130, 140);
const slot15 = products.slice(140, 150);
const slot16 = products.slice(150);

console.log(newProducts);
let productData = newProducts;

// const productData = [
//   {
//     style_code: "ALR00805",
//     jewel_code: "103695",
//     price: 1751000,
//     gold_kt: "14KT",
//     gold_weight: 0.94,
//     gold_colour: "ROSE GOLD",
//     diamond_pcs: 12,
//     diamond_weight: 0.08,
//     diamond_colour: "H-I",
//     diamond_clarity: "VS-SI",
//     lab_certificate: "IGI",
//     height: "8MM",
//     broadness: "8MM",
//     images: [
//       {
//         blurHash: "UDT9Fj?b%~~q^+j[ofof%#ogI9RP_NofRjWA",
//         final:
//           "https://siriog.s3.ap-south-1.amazonaws.com/docs/1771750414737SCP_0773%20copy.jpg",
//       },
//     ],
//   },
// ];

const createMultipleProducts = async (productData) => {
  await productData.map(async (product) => {
    await prisma.product.create({
      data: {
        id: generateUUID(),
        name: product.style_code,
        price: product.price,
        quantityType: QuantityType.UNIT,
        rating: 5.0,
        stock: 10,
        specifications: {
          createMany: {
            data: [
              {
                id: generateUUID(),
                label: "Gold Kt.",
                value: String(product.gold_kt),
              },
              {
                id: generateUUID(),
                label: "Gold Weight",
                value: String(product.gold_weight),
              },
              {
                id: generateUUID(),
                label: "Gold Colour",
                value: String(product.gold_colour),
              },
              {
                id: generateUUID(),
                label: "Diamond Pcs.",
                value: String(product.diamond_pcs),
              },
              {
                id: generateUUID(),
                label: "Diamond Weight",
                value: String(product.diamond_weight),
              },
              {
                id: generateUUID(),
                label: "Diamond Colour",
                value: String(product.diamond_colour),
              },
              {
                id: generateUUID(),
                label: "Diamond Clarity",
                value: String(product.diamond_clarity),
              },
              {
                id: generateUUID(),
                label: "Lab Certificate",
                value: String(product.lab_certificate),
              },
              {
                id: generateUUID(),
                label: "Height",
                value: String(product.height),
              },
              {
                id: generateUUID(),
                label: "Broadness",
                value: String(product.broadness),
              },
              {
                id: generateUUID(),
                label: "Jewel Code",
                value: String(product.jewel_code),
              },
            ],
          },
        },
        // images: {
        //   createMany: {
        //     skipDuplicates: true,
        //     data: product.images.map((fileData) => {
        //       return {
        //         id: generateUUID(),
        //         url: fileData.final,
        //         blurHash: fileData.blurHash,
        //       };
        //     }),
        //   },
        // },
        productVariants: {
          create: {
            id: generateUUID(),
            label: "DEFAULT",
            stock: 10,
            quantityType: QuantityType.UNIT,
            price: product.price,
            specifications: {
              createMany: {
                data: [
                  {
                    id: generateUUID(),
                    label: "Gold Kt.",
                    value: String(product.gold_kt),
                  },
                  {
                    id: generateUUID(),
                    label: "Gold Weight",
                    value: String(product.gold_weight),
                  },
                  {
                    id: generateUUID(),
                    label: "Gold Colour",
                    value: String(product.gold_colour),
                  },
                  {
                    id: generateUUID(),
                    label: "Diamond Pcs.",
                    value: String(product.diamond_pcs),
                  },
                  {
                    id: generateUUID(),
                    label: "Diamond Weight",
                    value: String(product.diamond_weight),
                  },
                  {
                    id: generateUUID(),
                    label: "Diamond Colour",
                    value: String(product.diamond_colour),
                  },
                  {
                    id: generateUUID(),
                    label: "Diamond Clarity",
                    value: String(product.diamond_clarity),
                  },
                  {
                    id: generateUUID(),
                    label: "Lab Certificate",
                    value: String(product.lab_certificate),
                  },
                  {
                    id: generateUUID(),
                    label: "Height",
                    value: String(product.height),
                  },
                  {
                    id: generateUUID(),
                    label: "Broadness",
                    value: String(productData.broadness),
                  },
                  {
                    id: generateUUID(),
                    label: "Jewel Code",
                    value: String(product.jewel_code),
                  },
                ],
              },
            },
            // images: {
            //   createMany: {
            //     skipDuplicates: true,
            //     data: product.images.map((fileData) => {
            //       return {
            //         id: generateUUID(),
            //         url: fileData.final,
            //         blurHash: fileData.blurHash,
            //       };
            //     }),
            //   },
            // },
          },
        },
      },
    });
  });
};

// createMultipleProducts(productData);

const product = productData[0];
// console.log(p roduct);
const createSingleProduct = async (product) => {
  await prisma.product.create({
    data: {
      id: generateUUID(),
      name: product.style_code,
      price: product.price,
      quantityType: QuantityType.UNIT,
      rating: 5.0,
      stock: 10,
      specifications: {
        createMany: {
          data: [
            {
              id: generateUUID(),
              label: "Gold Kt.",
              value: String(product.gold_kt),
            },
            {
              id: generateUUID(),
              label: "Gold Weight",
              value: String(product.gold_weight),
            },
            {
              id: generateUUID(),
              label: "Gold Colour",
              value: String(product.gold_colour),
            },
            {
              id: generateUUID(),
              label: "Diamond Pcs.",
              value: String(product.diamond_pcs),
            },
            {
              id: generateUUID(),
              label: "Diamond Weight",
              value: String(product.diamond_weight),
            },
            {
              id: generateUUID(),
              label: "Diamond Colour",
              value: String(product.diamond_colour),
            },
            {
              id: generateUUID(),
              label: "Diamond Clarity",
              value: String(product.diamond_clarity),
            },
            {
              id: generateUUID(),
              label: "Lab Certificate",
              value: String(product.lab_certificate),
            },
            {
              id: generateUUID(),
              label: "Height",
              value: String(product.height),
            },
            {
              id: generateUUID(),
              label: "Broadness",
              value: String(product.broadness),
            },
            {
              id: generateUUID(),
              label: "Jewel Code",
              value: String(product.jewel_code),
            },
          ],
        },
      },
      images: {
        createMany: {
          skipDuplicates: true,
          data: product.images.map((fileData) => {
            return {
              id: generateUUID(),
              url: fileData.final,
              blurHash: fileData.blurHash,
            };
          }),
        },
      },
      productVariants: {
        create: {
          id: generateUUID(),
          label: "DEFAULT",
          stock: 10,
          quantityType: QuantityType.UNIT,
          price: product.price,
          specifications: {
            createMany: {
              data: [
                {
                  id: generateUUID(),
                  label: "Gold Kt.",
                  value: String(product.gold_kt),
                },
                {
                  id: generateUUID(),
                  label: "Gold Weight",
                  value: String(product.gold_weight),
                },
                {
                  id: generateUUID(),
                  label: "Gold Colour",
                  value: String(product.gold_colour),
                },
                {
                  id: generateUUID(),
                  label: "Diamond Pcs.",
                  value: String(product.diamond_pcs),
                },
                {
                  id: generateUUID(),
                  label: "Diamond Weight",
                  value: String(product.diamond_weight),
                },
                {
                  id: generateUUID(),
                  label: "Diamond Colour",
                  value: String(product.diamond_colour),
                },
                {
                  id: generateUUID(),
                  label: "Diamond Clarity",
                  value: String(product.diamond_clarity),
                },
                {
                  id: generateUUID(),
                  label: "Lab Certificate",
                  value: String(product.lab_certificate),
                },
                {
                  id: generateUUID(),
                  label: "Height",
                  value: String(product.height),
                },
                {
                  id: generateUUID(),
                  label: "Broadness",
                  value: String(product.broadness),
                },
                {
                  id: generateUUID(),
                  label: "Jewel Code",
                  value: String(product.jewel_code),
                },
              ],
            },
          },
          images: {
            createMany: {
              skipDuplicates: true,
              data: product.images.map((fileData) => {
                return {
                  id: generateUUID(),
                  url: fileData.final,
                  blurHash: fileData.blurHash,
                };
              }),
            },
          },
        },
      },
    },
  });
};banner
// createSingleProduct(product);
// prisma.images.create({
//   data:{
//     id: generateUUID(),
//     url: product.images[0].final,
//     blurHash: product.images[0].blurHash,
//     productId: 
//   }
// })