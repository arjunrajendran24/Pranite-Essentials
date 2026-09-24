/** FAQ — migrated from praniteessentials.com/pages/faq. */
export interface FaqItem {
  q: string;
  a: string;
}
export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: "brands",
    title: "About Pranite Essentials & our brands",
    items: [
      {
        q: "What is Pranite Essentials?",
        a: "Pranite Essentials is the parent company and corporate home for a growing portfolio of modern wellness and lifestyle brands. We operate under a core philosophy: to unify all dimensions of human living under one trusted roof, delivering uncompromising, premium quality without exception.",
      },
      {
        q: "What is the relationship between Pranite Essentials and Green Pranite?",
        a: "Green Pranite is our flagship pioneer brand under the Pranite Essentials umbrella, specializing in premium, earth-grown superfoods and science-backed personal care. While Green Pranite leads the way today, Pranite Essentials is dedicated to incubating and launching multiple specialized brands in the future.",
      },
      {
        q: "What does “Where Nature Meets Science” mean for your products?",
        a: "It means we refuse to compromise. We harvest the purest, sustainably-sourced natural ingredients (like organic botanicals and functional superfoods) and enhance them with rigorous, modern formulation science to ensure maximum safety, skin compatibility, and real-world efficacy.",
      },
    ],
  },
  {
    id: "quality",
    title: "Quality, sourcing & safety",
    items: [
      {
        q: "Are your products organic and natural?",
        a: "Yes! We prioritize pure, earth-grown, and sustainably sourced ingredients. We avoid harsh synthetic fillers, parabens, and unnecessary additives, ensuring your body gets only what it truly needs.",
      },
      {
        q: "Are your formulations backed by science?",
        a: "Absolutely. While our ingredients are rooted in nature, our formulations are optimized using scientific precision—incorporating active compounds and targeted components (such as skin-friendly acids and functional nutrient ratios) that deliver proven results.",
      },
      {
        q: "Are your products tested on animals?",
        a: "No. We are strictly cruelty-free. We care deeply about ethical practices from farm to formulation, and none of our products or ingredients are tested on animals.",
      },
    ],
  },
  {
    id: "orders",
    title: "Orders, shipping & availability",
    items: [
      {
        q: "Where can I buy Pranite Essentials and Green Pranite products?",
        a: "You can shop our official collections directly through our website, as well as across major online marketplaces like Amazon and Flipkart.",
      },
      {
        q: "Do you offer launch discounts or special promotions?",
        a: "Yes! We frequently run introductory offers for our community. Keep an eye out for special bundle deals and limited-batch reservation discounts (such as our early-batch reservation perks) across our official channels and social media pages.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order is packed and shipped from our facility, you will receive an email and SMS with your tracking details so you can follow your package right to your doorstep.",
      },
    ],
  },
  {
    id: "support",
    title: "Support & partnerships",
    items: [
      {
        q: "How can I contact customer support?",
        a: "If you have any questions regarding your order, products, or brand philosophy, you can reach our support team at connect@praniteessentials.com.",
      },
      {
        q: "Are there opportunities for retail partnerships or collaborations?",
        a: "Always! As Pranite Essentials continues to grow its brand ecosystem, we are always open to strategic retail, distribution, and creator partnerships. Reach out to our team via email to start a conversation.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & value",
    items: [
      {
        q: "Why is the MRP of the soap ₹299?",
        a: "Our soaps are crafted as a premium, high-performance personal care experience. At an MRP of ₹299, you are investing in a formulation that bridges pure botanical ingredients with advanced active science (such as targeted skin-brightening and barrier-protecting compounds). We use superior, skin-safe ingredients rather than cheap synthetic fillers, ensuring every single bar delivers visible, salon-grade results right in your daily routine.",
      },
      {
        q: "Are there any special bundle deals or discounts available?",
        a: "Yes! While the standard individual MRP is ₹299, we frequently offer exclusive bundle packs and limited introductory promotions (such as our special multi-pack offers or early-batch reservation discounts) to make our premium line more accessible to our loyal community. Keep an eye out for our ongoing deals on our store!",
      },
    ],
  },
  {
    id: "why-our-soaps",
    title: "Why choose our soaps",
    items: [
      {
        q: "Why should I choose your soaps over regular commercial soaps?",
        a: "Commercial mass-market soaps are often loaded with harsh detergents and cheap fillers that strip your skin of its natural moisture. Our soaps are built on our core philosophy—where nature meets science. We combine luxurious, skin-loving natural bases with scientifically proven active ingredients to gently cleanse, nourish, and visibly improve your skin’s health, rather than just washing the surface.",
      },
      {
        q: "What makes your soap worth the investment?",
        a: "Unlike standard soap bars, our formulas are meticulously designed for targeted efficacy. Whether you are looking to clear blemishes, brighten your complexion, or maintain a healthy skin barrier, every bar offers a rich lather, premium-grade actives, and uncompromising quality that your skin will thank you for daily.",
      },
    ],
  },
];
