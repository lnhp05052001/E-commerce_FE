export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export const faqData: FAQCategory[] = [
  {
  title: "Đơn hàng",
  items: [
    {
      question: "Làm thế nào để đặt hàng?",
      answer: "Bạn có thể đặt hàng trực tiếp trên website bằng cách thêm sản phẩm vào giỏ và tiến hành thanh toán, hoặc liên hệ hotline để được hỗ trợ nhanh chóng."
    },
    {
      question: "Cần cung cấp thông tin gì khi đặt hàng?",
      answer: "Bạn cần cung cấp tên, số điện thoại, địa chỉ giao hàng, và phương thức thanh toán để đơn hàng được xử lý chính xác."
    },
    {
      question: "Tôi có thể thay đổi đơn hàng sau khi đã đặt không?",
      answer: "Bạn có thể liên hệ bộ phận chăm sóc khách hàng trong vòng 2 giờ sau khi đặt để yêu cầu thay đổi hoặc hủy đơn hàng."
    },
    {
      question: "Làm sao để kiểm tra tình trạng đơn hàng?",
      answer: "Bạn có thể kiểm tra tình trạng đơn hàng trong mục 'Đơn hàng của tôi' trên website hoặc liên hệ trực tiếp với chúng tôi qua hotline."
    },
    {
      question: "Tôi phải làm gì nếu nhận hàng bị hư hỏng hoặc thiếu?",
      answer: "Nếu đơn hàng bị hư hỏng hoặc thiếu sản phẩm, vui lòng chụp ảnh và liên hệ ngay với chúng tôi trong vòng 24 giờ để được hỗ trợ đổi trả hoặc bổ sung."
    },
  ],
},
{
  title: "Sản phẩm",
  items: [
    {
      question: "Sản phẩm có những tính năng và thông số gì?",
      answer: "Mỗi sản phẩm sẽ có thông tin chi tiết về tính năng, chất liệu, và thông số kỹ thuật trong phần mô tả trên trang sản phẩm."
    },
    {
      question: "Tôi có thể đặt trước sản phẩm hết hàng không?",
      answer: "Bạn có thể đăng ký nhận thông báo khi sản phẩm có hàng trở lại hoặc liên hệ để đặt trước nếu có hỗ trợ."
    },
    {
      question: "Làm sao để lắp ráp hoặc sử dụng sản phẩm?",
      answer: "Hướng dẫn sử dụng hoặc lắp ráp chi tiết sẽ đi kèm trong hộp sản phẩm hoặc được đăng tải trên website."
    },
    {
      question: "Sản phẩm có kèm pin hoặc phụ kiện không?",
      answer: "Thông tin về phụ kiện đi kèm (nếu có) sẽ được ghi rõ trong mô tả sản phẩm. Nếu không có, bạn cần mua riêng các phụ kiện cần thiết."
    },
    {
      question: "Kích thước và trọng lượng của sản phẩm là bao nhiêu?",
      answer: "Kích thước và trọng lượng cụ thể của sản phẩm được nêu rõ trong phần mô tả chi tiết trên trang sản phẩm."
    },
  ],
},
{
  title: "Thanh toán",
  items: [
    {
      question: "Tôi có những phương thức thanh toán nào?",
      answer: "Bạn có thể thanh toán bằng thẻ tín dụng, thẻ ghi nợ, chuyển khoản ngân hàng, ví điện tử hoặc thanh toán khi nhận hàng (COD)."
    },
    {
      question: "Thanh toán của tôi có an toàn không?",
      answer: "Chúng tôi sử dụng hệ thống bảo mật đạt chuẩn, đảm bảo tất cả thông tin thanh toán của bạn được mã hóa và an toàn tuyệt đối."
    },
    {
      question: "Có thể thanh toán trả góp không?",
      answer: "Một số sản phẩm hỗ trợ thanh toán trả góp qua thẻ tín dụng hoặc qua các đối tác tài chính. Vui lòng xem chi tiết tại trang sản phẩm hoặc liên hệ để được tư vấn."
    },
    {
      question: "Tôi có thể xuất hóa đơn không?",
      answer: "Có, bạn có thể yêu cầu xuất hóa đơn VAT khi đặt hàng. Vui lòng cung cấp thông tin doanh nghiệp đầy đủ khi thanh toán."
    },
    {
      question: "Thanh toán bị lỗi thì phải làm sao?",
      answer: "Nếu gặp lỗi khi thanh toán, hãy kiểm tra lại thông tin thẻ hoặc liên hệ với ngân hàng của bạn. Ngoài ra, bạn cũng có thể thử phương thức thanh toán khác hoặc liên hệ chúng tôi để được hỗ trợ."
    },
  ],
},
];