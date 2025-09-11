export const formatPrice = (price:number) =>{
    const priceString = `${price}đ`;
    const insertIndex = priceString.length-4;
    const headPriceString = priceString.slice(0,insertIndex);
    const tailPriceString = priceString.slice(insertIndex);
    return headPriceString+"."+tailPriceString;
}