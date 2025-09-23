export const formatPrice= (originPrice:number) =>{
    return new Intl.NumberFormat("vi-VN").format(originPrice) + " đ";
}