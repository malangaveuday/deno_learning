import { Client } from "https://deno.land/x/postgres/mod.ts";
import { Product } from "../../interface.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { dbCred } from "../../config.ts";

const client = new Client(dbCred);
// await client.connect();

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
const getAllProducts = async ({ response }: { response: any }) => {
  try {
    await client.connect();
    const result = await client.query("SELECT * FROM PRODUCT");
    const products = result.rows.map((productVal) => {
      const obj: any = {};
      result.rowDescription.columns.map((c, i) => {
        obj[c.name] = productVal[i];
      });
      return obj;
    });
    response.status = 200;
    response.body = {
      success: true,
      products,
    };
  } catch (error) {
    response.body = {
      success: false,
      message: error.toString(),
    };
  } finally {
    await client.end();
  }
};

// get product by productId
// api GET /api/v1/products/:id
const getProductById = async ({
  response,
  params,
}: {
  response: any;
  params: { id: string };
}) => {
  try {
    await client.connect();
    const result = await client.query(
      "SELECT * FROM PRODUCT WHERE id=$1",
      params.id
    );
    if (result.rows.length > 0) {
      const product = result.rows.map((row) => {
        const obj: any = {};
        result.rowDescription.columns.map((c, i) => {
          obj[c.name] = row[i];
        });
        return obj;
      })[0];
      response.status = 200;
      response.body = {
        success: true,
        product,
      };
    } else {
      response.status = 404;
      response.body = {
        success: true,
        message: "Product does not exists",
      };
    }
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      message: error.toString(),
    };
  } finally {
    await client.end();
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
  await getProductById({ params: { id: params.id }, response });
  if (response.status === 404) {
    response.status = 404;
    response.body = {
      success: true,
      message: "Product does not exists",
    };
    return;
  } else {
    try {
      await client.connect();
      const requestBody = await request.body();
      const product = requestBody.value.product;
      const result = await client.query(
        "UPDATE product SET name=$1, description=$2, price=$3 WHERE id=$4",
        product.name,
        product.description,
        product.price,
        params.id
      );
      response.status = 204;
      response.body = {
        success: true,
        product,
      };
    } catch (error) {
      response.status = 500;
      response.body = {
        success: false,
        message: error.toString(),
      };
    } finally {
      await client.end();
    }
  }
};

// add product by id
// api PUT /api/v1/products
const addProductToList = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  if (request.hasBody) {
    try {
      await client.connect();
      const responseBody = await request.body();
      const product = responseBody.value.product;
      await client.query(
        "INSERT INTO product(name,description,price) VALUES($1,$2,$3)",
        product.name,
        product.description,
        product.price
      );
      response.status = 201;
      response.body = {
        success: true,
        product,
      };
    } catch (err) {
      response.status = 500;
      response.body = {
        success: false,
        message: err.toString(),
      };
    } finally {
      await client.end();
    }
  } else {
    response.status = 302;
    response.body = {
      message: "Please provide product details.",
    };
  }
};

const removeProduct = async ({
  response,
  params,
}: {
  response: any;
  params: { id: string };
}) => {
  await getProductById({ params: { id: params.id }, response });
  if (response.status === 404) {
    response.status = 404;
    response.body = {
      success: true,
      message: "Product does not exists",
    };
    return;
  } else {
    try {
      await client.connect();
      await client.query("DELETE FROM product WHERE id=$1", params.id);
      response.status = 204;
      response.body = {
        success: true,
        message: "Product has been deleted",
      };
    } catch (error) {
      response.status = 500;
      response.body = {
        success: false,
        message: error.toString(),
      };
    } finally {
      await client.end();
    }
  }
};

export {
  getAllProducts,
  getProductById,
  updateProduct,
  addProductToList,
  removeProduct,
};
