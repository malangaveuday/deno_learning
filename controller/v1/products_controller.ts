import { Product } from "../../interface.ts";

const products: Product[] = [
  {
    productSize: "",
    item: "DELUXE COOKED HAM",
    plu_upc: "",
    price: "$5.15",
    productId: "102",
    catId: "1",
    uom: "LB",
  },
  {
    productSize: "",
    item: "DELUXE LOW-SODIUM COOKED HAM ",
    plu_upc: "",
    price: "$5.15",
    productId: "159",
    catId: "1",
    uom: "LB",
  },
  {
    productSize: "",
    item: "DELUXE LOW-SODIUM WHOLE HAM",
    plu_upc: "",
    price: "$5.15",
    productId: "105",
    catId: "1",
    uom: "LB",
  },
  {
    productSize: "",
    item: "SMOKED VIRGINA HAM",
    plu_upc: "",
    price: "$5.15",
    productId: "156",
    catId: "1",
    uom: "LB",
  },
  {
    productSize: "",
    item: "HONEY MAPLE HAM",
    plu_upc: "",
    price: "$5.15",
    productId: "150",
    catId: "1",
    uom: "LB",
  },
];

// get all products
// api GET /api/v1/products
const getAllProducts = ({ response }: { response: any }) => {
  response.body = {
    success: true,
    data: products,
  };
};

// get product by productId
// api GET /api/v1/products/:id
const getProductById = ({
  response,
  params,
}: {
  response: any;
  params: { id: string };
}) => {
  const product = products.filter(
    (product) => product.productId === params.id
  )[0];
  if (product) {
    response.status = 200;
    response.body = {
      success: true,
      product,
    };
  } else {
    response.status = 404;
    response.body = {
      success: true,
      message: "Product with given id not exists.",
    };
  }
};

// update product by id
// api PUT /api/v1/products/:id
const updateProduct = async ({
  response,
  params,
  request,
}: {
  response: any;
  params: { id: string };
  request: any;
}) => {
  const requestBody = await request.body();
  if (!request.hasBody) {
    const product = products.filter(
      (product) => product.productId === params.id
    )[0];
    response.status = 302;
    response.body = {
      success: true,
      product,
    };
  } else {
    const updatedProductData = requestBody.value.product;
    const updatedProducts = products.map((product) =>
      product.productId === params.id
        ? { ...product, ...updatedProductData }
        : product
    );
    response.status = 200;
    response.body = {
      success: 200,
      products: updatedProducts,
    };
  }
};

export { getAllProducts, getProductById, updateProduct };
