// 基础商品接口
export interface Product {
    id: number | string;
    name: string;
    price: string;
    image: string;
    desc?: string;
}

// 轮播图接口
export interface BannerItem {
    id: number;
    imgUrl: string;
    title?: string;
    href?: string;
}

export interface OrderGoods {
  id: string | number;
  name: string;
  image: string;
  price: string | number;
  count: number;
}

export interface OrderAddress {
  address: string;
  receiver: string;
  phone: string;
}