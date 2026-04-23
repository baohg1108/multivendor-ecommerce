import { CartProductType } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
interface State {
  cart: CartProductType[];
  totalItems: number;
  totalPrice: number;
}
interface Actions {
  addToCart: (Item: CartProductType) => void;
  updateProductQuantity: (product: CartProductType, quantity: number) => void;
  removeMultipleFromCart: (items: CartProductType[]) => void;
  removeFromCart: (Item: CartProductType) => void;
  emptyCart: () => void;
  setCart: (newCart: CartProductType[]) => void;
}
const INITIAL_STATE: State = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
};
export const useCartStore = create(
  persist<State & Actions>(
    (set, get) => ({
      cart: INITIAL_STATE.cart,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,

      // Getter for flash sale total price
      getFlashSaleTotalPrice: () => {
        const cart = get().cart;
        return cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
      addToCart: (product: CartProductType) => {
        if (!product) return;
        const cart = get().cart;
        const cartItem = cart.find(
          (item) =>
            item.productId === product.productId &&
            item.variantId === product.variantId &&
            item.sizeId === product.sizeId,
        );
        if (cartItem) {
          const updatedCart = cart.map((item) =>
            item.productId === product.productId &&
            item.variantId === product.variantId &&
            item.sizeId === product.sizeId
              ? { ...item, quantity: item.quantity + product.quantity }
              : item,
          );
          set((state) => ({
            cart: updatedCart,
            totalPrice: state.totalPrice + product.price * product.quantity,
          }));
        } else {
          const updatedCart = [...cart, { ...product }];
          set((state) => ({
            cart: updatedCart,
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + product.price * product.quantity,
          }));
        }
      },
      updateProductQuantity: (product: CartProductType, quantity: number) => {
        const cart = get().cart;

        if (quantity <= 0) {
          get().removeFromCart(product);
          return;
        }

        const updatedCart = cart.map((item) =>
          item.productId === product.productId &&
          item.variantId === product.variantId &&
          item.sizeId === product.sizeId
            ? { ...item, quantity }
            : item,
        );

        const totalItems = updatedCart.length;
        const totalPrice = updatedCart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        set(() => ({
          cart: updatedCart,
          totalItems,
          totalPrice,
        }));
      },
      removeFromCart: (product: CartProductType) => {
        const cart = get().cart;
        const updatedCart = cart.filter(
          (item) =>
            !(
              item.productId === product.productId &&
              item.variantId === product.variantId &&
              item.sizeId === product.sizeId
            ),
        );
        const totalItems = updatedCart.length;
        const totalPrice = updatedCart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        set(() => ({
          cart: updatedCart,
          totalItems,
          totalPrice,
        }));

        localStorage.setItem("cart", JSON.stringify(updatedCart));
      },
      removeMultipleFromCart: (products: CartProductType[]) => {
        const cart = get().cart;
        const updatedCart = cart.filter(
          (item) =>
            !products.some(
              (product) =>
                product.productId === item.productId &&
                product.variantId === item.variantId &&
                product.sizeId === item.sizeId,
            ),
        );
        const totalItems = updatedCart.length;
        const totalPrice = updatedCart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        set(() => ({
          cart: updatedCart,
          totalItems,
          totalPrice,
        }));

        localStorage.setItem("cart", JSON.stringify(updatedCart));
      },
      emptyCart: () => {
        set(() => ({
          cart: [],
          totalItems: 0,
          totalPrice: 0,
        }));

        localStorage.removeItem("cart");
      },
      setCart: (newCart: CartProductType[]) => {
        const totalItems = newCart.length;
        const totalPrice = newCart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        set(() => ({
          cart: newCart,
          totalItems,
          totalPrice,
        }));
      },
    }),
    {
      name: "cart",
    },
  ),
);
