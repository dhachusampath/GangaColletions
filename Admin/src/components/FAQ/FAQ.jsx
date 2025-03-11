import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: 'How can I add a new product to the catalog?',
      answer:
        'To add a new product, go to the "Catalog" section, click on "Add Product," and fill in the product details like name, description, price, and images.',
    },
    {
      question: 'How do I update product information?',
      answer:
        'To update product information, go to the "Catalog" section, search for the product, click on "Edit," and modify the details as needed.',
    },
    {
      question: 'How can I manage customer orders?',
      answer:
        'Navigate to the "Orders" section to view, update, or manage customer orders. You can process payments, mark orders as shipped, or cancel them if needed.',
    },
    {
      question: 'How do I track inventory levels?',
      answer:
        'In the "Inventory" section, you can view your product stock levels, and make adjustments to ensure accurate inventory tracking.',
    },
    {
      question: 'What payment methods can I enable?',
      answer:
        'Go to the "Payment Settings" section to configure available payment methods, such as Credit Card, PayPal, and UPI.',
    },
    {
      question: 'Can I add or modify admin users?',
      answer:
        'Yes, you can add or modify admin users by going to the "Admin Management" section, where you can invite new admins or modify existing user roles.',
    },
    {
      question: 'How do I view financial reports?',
      answer:
        'In the "Reports" section, you can generate and view detailed financial reports, including revenue, expenses, and sales performance.',
    },
    {
      question: 'How do I delete a product or category?',
      answer:
        'To delete a product or category, go to the respective section, select the item, and click on "Delete." Be cautious, as this action cannot be undone.',
    },
    {
      question: 'Can I set discounts on products?',
      answer:
        'Yes, you can apply discounts to individual products or categories from the "Discounts" section. Set percentage or fixed value discounts.',
    },
    {
      question: 'How can I recover my admin password?',
      answer:
        'If you forget your password, click on the "Forgot Password" link on the login page, enter your email address, and follow the instructions to reset it.',
    },
  ];

  return (
    <div className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <ul className="faq-list">
        {faqData.map((item, index) => (
          <li
            key={index}
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleAnswer(index)}
          >
            <div className="faq-question">{item.question}</div>
            {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQ;
