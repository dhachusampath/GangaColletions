import React, { useEffect, useState } from "react";
import "./FAQ.css";

const FAQ = () => {
      useEffect(() => {
            // Scroll to the top of the page
            window.scrollTo(0, 0);
          }, []); // Empty dependency array ensures this runs only once when the component mounts
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What materials are used in your jewelry?",
      answer:
        "Our jewelry is crafted with the finest materials, including 18k gold, sterling silver, platinum, and ethically sourced gemstones.",
    },
    {
      question: "Do you offer custom jewelry designs?",
      answer:
        "Yes, we specialize in creating custom designs to bring your unique vision to life. Contact us to start your personalized jewelry journey.",
    },
    {
      question: "How should I care for my jewelry?",
      answer:
        "Store your jewelry in a dry place, avoid exposure to chemicals, and clean gently with a soft cloth. For detailed care instructions, visit our care guide.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of purchase for unworn items in their original packaging. Customized items are non-returnable.",
    },
    {
      question: "Do you provide certifications for gemstones?",
      answer:
        "Yes, all our gemstones come with certificates of authenticity from trusted gemological institutes.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-banner">
        <h1>Frequently Asked Questions</h1>
        <p>Your inquiries answered with care and precision.</p>
      </div>
      <div className="faq-content">
        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            key={index}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <h3>{faq.question}</h3>
              <span className="faq-icon">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>
            <div
              className="faq-answer"
              style={{
                maxHeight: activeIndex === index ? "200px" : "0",
                overflow: "hidden",
              }}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
