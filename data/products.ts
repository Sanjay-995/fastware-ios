export interface Product {
  id: string;
  model: string;
  subtitle: string;
  description: string;
  connectorFrom: string;
  connectorTo: string;
  power: number;
  powerLabel: string;
  length: string;
  price: number;
  inStock: boolean;
  feature: string;
  compatibleWith: string[];
  isCombo?: boolean;
}

export const products: Product[] = [
  {
    id: "fw-001",
    model: "FW·001",
    subtitle: "USB-C to USB-C · 240W PD 3.1",
    description:
      "240W PD 3.1 fast charging with FastShield™ Smart IC and FlexArmor™ reinforced joints. TrueWatt Certified™ — actual tested wattage, not marketing numbers. 24-month replacement on order number alone.",
    connectorFrom: "USB-C",
    connectorTo: "USB-C",
    power: 240,
    powerLabel: "240W PD 3.1",
    length: "1.5 M",
    price: 699,
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
    subtitle: "USB-C to USB-C · 65W PD",
    description:
      "65W PD fast charging. Compact 1 metre. FastShield™ Smart IC and FlexArmor™ reinforced joints. TrueWatt Certified™. Wear-indicator braid.",
    connectorFrom: "USB-C",
    connectorTo: "USB-C",
    power: 65,
    powerLabel: "65W PD",
    length: "1.0 M",
    price: 549,
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
    subtitle: "USB-A to USB-C · QC 4.0",
    description:
      "Qualcomm QC 4.0 fast charging at 40W. Universal USB-A compatibility. FastShield™ IC, FlexArmor™ joints. 1.5 metre. Wear-indicator braid.",
    connectorFrom: "USB-A",
    connectorTo: "USB-C",
    power: 40,
    powerLabel: "QC 4.0 · 40W",
    length: "1.5 M",
    price: 499,
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
  {
    id: "fw-004",
    model: "FW·004",
    subtitle: "USB-C to Lightning · 20W",
    description:
      "MFi-equivalent 20W fast charging for Apple Lightning devices. FastShield™ Smart IC, FlexArmor™ reinforced joints. TrueWatt Certified™. Wear-indicator braid.",
    connectorFrom: "USB-C",
    connectorTo: "Lightning",
    power: 20,
    powerLabel: "20W MFi",
    length: "1.0 M",
    price: 749,
    inStock: true,
    feature: "Wear-indicator thread",
    compatibleWith: ["iphone-13", "iphone-12", "airpods-pro"],
  },
  {
    id: "fw-combo",
    model: "FW·COMBO",
    subtitle: "Starter Pack · 3 Cables",
    description:
      "One of each: FW·001 (240W USB-C), FW·003 (QC 4.0 USB-A), and FW·004 (20W Lightning). All with FastShield™, TrueWatt™ Certified, and FlexArmor™. Ships in premium gift box.",
    connectorFrom: "USB-C",
    connectorTo: "USB-C / USB-A / Lightning",
    power: 240,
    powerLabel: "Up to 240W",
    length: "3 cables",
    price: 1199,
    inStock: true,
    feature: "Gift-box packaging",
    compatibleWith: [],
    isCombo: true,
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
    id: "iphone-13",
    name: "iPhone 13",
    brand: "Apple",
    category: "phone",
    usbType: "lightning",
    maxPower: 20,
  },
  {
    id: "iphone-12",
    name: "iPhone 12",
    brand: "Apple",
    category: "phone",
    usbType: "lightning",
    maxPower: 20,
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    brand: "Apple",
    category: "other",
    usbType: "lightning",
    maxPower: 5,
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
