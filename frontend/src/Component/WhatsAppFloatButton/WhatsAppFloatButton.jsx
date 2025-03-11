import "./WhatsAppFloatButton.css";

const WhatsAppFloatButton = () => {
  return (
    <a
      href="https://wa.me/7010949037" // Replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <i className="fa-brands fa-whatsapp"></i>
    </a>
  );
};

export default WhatsAppFloatButton;
