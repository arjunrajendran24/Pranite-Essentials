/**
 * Store policies — migrated from praniteessentials.com/policies/* (Shopify).
 * Generated once from the live pages; edit freely from here on.
 *
 * Inline syntax understood by <RichText>:  **bold**  and  [label](https://link)
 */
export type PolicyBlock =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: { lead?: string; text: string }[] };

export interface Policy {
  slug: string;
  title: string;
  updated?: string;
  blocks: PolicyBlock[];
}

export const policies: Policy[] = [
  {
    "slug": "privacy-policy",
    "title": "Privacy Policy",
    "updated": "September 2, 2026",
    "blocks": [
      {
        "type": "p",
        "text": "PRANITE ESSENTIALS operates this store and website, including all related information, content, features, tools, products and services, in order to provide you, the customer, with a curated shopping experience (the \"Services\"). PRANITE ESSENTIALS is powered by Shopify, which enables us to provide the Services to you. This Privacy Policy describes how we collect, use, and disclose your personal information when you visit, use, or make a purchase or other transaction using the Services or otherwise communicate with us. If there is a conflict between our Terms of Service and this Privacy Policy, this Privacy Policy controls with respect to the collection, processing, and disclosure of your personal information."
      },
      {
        "type": "p",
        "text": "Please read this Privacy Policy carefully. By using and accessing any of the Services, you acknowledge that you have read this Privacy Policy and understand the collection, use, and disclosure of your information as described in this Privacy Policy."
      },
      {
        "type": "h2",
        "text": "Personal Information We Collect or Process"
      },
      {
        "type": "p",
        "text": "When we use the term \"personal information,\" we are referring to information that identifies or can reasonably be linked to you or another person. Personal information does not include information that is collected anonymously or that has been de-identified, so that it cannot identify or be reasonably linked to you. We may collect or process the following categories of personal information, including inferences drawn from this personal information, depending on how you interact with the Services, where you live, and as permitted or required by applicable law:"
      },
      {
        "type": "ul",
        "items": [
          {
            "lead": "Contact details",
            "text": "including your name, address, billing address, shipping address, phone number, and email address."
          },
          {
            "lead": "Financial information",
            "text": "including credit card, debit card, and financial account numbers, payment card information, financial account information, transaction details, form of payment, payment confirmation and other payment details."
          },
          {
            "lead": "Account information",
            "text": "including your username, password, security questions, preferences and settings."
          },
          {
            "lead": "Transaction information",
            "text": "including the items you view, put in your cart, add to your wishlist, or purchase, return, exchange or cancel and your past transactions."
          },
          {
            "lead": "Communications with us",
            "text": "including the information you include in communications with us, for example, when sending a customer support inquiry."
          },
          {
            "lead": "Device information",
            "text": "including information about your device, browser, or network connection, your IP address, and other unique identifiers."
          },
          {
            "lead": "Usage information",
            "text": "including information regarding your interaction with the Services, including how and when you interact with or navigate the Services."
          }
        ]
      },
      {
        "type": "h2",
        "text": "Personal Information Sources"
      },
      {
        "type": "p",
        "text": "We may collect personal information from the following sources:"
      },
      {
        "type": "ul",
        "items": [
          {
            "lead": "Directly from you",
            "text": "including when you create an account, visit or use the Services, communicate with us, or otherwise provide us with your personal information;"
          },
          {
            "lead": "Automatically through the Services",
            "text": "including from your device when you use our products or services or visit our websites, and through the use of cookies and similar technologies;"
          },
          {
            "lead": "From our service providers",
            "text": "including when we engage them to enable certain technology and when they collect or process your personal information on our behalf;"
          },
          {
            "text": "**From our partners or other third parties.**"
          }
        ]
      },
      {
        "type": "h2",
        "text": "How We Use Your Personal Information"
      },
      {
        "type": "p",
        "text": "Depending on how you interact with us or which of the Services you use, we may use personal information for the following purposes:"
      },
      {
        "type": "ul",
        "items": [
          {
            "lead": "Provide, Tailor, and Improve the Services.",
            "text": "We use your personal information to provide you with the Services, including to perform our contract with you, to process your payments, to fulfill your orders, to remember your preferences and items you are interested in, to send notifications to you related to your account, to process purchases, returns, exchanges or other transactions, to create, maintain and otherwise manage your account, to arrange for shipping, to facilitate any returns and exchanges, to enable you to post reviews, and to create a customized shopping experience for you, such as recommending products related to your purchases. This may include using your personal information to better tailor and improve the Services."
          },
          {
            "lead": "Marketing and Advertising.",
            "text": "We use your personal information for marketing and promotional purposes, such as to send marketing, advertising and promotional communications by email, text message or postal mail, and to show you online advertisements for products or services on the Services or other websites, including based on items you previously have purchased or added to your cart and other activity on the Services."
          },
          {
            "lead": "Security and Fraud Prevention.",
            "text": "We use your personal information to authenticate your account, to provide a secure payment and shopping experience, detect, investigate or take action regarding possible fraudulent, illegal, unsafe, or malicious activity, protect public safety, and to secure our services. If you choose to use the Services and register an account, you are responsible for keeping your account credentials safe. We highly recommend that you do not share your username, password or other access details with anyone else."
          },
          {
            "lead": "Communicating with You.",
            "text": "We use your personal information to provide you with customer support, to be responsive to you, to provide effective services to you and to maintain our business relationship with you."
          },
          {
            "lead": "Legal Reasons.",
            "text": "We use your personal information to comply with applicable law or respond to valid legal process, including requests from law enforcement or government agencies, to investigate or participate in civil discovery, potential or actual litigation, or other adversarial legal proceedings, and to enforce or investigate potential violations of our terms or policies."
          }
        ]
      },
      {
        "type": "h2",
        "text": "How We Disclose Personal Information"
      },
      {
        "type": "p",
        "text": "In certain circumstances, we may disclose your personal information to third parties for legitimate purposes subject to this Privacy Policy. Such circumstances may include:"
      },
      {
        "type": "ul",
        "items": [
          {
            "text": "With Shopify, vendors and other third parties who perform services on our behalf (e.g. IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping)."
          },
          {
            "text": "With business and marketing partners to provide marketing services and advertise to you. For example, we use Shopify to support personalized advertising with third-party services based on your online activity with different merchants and websites. Our business and marketing partners will use your information in accordance with their own privacy notices. Depending on where you reside, you may have a right to direct us not to share information about you to show you targeted advertisements and marketing based on your online activity with different merchants and websites. ."
          },
          {
            "text": "When you direct, request us or otherwise consent to our disclosure of certain information to third parties, such as to ship you products or through your use of social media widgets or login integrations."
          },
          {
            "text": "With our affiliates or otherwise within our corporate group."
          },
          {
            "text": "In connection with a business transaction such as a merger or bankruptcy, to comply with any applicable legal obligations (including to respond to subpoenas, search warrants and similar requests), to enforce any applicable terms of service or policies, and to protect or defend the Services, our rights, and the rights of our users or others."
          }
        ]
      },
      {
        "type": "h2",
        "text": "Relationship with Shopify"
      },
      {
        "type": "p",
        "text": "The Services are hosted by Shopify, which collects and processes personal information about your access to and use of the Services in order to provide and improve the Services for you. Information you submit to the Services will be transmitted to and shared with Shopify as well as third parties that may be located in countries other than where you reside, in order to provide and improve the Services for you. In addition, to help protect, grow, and improve our business, we use certain Shopify enhanced features that incorporate data and information obtained from your interactions with our Store, along with other merchants and with Shopify. To provide these enhanced features, Shopify may make use of personal information collected about your interactions with our store, along with other merchants, and with Shopify. In these circumstances, Shopify is responsible for the processing of your personal information, including for responding to your requests to exercise your rights over use of your personal information for these purposes. To learn more about how Shopify uses your personal information and any rights you may have, you can visit the [Shopify Consumer Privacy Policy](https://www.shopify.com/legal/privacy/app-users) . Depending on where you live, you may exercise certain rights with respect to your personal information here [Shopify Privacy Portal Link](https://privacy.shopify.com/en)."
      },
      {
        "type": "h2",
        "text": "Third Party Websites and Links"
      },
      {
        "type": "p",
        "text": "The Services may provide links to websites or other online platforms operated by third parties. If you follow links to sites not affiliated or controlled by us, you should review their privacy and security policies and other terms and conditions. We do not guarantee and are not responsible for the privacy or security of such sites, including the accuracy, completeness, or reliability of information found on these sites. Information you provide on public or semi-public venues, including information you share on third-party social networking platforms may also be viewable by other users of the Services and/or users of those third-party platforms without limitation as to its use by us or by a third party. Our inclusion of such links does not, by itself, imply any endorsement of the content on such platforms or of their owners or operators, except as disclosed on the Services."
      },
      {
        "type": "h2",
        "text": "Children's Data"
      },
      {
        "type": "p",
        "text": "The Services are not intended to be used by children, and we do not knowingly collect any personal information about children under the age of majority in your jurisdiction. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details set out below to request that it be deleted.As of the Effective Date of this Privacy Policy, we do not have actual knowledge that we \"share\" or \"sell\" (as those terms are defined in applicable law) personal information of individuals under 16 years of age."
      },
      {
        "type": "h2",
        "text": "Security and Retention of Your Information"
      },
      {
        "type": "p",
        "text": "Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee \"perfect security.\" In addition, any information you send to us may not be secure while in transit. We recommend that you do not use unsecure channels to communicate sensitive or confidential information to us."
      },
      {
        "type": "p",
        "text": "How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, to provide you with Services, comply with legal obligations, resolve disputes or enforce other applicable contracts and policies."
      },
      {
        "type": "h2",
        "text": "Your Rights and Choices"
      },
      {
        "type": "p",
        "text": "Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law."
      },
      {
        "type": "ul",
        "items": [
          {
            "lead": "Right to Access / Know.",
            "text": "You may have a right to request access to personal information that we hold about you."
          },
          {
            "lead": "Right to Delete.",
            "text": "You may have a right to request that we delete personal information we maintain about you."
          },
          {
            "lead": "Right to Correct.",
            "text": "You may have a right to request that we correct inaccurate personal information we maintain about you."
          },
          {
            "lead": "Right of Portability.",
            "text": "You may have a right to receive a copy of the personal information we hold about you and to request that we transfer it to a third party, in certain circumstances and with certain exceptions."
          },
          {
            "lead": "Managing Communication Preferences.",
            "text": "We may send you promotional emails, and you may opt out of receiving these at any time by using the unsubscribe option displayed in our emails to you. If you opt out, we may still send you non-promotional emails, such as those about your account or orders that you have made."
          }
        ]
      },
      {
        "type": "p",
        "text": "You may exercise any of these rights where indicated on the Services or by contacting us using the contact details provided below. To learn more about how Shopify uses your personal information and any rights you may have, including rights related to data processed by Shopify, you can visit https://privacy.shopify.com/en."
      },
      {
        "type": "p",
        "text": "We will not discriminate against you for exercising any of these rights. We may need to verify your identity before we can process your requests, as permitted or required under applicable law. In accordance with applicable laws, you may designate an authorized agent to make requests on your behalf to exercise your rights. Before accepting such a request from an agent, we will require that the agent provide proof you have authorized them to act on your behalf, and we may need you to verify your identity directly with us. We will respond to your request in a timely manner as required under applicable law."
      },
      {
        "type": "h2",
        "text": "Complaints"
      },
      {
        "type": "p",
        "text": "If you have complaints about how we process your personal information, please contact us using the contact details provided below. Depending on where you live, you may have the right to appeal our decision by contacting us using the contact details set out below, or lodge your complaint with your local data protection authority."
      },
      {
        "type": "h2",
        "text": "International Transfers"
      },
      {
        "type": "p",
        "text": "Please note that we may transfer, store and process your personal information outside the country you live in."
      },
      {
        "type": "p",
        "text": "If we transfer your personal information out of the European Economic Area or the United Kingdom, we will rely on recognized transfer mechanisms like the European Commission's Standard Contractual Clauses, or any equivalent contracts issued by the relevant competent authority of the UK, as relevant, unless the data transfer is to a country that has been determined to provide an adequate level of protection."
      },
      {
        "type": "h2",
        "text": "Changes to This Privacy Policy"
      },
      {
        "type": "p",
        "text": "We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on this website, update the \"Last updated\" date and provide notice as required by applicable law."
      },
      {
        "type": "h2",
        "text": "Contact"
      },
      {
        "type": "p",
        "text": "Should you have any questions about our privacy practices or this Privacy Policy, or if you would like to exercise any of the rights available to you, please call or email us at connect@praniteessentials.com or contact us at whats app - 9867441254 or at our adress C-1/302, 3rd floor, Ganesh Silver Sarita CHS, Mira Road East, Thane, 401107 Thane MH, India."
      }
    ]
  },
  {
    "slug": "terms-of-service",
    "title": "Terms of Service",
    "blocks": [
      {
        "type": "h2",
        "text": "1. Overview"
      },
      {
        "type": "p",
        "text": "Welcome to PRANITE ESSENTIALS. This website is operated by PRANITE ESSENTIALS. By visiting our site and/ or purchasing something from us, you engage in our \"Service\" and agree to be bound by the following terms and conditions (\"Terms of Service\", \"Terms\"). These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of content."
      },
      {
        "type": "h2",
        "text": "2. Payment Terms (No Cash on Delivery)"
      },
      {
        "type": "p",
        "text": "We require full payment at the time of purchase to confirm and process your order. **We do not accept Cash on Delivery (COD).** All orders must be 100% prepaid using the accepted digital payment methods (Credit Card, Debit Card, UPI, Net Banking, etc.) available at checkout."
      },
      {
        "type": "h2",
        "text": "3. Return and Refund Policy (No Returns)"
      },
      {
        "type": "p",
        "text": "Due to the nature of our products (personal care and consumables), **all sales are final. We do not accept returns, exchanges, or issue refunds.**"
      },
      {
        "type": "ul",
        "items": [
          {
            "text": "If you receive a damaged or incorrect item due to an error on our part, please contact us immediately upon receipt with video/photographic evidence, and we will evaluate the issue on a case-by-case basis to provide a suitable resolution."
          },
          {
            "text": "Cancellations are not accepted once an order has been successfully placed and processed."
          }
        ]
      },
      {
        "type": "h2",
        "text": "4. Products and Services"
      },
      {
        "type": "p",
        "text": "Certain products or services may be available exclusively online through the website. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We reserve the right to limit the sales of our products or Services to any person, geographic region, or jurisdiction. All descriptions of products or product pricing are subject to change at any time without notice, at the sole discretion of us."
      },
      {
        "type": "h2",
        "text": "5. Accuracy of Billing and Account Information"
      },
      {
        "type": "p",
        "text": "You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. We reserve the right to refuse any order you place with us."
      },
      {
        "type": "h2",
        "text": "6. Contact Information"
      },
      {
        "type": "p",
        "text": "Questions about the Terms of Service should be sent to us using the contact information provided on our website."
      }
    ]
  },
  {
    "slug": "shipping-policy",
    "title": "Shipping Policy",
    "blocks": [
      {
        "type": "p",
        "text": "Thank you for shopping with Pranite Essentials! We are thrilled to share our products with you. Here is everything you need to know about how we ship your orders:"
      },
      {
        "type": "h3",
        "text": "Order Processing Time"
      },
      {
        "type": "p",
        "text": "All orders are processed and dispatched within **1 to 3 business days** (excluding weekends and public holidays) after receiving your order confirmation email. You will receive another notification when your order has officially shipped."
      },
      {
        "type": "h2",
        "text": "Shipping Rates and Delivery Estimates"
      },
      {
        "type": "ul",
        "items": [
          {
            "lead": "Standard Shipping",
            "text": "Delivery typically takes **3 to 7 business days** depending on your location."
          },
          {
            "text": "Shipping charges for your order will be calculated and displayed at checkout."
          },
          {
            "text": "We offer FREE standard shipping on all orders."
          }
        ]
      },
      {
        "type": "h3",
        "text": "How Do I Check the Status of My Order?"
      },
      {
        "type": "p",
        "text": "When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow up to 24-48 hours for the tracking information to become active on the courier's website."
      },
      {
        "type": "p",
        "text": "If you haven’t received your order within the estimated delivery time, please contact us at **connect@praniteessentials.com or +91 98674 41254** with your name and order number, and we will look into it for you right away."
      }
    ]
  },
  {
    "slug": "refund-policy",
    "title": "Refund Policy",
    "blocks": [
      {
        "type": "p",
        "text": "At Pranite Essentials, we are committed to providing our customers with high-quality products. Due to the nature of our items, **all sales are final**. We do not accept returns, process exchanges, or issue refunds once an order has been placed and shipped."
      },
      {
        "type": "h3",
        "text": "Damaged, Defective, or Incorrect Items"
      },
      {
        "type": "p",
        "text": "The only exception to our policy is if your order arrives damaged, defective, or if you receive the wrong item. We want to make it right!"
      },
      {
        "type": "p",
        "text": "If you experience an issue with your delivery, please contact us within **7 days** of receiving your order."
      },
      {
        "type": "p",
        "text": "To report an issue, please email us at **connect@praniteessentials.com** and include:"
      },
      {
        "type": "ul",
        "items": [
          {
            "text": "Your order number"
          },
          {
            "text": "Clear photos of the damaged/defective product and the packaging"
          }
        ]
      },
      {
        "type": "p",
        "text": "Upon reviewing your claim, we will work quickly to provide a replacement for the affected item."
      }
    ]
  },
  {
    "slug": "legal-notice",
    "title": "Legal Notice",
    "blocks": [
      {
        "type": "h2",
        "text": "Company Information"
      },
      {
        "type": "p",
        "text": "Pranite Essentials llp"
      },
      {
        "type": "h2",
        "text": "Contact Information"
      },
      {
        "type": "ul",
        "items": [
          {
            "lead": "Email",
            "text": "connect@praniteessentials.com"
          },
          {
            "lead": "Phone",
            "text": "+91 9867441254"
          },
          {
            "lead": "Address",
            "text": "C-1/302, 3rd floor, Ganesh Silver Sarita CHS, Mira Road East, Thane, 401107 Thane MH, India"
          }
        ]
      },
      {
        "type": "h3",
        "text": "Intellectual Property and Copyright"
      },
      {
        "type": "p",
        "text": "All content included on this website, such as text, graphics, logos, images, product formulations, and software, is the property of Pranite Essentials and is protected by applicable copyright, trademark, and intellectual property laws. Unauthorized use, reproduction, or distribution of any materials from this site is strictly prohibited."
      },
      {
        "type": "h3",
        "text": "Disclaimer"
      },
      {
        "type": "p",
        "text": "The information provided by Pranite Essentials on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site. Our personal care and wellness products are not intended to diagnose, treat, cure, or prevent any disease."
      }
    ]
  },
  {
    "slug": "contact-information",
    "title": "Contact Information",
    "blocks": [
      {
        "type": "p",
        "text": "Trade name: PRANITE ESSENTIALS"
      },
      {
        "type": "p",
        "text": "Phone number: +91 98674 41254"
      },
      {
        "type": "p",
        "text": "Email: connect@praniteessentials.com"
      },
      {
        "type": "p",
        "text": "Physical address: C-1/302, 3rd floor, Ganesh Silver Sarita CHS, Mira Road East, Thane, 401107 Thane MH, India"
      }
    ]
  }
];

export function getPolicy(slug: string) {
  return policies.find((p) => p.slug === slug);
}
