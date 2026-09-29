/**
 * Storefront API GraphQL documents. Plain strings — no codegen or GraphQL
 * client needed for a catalog this size.
 */

const IMAGE = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

const PRODUCT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    vendor
    tags
    availableForSale
    description
    descriptionHtml
    seo {
      title
      description
    }
    featuredImage {
      ...ImageFields
    }
    images(first: 20) {
      nodes {
        ...ImageFields
      }
    }
    variants(first: 50) {
      nodes {
        id
        title
        sku
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image {
          ...ImageFields
        }
      }
    }
  }
  ${IMAGE}
`;

const CART = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          amountPerQuantity {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              ...ImageFields
            }
            product {
              handle
              title
              featuredImage {
                ...ImageFields
              }
            }
          }
        }
      }
    }
  }
  ${IMAGE}
`;

/* Products ------------------------------------------------------------------ */

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) @inContext(country: IN) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse) {
      nodes {
        ...ProductFields
      }
    }
  }
  ${PRODUCT}
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) @inContext(country: IN) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT}
`;

/* Cart ---------------------------------------------------------------------- */

const MUTATION_RESULT = /* GraphQL */ `
  cart {
    ...CartFields
  }
  userErrors {
    field
    message
  }
  warnings {
    code
    message
  }
`;

export const CART_QUERY = /* GraphQL */ `
  query Cart($cartId: ID!) @inContext(country: IN) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART}
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) @inContext(country: IN) {
    cartCreate(input: { lines: $lines, buyerIdentity: { countryCode: IN } }) {
      ${MUTATION_RESULT}
    }
  }
  ${CART}
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) @inContext(country: IN) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      ${MUTATION_RESULT}
    }
  }
  ${CART}
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) @inContext(country: IN) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      ${MUTATION_RESULT}
    }
  }
  ${CART}
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) @inContext(country: IN) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      ${MUTATION_RESULT}
    }
  }
  ${CART}
`;
