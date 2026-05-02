export interface Product {
  id: string;
  model: string;
  subtitle: string;
  description: string;
  connectorFrom: string;
  connectorTo: string;
  power: number;
  length: string;
  price: number;
  inStock: boolean;
  feature: string;
  compatibleWith: string[];
}

export const products: Product[] = [
  {
    id: "fw-001",
    model: "FW·001",
    subtitle: "USB-C to USB-C",
    description:
      "100W fast charging with Smart IC and wear-indicator braid. 24-month replacement, order number alone.",
    connectorFrom: "USB-C",
    connectorTo: "USB-C",
    power: 100,
    length: "1.5 M",
    price: 1299,
    inStock: true,
    feature: "Wear-indicator thread",
    compatibleWith: [
      "macbook-pro",
      "macbook-air",
      "ipad-pro",
      "samsung-s24",
      "asus-rog-zephyrus",
      "dell-xps",
      "google-pixel",
      "oneplus-12",
    ],
  },
  {
    id: "fw-002",
    model: "FW·002",
    subtitle: "USB-C to USB-C",
    description:
      "65W fast charging. Compact 1 metre. Wear-indicator braid. Smart IC.",
    connectorFrom: "USB-C",
    connectorTo: "USB-C",
    power: 65,
    length: "1.0 M",
    price: 999,
    inStock: true,
    feature: "Wear-indicator thread",
    compatibleWith: [
      "ipad-pro",
      "ipad-air",
      "samsung-s24",
      "google-pixel",
      "oneplus-12",
      "macbook-air",
    ],
  },
  {
    id: "fw-003",
    model: "FW·003",
    subtitle: "USB-A to USB-C",
    description:
      "18W reliable charging. 1.5 metre. Wear-indicator braid. Universal compatibility.",
    connectorFrom: "USB-A",
    connectorTo: "USB-C",
    power: 18,
    length: "1.5 M",
    price: 849,
    inStock: true,
    feature: "Wear-indicator thread",
    compatibleWith: [
      "samsung-s24",
      "google-pixel",
      "oneplus-12",
      "ipad-air",
      "kindle",
    ],
  },
];

export interface Device {
  id: string;
  name: string;
  brand: string;
  category: "laptop" | "phone" | "tablet" | "other";
  usbType: "usb-c" | "usb-a" | "lightning";
  maxPower: number;
}

export const devices: Device[] = [
  {
    id: "macbook-pro",
    name: "MacBook Pro",
    brand: "Apple",
    category: "laptop",
    usbType: "usb-c",
    maxPower: 140,
  },
  {
    id: "macbook-air",
    name: "MacBook Air",
    brand: "Apple",
    category: "laptop",
    usbType: "usb-c",
    maxPower: 67,
  },
  {
    id: "ipad-pro",
    name: "iPad Pro",
    brand: "Apple",
    category: "tablet",
    usbType: "usb-c",
    maxPower: 45,
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    brand: "Apple",
    category: "tablet",
    usbType: "usb-c",
    maxPower: 20,
  },
  {
    id: "samsung-s24",
    name: "Galaxy S24",
    brand: "Samsung",
    category: "phone",
    usbType: "usb-c",
    maxPower: 45,
  },
  {
    id: "asus-rog-zephyrus",
    name: "ROG Zephyrus G14",
    brand: "Asus",
    category: "laptop",
    usbType: "usb-c",
    maxPower: 100,
  },
  {
    id: "dell-xps",
    name: "XPS 15",
    brand: "Dell",
    category: "laptop",
    usbType: "usb-c",
    maxPower: 130,
  },
  {
    id: "google-pixel",
    name: "Pixel 9 Pro",
    brand: "Google",
    category: "phone",
    usbType: "usb-c",
    maxPower: 30,
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12",
    brand: "OnePlus",
    category: "phone",
    usbType: "usb-c",
    maxPower: 100,
  },
  {
    id: "kindle",
    name: "Kindle Paperwhite",
    brand: "Amazon",
    category: "other",
    usbType: "usb-c",
    maxPower: 9,
  },
];
