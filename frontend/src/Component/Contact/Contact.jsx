import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Contact.css";
import { useStore } from "../Context/Store";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formRef = useRef(null);
  const {url} = useStore();
  const [message, setMessage] = useState("");

  const sendEmail = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      const response = await axios.post(`${url}/contact`, {
        name: formData.get("user_name"),
        email: formData.get("user_email"),
        phone: formData.get("user_phone"),
        subject: formData.get("user_subject"),
        message: formData.get("user_message"),
      });

      if (response.status === 200) {
        setMessage("Message sent successfully ✅");
        setTimeout(() => setMessage(""), 5000);
        formRef.current.reset();
      }
    } catch (error) {
      setMessage("Message not sent (server error) ❌");
    }
  };

  return (
    <section className="contact Section" id="contact">
      <div className="contact__container grid">
        <div className="contact__data">
          <h2 className="section__title-2">
            <span>Contact Us.</span>
          </h2>
          <p className="contact__description-1">
            I will read all emails. Send me any message you want and I'll get back to you.
          </p>
        </div>

        <div className="contact__mail">
          <h2 className="contact__title">Send Me A Message</h2>
          <form className="contact__form" ref={formRef} onSubmit={sendEmail}>
            <div className="contact__group">
              <div className="contact__box">
                <input type="text" name="user_name" className="contact__input" required placeholder="First name" />
                <label className="contact__label">First Name</label>
              </div>
              <div className="contact__box">
                <input type="email" name="user_email" className="contact__input" required placeholder="Email Address" />
                <label className="contact__label">Email Address</label>
              </div>
            </div>
            <div className="contact__box">
              <input type="tel" name="user_phone" className="contact__input" required placeholder="Phone Number" />
              <label className="contact__label">Phone Number</label>
            </div>
            <div className="contact__box">
              <input type="text" name="user_subject" className="contact__input" required placeholder="Subject" />
              <label className="contact__label">Subject</label>
            </div>
            <div className="contact__box contact__area">
              <textarea name="user_message" className="contact__input" required placeholder="Message"></textarea>
              <label className="contact__label">Message</label>
            </div>
            <p className="contact__message">{message}</p>
            <button type="submit" className="contact__button button">
              <i className="ri-send-plane-line"></i> Send Message
            </button>
          </form>
        </div>
      </div>
        <div className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250452.81878207476!2d76.66397094726567!3d11.23746378464888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8efd5c600e4af%3A0xe1eb4e55ab1695c6!2sGANGA%20COLLECTIONS!5e0!3m2!1sen!2sin!4v1739450141203!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Map"
        ></iframe>
      </div>
    </section>
  );
};

export default Contact;
