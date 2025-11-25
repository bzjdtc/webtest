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