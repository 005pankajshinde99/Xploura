'use client';
import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface BoxItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  deliveryNote: string;
  items: string[];
  surprise: string;
  image?: string;
  badge?: string;
  limited?: boolean;
  festival?: string;
}

interface GiftCategory {
  id: string;
  label: string;
  sublabel?: string;
  icon: string; // SVG path data or component key
  isNew?: boolean;
  isLimited?: boolean;
  boxes: BoxItem[];
}

interface DateCategory {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  boxes: BoxItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Ic = {
  Gift: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>,
  Heart: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Check: (s=11) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Star: (s=11) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Arrow: (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Truck: (s=11) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Cake: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/><path d="M7 4l.5 4"/><path d="M12 4v4"/><path d="M17 4l-.5 4"/></svg>,
  Sun: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Ring: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>,
  Edit: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Leaf: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.12c-.99 1.4-2.28 1.31-3.82 1.47C5 18.94 8 12 8 12S4.08 17 3 19c1-3 4-11 14-11z"/></svg>,
  Box: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Crown: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Users: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Home: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Sparkle: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  Child: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>,
  Moon: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  Music: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Camera: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Zap: (s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

// ─────────────────────────────────────────────────────────────────────────────
// BOX DATA HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const mk = (overrides: Partial<BoxItem> & { id: string; name: string; price: number }): BoxItem => ({
  tagline: '', deliveryNote: 'Free delivery', items: [], surprise: '', ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// GIFT BOX DATA
// ─────────────────────────────────────────────────────────────────────────────

const GIFT_CATEGORIES: GiftCategory[] = [
  {
    id: 'birthday',
    label: 'Birthday Gifts',
    sublabel: 'Make their day unforgettable',
    icon: 'Cake',
    boxes: [
      mk({ id: 'b1', name: 'Confetti', tagline: 'Because every year deserves a celebration', price: 899, deliveryNote: '₹100 delivery', badge: 'Most Ordered', items: ['Balloon bouquet set', 'Assorted chocolates', 'Birthday card + ribbon', 'Mini party popper', 'Scented candle', 'Spotify QR playlist'], surprise: 'Personalised birthday keychain' }),
      mk({ id: 'b2', name: 'Celebrate', tagline: 'A gift they\'ll remember', price: 1499, items: ['2 scented candles', 'Ferrero Rocher box', 'Premium birthday card', 'Birthday game cards', 'Dried flower bunch', 'Sparkle ribbon bow'], surprise: 'Mini photo frame' }),
      mk({ id: 'b3', name: 'Gala', tagline: 'Go all out for someone special', price: 2799, badge: 'Best Seller', items: ['3 luxury candles', 'Belgian chocolates', 'Hardcover journal', 'Gold pen set', 'Premium dried bouquet', 'Rose LED light', 'Birthday sash + crown'], surprise: 'Personalised acrylic plaque' }),
      mk({ id: 'b4', name: 'Grand', tagline: 'The birthday gift that outdoes itself', price: 4999, items: ['Luxury candle set 3pc', 'Godiva chocolates', 'Silk ribbon gift wrap', 'Premium birthday journal', 'Preserved flower dome', 'Bath & body kit', 'Coffee + mug set', 'Moon lamp'], surprise: 'Fresh flower bouquet' }),
    ],
  },
  {
    id: 'anniversary',
    label: 'Anniversary Gifts',
    sublabel: 'Celebrate your journey together',
    icon: 'Heart',
    boxes: [
      mk({ id: 'a1', name: 'Milestone', tagline: 'Every year of love, celebrated', price: 1199, badge: 'Popular', items: ['Couple scented candles', 'Ferrero Rocher', 'Anniversary love card', 'Couple quiz cards', 'Dried roses', 'Spotify memory QR'], surprise: 'Couple bracelet set' }),
      mk({ id: 'a2', name: 'Forever', tagline: 'A love that grows stronger', price: 2499, items: ['3 premium candles', 'Belgian chocolates', 'Wax seal love letter kit', '"Us" memory book', 'Premium dried bouquet', 'Rose LED light', 'Mini perfume duo'], surprise: 'Couple rings set' }),
      mk({ id: 'a3', name: 'Timeless', tagline: 'Some love stories deserve the best', price: 4999, badge: 'Best Value', items: ['Luxury candle set', 'Lindt chocolate box', 'Custom hardcover photo book', 'Couple activity journal', 'Preserved rose dome', 'Premium spa kit', 'Nespresso + mug', 'Projector night light'], surprise: 'Pendant necklace set' }),
      mk({ id: 'a4', name: 'Eternity', tagline: 'For a love that is truly extraordinary', price: 7999, items: ['Designer candle set', 'Godiva luxury box', 'Leather couples journal', 'Experience cards set', 'Preserved flower arrangement', 'Premium bath & body hamper', 'Moon lamp', 'Neon "Love" sign'], surprise: 'Sterling silver bracelet set' }),
    ],
  },
  {
    id: 'wedding',
    label: 'Wedding Gifts',
    sublabel: 'Begin their new chapter beautifully',
    icon: 'Ring',
    boxes: [
      mk({ id: 'w1', name: 'Shagun', tagline: 'Blessings for the new beginning', price: 1499, deliveryNote: '₹100 delivery', badge: 'Most Gifted', items: ['Premium mithai box', 'Dry fruit tray', 'Wedding greeting card', 'Couple diya set', 'Silk ribbon wrapped', 'Agarbatti set'], surprise: 'Blessing coin' }),
      mk({ id: 'w2', name: 'Vivah', tagline: 'A gift as beautiful as the occasion', price: 2999, items: ['Luxury candle set', 'Belgian chocolate box', 'Premium wedding card', 'Couple photo frame', 'Preserved flowers', 'Handmade soap set', 'Premium tea hamper'], surprise: 'Crystal couple figurine' }),
      mk({ id: 'w3', name: 'Bliss', tagline: 'Everything the newlyweds need', price: 5499, badge: 'Premium', items: ['3 luxury candles', 'Lindt chocolate box', 'Custom photo book', 'Couple activity cards', 'Preserved rose dome', 'Premium skincare duo', 'Gourmet coffee + mugs', 'Silk bedside pouch'], surprise: 'Silver blessing coin' }),
      mk({ id: 'w4', name: 'Grandeur', tagline: 'A wedding gift to be remembered forever', price: 9999, items: ['Designer candle set', 'Godiva luxury hamper', 'Leather wedding album', 'Experience cards', 'Preserved flower arrangement', 'Luxury spa hamper', 'Nespresso machine pods', 'Personalised nameplaque'], surprise: 'Sterling silver couple keepsake' }),
    ],
  },
  {
    id: 'couple',
    label: 'Couple Gifts',
    sublabel: 'For the two of you, anytime',
    icon: 'Camera',
    isNew: true,
    boxes: [
      mk({ id: 'cp1', name: 'Twosome', tagline: 'Little things, shared together', price: 999, deliveryNote: '₹100 delivery', badge: 'New', items: ['Matching mug pair', 'Assorted chocolates', 'Couple greeting card', 'Mini photo clip stand', 'Scented candle', 'Ribbon bow'], surprise: 'Couple keychain set' }),
      mk({ id: 'cp2', name: 'Sync', tagline: 'For two people, one wavelength', price: 1899, items: ['His & hers tote bags', 'Ferrero Rocher box', 'Matching socks pair', 'Polaroid photo clip set', 'Dried flower bunch', 'Mini perfume duo'], surprise: 'Matching phone charms' }),
      mk({ id: 'cp3', name: 'Duo', tagline: 'Everyday gifting, made special', price: 3499, badge: 'Best Seller', items: ['Couple watch set', 'Belgian chocolates', 'Personalised photo frame', 'Matching bathrobe set', 'Premium tea hamper', 'Scented candle duo'], surprise: 'Engraved keychain pair' }),
      mk({ id: 'cp4', name: 'Forever Two', tagline: 'A gift as solid as your bond', price: 5999, items: ['Premium couple watch set', 'Godiva chocolates', 'Custom photo book', 'Matching leather wallets', 'Luxury candle duo', 'Premium coffee hamper'], surprise: 'Sterling silver couple bracelet set' }),
    ],
  },
  {
    id: 'personalised',
    label: 'Personalised Gifts',
    sublabel: 'Your name, your story, your gift',
    icon: 'Edit',
    isNew: true,
    boxes: [
      mk({ id: 'p1', name: 'Memory', tagline: 'A gift with your name on it', price: 999, deliveryNote: '₹100 delivery', badge: 'New', items: ['Personalised greeting card', 'Custom name keychain', 'Assorted chocolates', 'Mini photo print 2×2"', 'Scented candle', 'Ribbon bow'], surprise: 'Custom name sticker set' }),
      mk({ id: 'p2', name: 'Story', tagline: 'Tell your story, wrapped beautifully', price: 1999, items: ['Custom photo book (10 pages)', 'Personalised candle label', 'Ferrero Rocher box', 'Engraved pen', 'Dried flower bunch', 'Handwritten card service'], surprise: 'Custom acrylic name plaque' }),
      mk({ id: 'p3', name: 'Legacy', tagline: 'A keepsake they will treasure forever', price: 3999, badge: 'Best Seller', items: ['Hardcover custom photo book', 'Personalised mug + coaster', 'Belgian chocolates', 'Engraved leather journal', 'Preserved flowers', 'Custom wax seal letter', 'Luxury gift wrap'], surprise: 'Custom neon sign (mini)' }),
      mk({ id: 'p4', name: 'Heritage', tagline: 'Truly one of a kind, just like them', price: 6999, items: ['Luxury custom photo album', 'Personalised candle set', 'Godiva chocolates', 'Engraved leather wallet', 'Custom star map print', 'Preserved flower dome', 'Personalised music box', 'Experience cards'], surprise: 'Personalised silver coin' }),
    ],
  },
  {
    id: 'plants',
    label: 'Lush Plants & Greens',
    sublabel: 'Living gifts that keep growing',
    icon: 'Leaf',
    isNew: true,
    boxes: [
      mk({ id: 'pl1', name: 'Sprout', tagline: 'Small plant, big love', price: 699, deliveryNote: '₹100 delivery', items: ['Succulent in terracotta pot', 'Plant care card', 'Pebble tray', 'Organic fertiliser sachet', 'Personalised plant tag', 'Jute gift wrap'], surprise: 'Mini watering can' }),
      mk({ id: 'pl2', name: 'Bloom', tagline: 'A garden of happiness', price: 1499, badge: 'Most Loved', items: ['2 indoor plants combo', 'Ceramic planters', 'Potting mix pack', 'Plant mister bottle', 'Plant care handbook', 'Greeting card'], surprise: 'Macramé plant hanger' }),
      mk({ id: 'pl3', name: 'Garden', tagline: 'Bring the outdoors inside', price: 2999, items: ['3 curated indoor plants', 'Premium ceramic pots', 'Organic soil mix', 'Plant care kit', 'Misting bottle', 'Pebble + moss set', 'Plant journal'], surprise: 'Succulent terrarium kit' }),
      mk({ id: 'pl4', name: 'Sanctuary', tagline: 'A home oasis, beautifully gifted', price: 4999, badge: 'Premium', items: ['5 plant collection', 'Handpainted ceramic pots', 'Luxury potting mix', 'Premium plant care kit', 'Plant ID tags', 'Botanical art print', 'Organic plant food set'], surprise: 'Custom planter with name' }),
    ],
  },
  {
    id: 'hamper',
    label: 'Hamper Gifts',
    sublabel: 'Curated collections of joy',
    icon: 'Box',
    boxes: [
      mk({ id: 'h1', name: 'Everyday', tagline: 'A little of everything they love', price: 1099, deliveryNote: '₹100 delivery', badge: 'Popular', items: ['Assorted chocolates', 'Premium tea assortment', 'Scented candle', 'Hand cream', 'Gourmet cookies', 'Greeting card'], surprise: 'Personalised bookmark' }),
      mk({ id: 'h2', name: 'Gourmet', tagline: 'For the foodie in your life', price: 2299, items: ['Belgian chocolate box', 'Artisan cookies set', 'Gourmet coffee blend', 'Premium tea tin', 'Flavoured popcorn', 'Dark chocolate bark', 'Jam & preserve duo'], surprise: 'Personalised cutting board' }),
      mk({ id: 'h3', name: 'Wellness', tagline: 'Gift them the feeling of being cared for', price: 3499, badge: 'Best Seller', items: ['Aromatherapy candle set', 'Face mask collection', 'Essential oil roll-ons', 'Herbal tea selection', 'Organic bath salts', 'Loofah + soap set', 'Jade roller'], surprise: 'Luxury spa voucher' }),
      mk({ id: 'h4', name: 'Premium', tagline: 'The ultimate hamper experience', price: 6499, items: ['Lindt chocolate box', 'Gourmet cheese crackers', 'Artisan jam selection', 'Cold brew coffee kit', 'Premium wine glass duo', 'Luxury scented candle', 'Handmade soap collection', 'Truffle popcorn tin'], surprise: 'Personalised wine stopper' }),
    ],
  },
  {
    id: 'premium',
    label: 'Premium Gifts',
    sublabel: 'When only the finest will do',
    icon: 'Crown',
    boxes: [
      mk({ id: 'pr1', name: 'Elite', tagline: 'Premium, all the way', price: 3999, items: ['Luxury leather cardholder', 'Godiva chocolate box', 'Premium fragrance rollerball', 'Silk pocket square', 'Artisan coffee set', 'Premium notebook + pen'], surprise: 'Gold-plated cufflinks' }),
      mk({ id: 'pr2', name: 'Prestige', tagline: 'Gifts that command respect', price: 6999, badge: 'Best Value', items: ['Designer scarf / silk tie', 'Imported whisky truffles', 'Luxury leather wallet', 'Crystal paperweight', 'Premium fountain pen', 'Aged balsamic + olive set', 'Artisan cheese board'], surprise: 'Engraved silver flask' }),
      mk({ id: 'pr3', name: 'Opulence', tagline: 'The pinnacle of gifting', price: 9999, badge: 'Premium', items: ['Luxury watch winder', 'Lindt master collection', 'Leather travel kit', 'Premium cufflinks set', 'Private label whisky nips', 'Crystal decanter', 'Cashmere travel pillow'], surprise: 'Sterling silver money clip' }),
      mk({ id: 'pr4', name: 'Majestic', tagline: 'An experience of pure luxury', price: 14999, items: ['Luxury leather briefcase pouch', 'Dom Perignon chocolates', 'Swiss pen set', 'Custom monogram cufflinks', 'Baccarat crystal glass', 'Aged cognac truffles', 'Personalised leather portfolio', 'Cashmere socks + tie set'], surprise: '18K gold-plated keepsake' }),
    ],
  },
  {
    id: 'jewellery',
    label: 'Jewellery Gifts',
    sublabel: 'Gifts that shimmer and last',
    icon: 'Star',
    boxes: [
      mk({ id: 'j1', name: 'Glow', tagline: 'Shine bright, always', price: 1299, deliveryNote: '₹100 delivery', badge: 'Popular', items: ['Stud earrings set', 'Assorted chocolates', 'Premium card + ribbon', 'Velvet gift pouch', 'Scented candle', 'Dried flower bunch'], surprise: 'Dainty charm bracelet' }),
      mk({ id: 'j2', name: 'Radiance', tagline: 'A touch of sparkle', price: 2499, items: ['Layered necklace set', 'Ferrero Rocher box', 'Wax seal greeting card', 'Velvet jewellery box', 'Dried rose bouquet', 'Mini perfume rollerball'], surprise: 'Sterling silver ring' }),
      mk({ id: 'j3', name: 'Brilliance', tagline: 'Jewellery she will reach for every day', price: 4499, badge: 'Best Seller', items: ['3-piece jewellery set', 'Godiva chocolates', 'Premium velvet gift box', 'Personalised gift card', 'Preserved flowers', 'Luxury scented candle', 'Silk gift ribbon'], surprise: 'Personalised name necklace' }),
      mk({ id: 'j4', name: 'Legacy', tagline: 'Heirloom-worthy gifting', price: 7999, items: ['Premium 925 silver set', 'Lindt luxury box', 'Custom engraved locket', 'Velvet jewellery organiser', 'Preserved rose dome', 'Premium spa kit', 'Personalised charm'], surprise: 'Diamond-cut pendant necklace' }),
    ],
  },
  {
    id: 'relative',
    label: 'Relative Gifts',
    sublabel: 'For every family bond',
    icon: 'Users',
    boxes: [
      mk({ id: 'r1', name: 'Rishta', tagline: 'For every bond that matters', price: 899, deliveryNote: '₹100 delivery', badge: 'Popular', items: ['Premium mithai box', 'Dry fruit pack', 'Greeting card', 'Scented diya', 'Agarbatti set', 'Festive ribbon'], surprise: 'Blessing coin' }),
      mk({ id: 'r2', name: 'Sneh', tagline: 'Warmth in every detail', price: 1799, items: ['Assorted mithai box', 'Premium dry fruits tray', 'Family greeting card', 'Scented candle', 'Home décor piece', 'Silk bow wrap', 'Agarbatti set'], surprise: 'Personalised family keychain' }),
      mk({ id: 'r3', name: 'Bandhan', tagline: 'Celebrate the ties that bind', price: 3299, badge: 'Most Gifted', items: ['Luxury dry fruit selection', 'Silver-coated mithai box', 'Handcrafted greeting book', 'Brass diya set', 'Premium agarbatti', 'Sandalwood incense', 'Silk scarf', 'Personalised frame'], surprise: 'Silver-plated family frame' }),
      mk({ id: 'r4', name: 'Parivaar', tagline: 'The complete family celebration box', price: 5999, items: ['Premium imported dry fruits', 'Luxury mithai selection', 'Engraved family name plaque', 'Brass lamp set', 'Kashmiri pashmina shawl', 'Sandalwood soap set', 'Gourmet tea hamper', 'Personalised memory book'], surprise: 'Sterling silver blessing coin' }),
    ],
  },
  {
    id: 'parents',
    label: 'Parent Gifts',
    sublabel: 'For the ones who gave you everything',
    icon: 'Home',
    boxes: [
      mk({ id: 'pg1', name: 'Aashirwad', tagline: 'A gesture of gratitude', price: 1199, deliveryNote: '₹100 delivery', items: ['Premium tea + biscuits', 'Dry fruit box', 'Greeting card', 'Scented diya set', 'Classic shawl', 'Agarbatti set'], surprise: 'Blessing coin' }),
      mk({ id: 'pg2', name: 'Sneh', tagline: 'A warm hug in a box', price: 1999, badge: 'Most Loved', items: ['Luxury tea hamper', 'Premium dry fruits', 'Handwritten letter card', 'Ayurvedic oil set', 'Premium agarbatti', 'Kesar + saffron box', 'Silk handkerchief'], surprise: 'Family photo frame' }),
      mk({ id: 'pg3', name: 'Samman', tagline: 'Honour & gratitude in every detail', price: 3499, badge: 'Best Value', items: ['Premium health hamper', 'Gourmet dry fruit selection', 'Silver-coated chocolate box', 'Luxury silk scarf', 'Sandalwood agarbatti set', 'Kashmiri saffron', 'Brass diya set', 'Personalised greeting book'], surprise: 'Sterling silver blessing coin' }),
      mk({ id: 'pg4', name: 'Vandana', tagline: 'For the parent who deserves the world', price: 5499, items: ['Luxury tea + coffee hamper', 'Imported dry fruit box', 'Leather wallet/clutch', 'Gold-plated diya set', 'Kashmiri shawl', 'Ayurvedic wellness kit', 'Personalised nameplaque'], surprise: 'Gold-plated blessing coin' }),
    ],
  },
  {
    id: 'kids',
    label: 'Kids Corner',
    sublabel: 'All Gifts for Kids',
    icon: 'Child',
    boxes: [
      mk({ id: 'k1', name: 'Tiny Joy', tagline: 'For the littlest ones', price: 699, deliveryNote: '₹100 delivery', badge: 'Popular', items: ['Plush teddy bear', 'Chocolate assortment', 'Fun activity cards', 'Crayons + drawing pad', 'Mini puzzle (24pc)', 'Birthday greeting'], surprise: 'Mini board game' }),
      mk({ id: 'k2', name: 'Play Zone', tagline: 'Because kids deserve the best', price: 1299, items: ['Soft toy + coloring book', 'Chocolate box', 'Sticker sheet set', 'Watercolour set', 'Story book (age 6+)', 'Party blower set'], surprise: 'Personalised sticker name set' }),
      mk({ id: 'k3', name: 'Game Box', tagline: 'Hours of fun, guaranteed', price: 2299, badge: 'Best Seller', items: ['Board game (family)', 'Chocolate hamper', 'Playdough set 6pc', 'Kinetic sand kit', 'Science experiment kit', 'Colouring books set', 'Crayons + gel pens'], surprise: 'Mini Lego set' }),
      mk({ id: 'k4', name: 'Dream Box', tagline: 'The ultimate gift for every child', price: 3999, items: ['Premium soft toy', 'Godiva children chocolate', 'Art supply premium kit', 'Craft activity box', 'Junior telescope', 'Personalised story book', 'Wooden puzzle set'], surprise: 'Remote control mini car/doll' }),
    ],
  },
  {
    id: 'festive',
    label: 'Festive Gifts',
    sublabel: 'Limited edition, season specials',
    icon: 'Sparkle',
    isLimited: true,
    boxes: [
      mk({ id: 'f1', name: 'Diwali Glow', tagline: 'Light up their celebration', price: 1499, badge: 'Limited', limited: true, festival: 'Diwali', items: ['Premium diya set 6pc', 'Kaju katli box', 'Dry fruit tray', 'Flower rangoli kit', 'Sparklers pack', 'Luxury greeting card'], surprise: 'Gold-foil gift wrap' }),
      mk({ id: 'f2', name: 'Diwali Luxe', tagline: 'The grandest Diwali gesture', price: 3999, badge: 'Limited', limited: true, festival: 'Diwali', items: ['Brass diya set 12pc', 'Premium mithai box', 'Imported dry fruits', 'Silver-plated pooja thali', 'Luxury candles', 'Ferrero Rocher', 'Personalised card'], surprise: 'Silver Lakshmi coin' }),
      mk({ id: 'f3', name: 'Ganpati Prasad', tagline: 'Blessings & modaks delivered', price: 999, badge: 'Limited', limited: true, festival: 'Ganesh Chaturthi', deliveryNote: '₹100 delivery', items: ['Modak box 12pc', 'Coconut + jaggery pack', 'Marigold garland (dried)', 'Ganesh greeting card', 'Pooja essentials kit', 'Incense set'], surprise: 'Mini Ganesh idol' }),
      mk({ id: 'f4', name: 'Rang Barse', tagline: 'Colour, joy & mithai', price: 899, badge: 'Limited', limited: true, festival: 'Holi', deliveryNote: '₹100 delivery', items: ['Organic colour set 5 shades', 'Gujiya box', 'Thandai mix', 'Pichkari (mini)', 'Flower petals pack', 'Festive greeting card'], surprise: 'Waterproof colour pouch' }),
    ],
  },
];


// ─────────────────────────────────────────────────────────────────────────────
// MORE GIFTS WITHIN SAME CATEGORY (individual items, FNP-style)
// ─────────────────────────────────────────────────────────────────────────────
interface RelatedGift {
  id: string;
  name: string;
  price: number;
  image: string;
}

const rg = (id: string, name: string, price: number): RelatedGift => ({
  id, name, price, image: `https://picsum.photos/seed/${id}/300/300`,
});

const RELATED_GIFTS: Record<string, RelatedGift[]> = {
  birthday: [
    rg('rgbd1', 'Photo Cake', 599), rg('rgbd2', 'Balloon Bouquet', 399),
    rg('rgbd3', 'Chocolate Box', 449), rg('rgbd4', 'Greeting Card', 149),
    rg('rgbd5', 'Scented Candle', 299), rg('rgbd6', 'Birthday Mug', 349),
  ],
  anniversary: [
    rg('rgan1', 'Heart Chocolate Box', 599), rg('rgan2', 'Rose Bouquet', 699),
    rg('rgan3', 'Couple Photo Frame', 499), rg('rgan4', 'Anniversary Card', 199),
    rg('rgan5', 'Scented Candle Duo', 399), rg('rgan6', 'Anniversary Mug Set', 449),
  ],
  wedding: [
    rg('rgwd1', 'Dry Fruit Box', 799), rg('rgwd2', 'Wedding Card', 199),
    rg('rgwd3', 'Silver Coin', 999), rg('rgwd4', 'Mithai Box', 599),
    rg('rgwd5', 'Brass Diya Set', 449), rg('rgwd6', 'Home Decor Piece', 699),
  ],
  personalised: [
    rg('rgps1', 'Custom Keychain', 249), rg('rgps2', 'Personalised Mug', 399),
    rg('rgps3', 'Photo Frame', 449), rg('rgps4', 'Custom Cushion', 599),
    rg('rgps5', 'Engraved Pen', 349), rg('rgps6', 'Name Necklace', 699),
  ],
  plants: [
    rg('rgpl1', 'Succulent Pot', 299), rg('rgpl2', 'Money Plant', 399),
    rg('rgpl3', 'Bonsai Plant', 599), rg('rgpl4', 'Areca Palm', 699),
    rg('rgpl5', 'Terracotta Planter', 249), rg('rgpl6', 'Indoor Fern', 349),
  ],
  hamper: [
    rg('rgha1', 'Tea & Cookies', 449), rg('rgha2', 'Dry Fruit Hamper', 599),
    rg('rgha3', 'Spa Kit', 699), rg('rgha4', 'Coffee Hamper', 549),
    rg('rgha5', 'Snack Box', 399), rg('rgha6', 'Bath Essentials', 649),
  ],
  premium: [
    rg('rgpr1', 'Leather Wallet', 1499), rg('rgpr2', 'Premium Pen Set', 1199),
    rg('rgpr3', 'Whisky Glass Set', 1799), rg('rgpr4', 'Cufflinks', 999),
    rg('rgpr5', 'Premium Cardholder', 1299), rg('rgpr6', 'Fragrance Rollerball', 899),
  ],
  jewellery: [
    rg('rgjw1', 'Stud Earrings', 599), rg('rgjw2', 'Silver Bracelet', 799),
    rg('rgjw3', 'Charm Pendant', 699), rg('rgjw4', 'Layered Necklace', 899),
    rg('rgjw5', 'Ring', 549), rg('rgjw6', 'Anklet Pair', 449),
  ],
  relative: [
    rg('rgrl1', 'Mithai Box', 449), rg('rgrl2', 'Dry Fruit Tray', 599),
    rg('rgrl3', 'Diya Set', 349), rg('rgrl4', 'Agarbatti Box', 249),
    rg('rgrl5', 'Family Photo Frame', 499), rg('rgrl6', 'Greeting Card', 149),
  ],
  parents: [
    rg('rgpt1', 'Tea Hamper', 499), rg('rgpt2', 'Shawl', 899),
    rg('rgpt3', 'Ayurvedic Kit', 699), rg('rgpt4', 'Health Mix Box', 449),
    rg('rgpt5', 'Photo Frame', 399), rg('rgpt6', 'Prayer Diya Set', 349),
  ],
  kids: [
    rg('rgkd1', 'Soft Toy', 399), rg('rgkd2', 'Coloring Book Set', 249),
    rg('rgkd3', 'Puzzle Game', 349), rg('rgkd4', 'Chocolate Pack', 199),
    rg('rgkd5', 'Story Book', 299), rg('rgkd6', 'Mini Lego Set', 599),
  ],
  festive: [
    rg('rgfs1', 'Diya Set', 299), rg('rgfs2', 'Rangoli Kit', 249),
    rg('rgfs3', 'Mithai Box', 449), rg('rgfs4', 'Sparklers Pack', 199),
    rg('rgfs5', 'Festive Greeting Card', 149), rg('rgfs6', 'Pooja Thali', 599),
  ],
  couple: [
    rg('rgcp1', 'Couple Mug Set', 449), rg('rgcp2', 'Matching Keychains', 299),
    rg('rgcp3', 'Couple T-shirt Set', 799), rg('rgcp4', 'Photo Collage Frame', 599),
    rg('rgcp5', 'Couple Bracelet', 549), rg('rgcp6', 'Scented Candle Duo', 399),
  ],
};
// ─────────────────────────────────────────────────────────────────────────────
// DATE BOX DATA
// ─────────────────────────────────────────────────────────────────────────────
const DATE_CATEGORIES: DateCategory[] = [
  {
    id: 'classic',
    label: 'Classic Date Night',
    sublabel: 'The essential romantic setup',
    icon: 'Heart',
    boxes: [
      mk({ id: 'dc1', image: 'https://picsum.photos/seed/dc1/420/280', name: 'Spark', tagline: 'Light the first spark tonight', price: 999, deliveryNote: '₹100 delivery', badge: 'Most Ordered', items: ['Tea light candles', 'Ferrero Rocher', 'Handwritten love note', 'Scratch off love card', 'Dried flowers', 'LED fairy lights', 'Spotify QR'], surprise: 'Couple bracelet set' }),
      mk({ id: 'dc2', image: 'https://picsum.photos/seed/dc2/420/280', name: 'Bloom', tagline: 'A night worth remembering', price: 1499, items: ['2 scented candles', 'Ferrero Rocher large', 'Open when letters set', 'Couple game + dice', 'Dried bouquet', 'Rose LED light', 'Premium tea set', 'Spotify QR'], surprise: 'Mini face mask kit' }),
      mk({ id: 'dc3', image: 'https://picsum.photos/seed/dc3/420/280', name: 'Enchant', tagline: 'Set the scene, own the night', price: 2999, badge: 'Best Value', items: ['3 premium candles', 'Ferrero + truffles', 'Wax seal love letter', '"52 reasons" cards', 'Premium dried bouquet', 'Moon lamp mini', 'Mini perfume', 'Coffee set', 'Spotify QR'], surprise: 'Preserved rose' }),
      mk({ id: 'dc4', image: 'https://picsum.photos/seed/dc4/420/280', name: 'Luxe', tagline: 'Five-star date at home', price: 4999, items: ['Luxury candle set', 'Belgian chocolates', 'Hardcover love journal', 'Premium couple game', 'Preserved flowers', 'Projector night light', 'Bath & body kit', 'Custom photo card', 'Spotify QR'], surprise: 'Spa discount voucher' }),
      mk({ id: 'dc5', image: 'https://picsum.photos/seed/dc5/420/280', name: 'Royal', tagline: 'Make tonight legendary', price: 6999, items: ['Luxury candle + holder', 'Imported chocolates', 'Leather journal + pen', 'Luxury couple game', 'Preserved rose dome', 'Premium skincare', 'Coffee hamper', 'Open when luxury set', 'Spotify QR'], surprise: 'Sterling silver bracelet' }),
      mk({ id: 'dc6', image: 'https://picsum.photos/seed/dc6/420/280', name: 'Éternité', tagline: 'The date night of a lifetime', price: 9999, badge: 'Premium', items: ['Designer candle set', 'Lindt/Godiva', 'Custom photo book', 'Experience cards', 'Preserved arrangement', 'Premium spa hamper', 'Neon "Love" sign', 'Nespresso + mug', 'Spotify QR'], surprise: 'Silver jewelry set' }),
    ],
  },
  {
    id: 'anniversary-date',
    label: 'Anniversary Date',
    sublabel: 'Mark the day you fell in love',
    icon: 'Ring',
    boxes: [
      mk({ id: 'ad1', image: 'https://picsum.photos/seed/ad1/420/280', name: 'Reminisce', tagline: 'Relive every beautiful memory', price: 1799, badge: 'Popular', items: ['Memory scrapbook kit', 'Couple candle set', 'Ferrero Rocher', 'Custom photo strip printing', '"Then & Now" question cards', 'Dried rose bouquet', 'Spotify anniversary QR'], surprise: 'Personalised couple frame' }),
      mk({ id: 'ad2', image: 'https://picsum.photos/seed/ad2/420/280', name: 'Chapter Two', tagline: 'A new evening to remember', price: 3499, items: ['3 luxury candles', 'Belgian chocolates', 'Wax seal anniversary letter', 'Custom love timeline print', 'Preserved rose dome', 'Mini spa duo', 'Projector mood light', 'Spotify playlist QR'], surprise: 'Silver photo locket' }),
      mk({ id: 'ad3', image: 'https://picsum.photos/seed/ad3/420/280', name: 'Milestone', tagline: 'Some evenings deserve grandeur', price: 6999, badge: 'Premium', items: ['Designer candle set', 'Godiva chocolates', 'Custom hardcover photo book', 'Experience voucher set', 'Preserved flower arrangement', 'Premium skincare duo', 'Nespresso + mug', 'Neon "Us" sign mini', 'Spotify memory QR'], surprise: 'Sterling silver couple keepsake' }),
    ],
  },
  {
    id: 'surprise-date',
    label: 'Surprise Date',
    sublabel: 'Unexpected. Unplanned. Unforgettable.',
    icon: 'Sparkle',
    boxes: [
      mk({ id: 'sd1', image: 'https://picsum.photos/seed/sd1/420/280', name: 'Caught Off Guard', tagline: 'The best surprises need no reason', price: 1299, deliveryNote: '₹100 delivery', badge: 'Fan Favourite', items: ['Scented candle', 'Ferrero Rocher box', 'Scratch-off "Date Night" card', 'Secret love note pad', 'Polaroid-style photo print kit', 'LED string lights', 'Spotify surprise QR'], surprise: 'Mystery gift inside' }),
      mk({ id: 'sd2', image: 'https://picsum.photos/seed/sd2/420/280', name: 'Plot Twist', tagline: 'You planned something special', price: 2799, items: ['2 luxury candles', 'Belgian chocolates', 'Sealed "open together" envelope', 'Couple game deck', 'Dried flower bouquet', 'Photo booth strip kit', 'Mood LED light', 'Spotify curated QR'], surprise: 'Personalised surprise letter' }),
      mk({ id: 'sd3', image: 'https://picsum.photos/seed/sd3/420/280', name: 'Grand Reveal', tagline: 'The one they\'ll never see coming', price: 4999, badge: 'Best Value', items: ['3 premium candles', 'Godiva chocolates', 'Custom love letter + wax seal', '"50 questions" card game', 'Preserved rose dome', 'Mini spa kit', 'Projector night light', 'Neon heart sign mini', 'Spotify love QR'], surprise: 'Couple experience voucher' }),
    ],
  },
  {
    id: 'first-date',
    label: 'First Date Setup',
    sublabel: 'Make the first one count',
    icon: 'Zap',
    boxes: [
      mk({ id: 'fd1', image: 'https://picsum.photos/seed/fd1/420/280', name: 'Hello', tagline: 'A gentle, perfect first impression', price: 899, deliveryNote: '₹100 delivery', badge: 'Sweet & Simple', items: ['Single scented candle', 'Ferrero Rocher 4pc', 'First date conversation cards', 'Mini wildflower bunch', 'Soft music playlist QR', 'Greeting card'], surprise: 'Personalised note' }),
      mk({ id: 'fd2', image: 'https://picsum.photos/seed/fd2/420/280', name: 'First Chapter', tagline: 'The start of something beautiful', price: 2199, badge: 'Most Loved', items: ['2 scented candles', 'Belgian chocolates', 'Icebreaker question card game', '"Would you rather" date edition', 'Dried flower bouquet', 'Mood LED light', 'Curated playlist QR', 'Mini photo frame'], surprise: 'Dainty charm bracelet' }),
    ],
  },
  {
    id: 'cosy-night',
    label: 'Cosy Night In',
    sublabel: 'Stay home. Stay warm. Stay close.',
    icon: 'Moon',
    boxes: [
      mk({ id: 'cn1', image: 'https://picsum.photos/seed/cn1/420/280', name: 'Cosy', tagline: 'Just the two of you and a quiet night', price: 1299, deliveryNote: '₹100 delivery', badge: 'Bestseller', items: ['Scented soy candle', 'Hot chocolate mix', 'Movie night snack box', 'Couple "Would You Rather" cards', 'Cosy blanket socks pair', 'Fairy lights'], surprise: 'Personalised pillow tag' }),
      mk({ id: 'cn2', image: 'https://picsum.photos/seed/cn2/420/280', name: 'Blanket Fort', tagline: 'Build your world together', price: 2499, items: ['3 scented candles', 'Premium popcorn set', 'Board game for two', 'Gourmet hot cocoa', 'Couple journal', 'LED lights', 'Cosy socks pair', 'Spotify chill QR'], surprise: 'Mini Polaroid photo kit' }),
      mk({ id: 'cn3', image: 'https://picsum.photos/seed/cn3/420/280', name: 'Nest', tagline: 'The ultimate stay-in experience', price: 4299, badge: 'Best Value', items: ['Luxury candle set', 'Gourmet movie snack hamper', 'Premium streaming night box', 'Couple massage oil duo', 'Sherpa blanket set', 'Premium hot chocolate kit', 'Face mask duo', 'Projector night light'], surprise: 'Weighted eye mask duo' }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function BoxCard({ box, accent = '#FF6B00' }: { box: BoxItem; accent?: string }) {
  const [expanded, setExpanded] = useState(false);

  const handleOrder = () => {
    const msg = encodeURIComponent(
      `Hi! I'd like to order the *${box.name}* box (₹${box.price.toLocaleString('en-IN')}). Please share payment and delivery details.`
    );
    window.open(`https://wa.me/+91XXXXXXXXXX?text=${msg}`, '_blank');
  };

  const preview = expanded ? box.items : box.items.slice(0, 4);
  const extra = box.items.length - 4;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '0.5px solid rgba(255,255,255,0.07)',
        borderRadius: 11,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = `${accent}55`;
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = `0 8px 30px ${accent}12`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(255,255,255,0.07)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
   >
      {/* Product image */}
      {box.image && (
        <div style={{ width: '100%', height: 140, overflow: 'hidden' }}>
          <img src={box.image} alt={box.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* Festival tag */}
      {box.limited && box.festival && (
        <div style={{ background: `${accent}18`, borderBottom: `0.5px solid ${accent}28`, padding: '4px 13px', display: 'flex', alignItems: 'center', gap: 5 }}>
          {Ic.Sparkle(10)}
          <span style={{ fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{box.festival}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '13px 15px 11px', borderBottom: '0.5px solid rgba(255,255,255,0.05)', position: 'relative' }}>
        {box.badge && !box.limited && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: `${accent}18`, border: `0.5px solid ${accent}40`, color: accent, fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, padding: '2px 8px', borderRadius: 20, fontFamily: "'Syne', sans-serif" }}>
            {box.badge}
          </div>
        )}
        {box.badge && box.limited && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: '#92400E', color: '#FDE68A', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, padding: '2px 8px', borderRadius: 20, fontFamily: "'Syne', sans-serif", display: 'flex', alignItems: 'center', gap: 3 }}>
            {Ic.Sparkle(8)} Limited
          </div>
        )}
        <div style={{ fontFamily: "'Clash Display', 'Syne', sans-serif", fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', color: '#fff', marginBottom: 1 }}>{box.name}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'Syne', sans-serif", marginBottom: 9, lineHeight: 1.4 }}>{box.tagline}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Clash Display', 'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: accent, letterSpacing: '-0.02em' }}>₹{box.price.toLocaleString('en-IN')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(255,255,255,0.22)', fontSize: 9, fontFamily: "'Syne', sans-serif" }}>
            {Ic.Truck(10)}<span>{box.deliveryNote}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 15px', flex: 1 }}>
        <div style={{ fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 8 }}>INSIDE</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {preview.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: accent, flexShrink: 0 }}>{Ic.Check(10)}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.42)', fontFamily: "'Syne', sans-serif", lineHeight: 1.3 }}>{item}</span>
            </div>
          ))}
          {!expanded && extra > 0 && (
            <button onClick={() => setExpanded(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, color: accent, fontFamily: "'Syne', sans-serif", letterSpacing: '0.06em', textAlign: 'left', padding: '1px 0', marginTop: 1 }}>
              +{extra} more
            </button>
          )}
        </div>

        {/* Surprise */}
        <div style={{ marginTop: 10, padding: '6px 10px', background: `${accent}0b`, border: `0.5px solid ${accent}20`, borderRadius: 7, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: accent }}>{Ic.Star(11)}</span>
          <div>
            <div style={{ fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>SURPRISE</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.38)', fontFamily: "'Syne', sans-serif", marginTop: 1 }}>{box.surprise}</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 15px 13px' }}>
        <button
          onClick={handleOrder}
          style={{ width: '100%', background: accent, border: 'none', color: '#fff', padding: '9px', borderRadius: 7, cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
        >
          Order on WhatsApp {Ic.Arrow(11)}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI TEASER CARD (lightweight, for cross-link preview sections)
// ─────────────────────────────────────────────────────────────────────────────
function MiniBoxTeaser({ box, accent = '#FF6B00' }: { box: BoxItem; accent?: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '0.5px solid rgba(255,255,255,0.06)',
      borderRadius: 9,
      padding: '14px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      transition: 'border-color 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}40`; }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
    >
      {box.badge && (
        <div style={{ fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{box.badge}</div>
      )}
      <div style={{ fontFamily: "'Clash Display', 'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: '#fff' }}>{box.name}</div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', lineHeight: 1.4 }}>{box.tagline}</div>
      <div style={{ fontFamily: "'Clash Display', 'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: accent, marginTop: 2 }}>₹{box.price.toLocaleString('en-IN')}</div>
    </div>
  );
}


function RelatedGiftCard({ item, accent = '#FF6B00' }: { item: RelatedGift; accent?: string }) {
  const handleOrder = () => {
    const msg = encodeURIComponent(`Hi! I'd like to order *${item.name}* (₹${item.price.toLocaleString('en-IN')}). Please share payment and delivery details.`);
    window.open(`https://wa.me/+91XXXXXXXXXX?text=${msg}`, '_blank');
  };
  return (
    <div
      onClick={handleOrder}
      style={{ background: 'rgba(255,255,255,0.025)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}55`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
    >
      <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden' }}>
        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: '10px 11px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 3, lineHeight: 1.3, fontFamily: "'Syne', sans-serif" }}>{item.name}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: accent, fontFamily: "'Syne', sans-serif" }}>₹{item.price.toLocaleString('en-IN')}</div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR NAV ITEM
// ─────────────────────────────────────────────────────────────────────────────
function SideNavItem({
  cat, isActive, onClick, accent,
}: { cat: GiftCategory | DateCategory; isActive: boolean; onClick: () => void; accent: string }) {
  const gc = cat as GiftCategory;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        width: '100%', background: isActive ? `${accent}14` : 'none',
        border: 'none', borderLeft: isActive ? `2px solid ${accent}` : '2px solid transparent',
        cursor: 'pointer', padding: '9px 14px',
        transition: 'all 0.18s', textAlign: 'left',
      }}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
    >
      <span style={{ color: isActive ? accent : 'rgba(255,255,255,0.28)', flexShrink: 0, transition: 'color 0.18s' }}>
        {Ic[cat.icon as keyof typeof Ic]?.(14) ?? Ic.Gift(14)}
      </span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontSize: 11, fontWeight: 600, color: isActive ? '#fff' : 'rgba(255,255,255,0.45)', fontFamily: "'Syne', sans-serif", letterSpacing: '0.01em', transition: 'color 0.18s' }}>
          {cat.label}
        </span>
        {cat.sublabel && (
          <span style={{ display: 'block', fontSize: 9, color: 'rgba(255,255,255,0.22)', fontFamily: "'Syne', sans-serif", marginTop: 1 }}>
            {cat.sublabel}
          </span>
        )}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
        {gc.isNew && <span style={{ fontSize: 7, background: '#16A34A', color: '#fff', padding: '1px 6px', borderRadius: 10, letterSpacing: '0.1em', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>NEW</span>}
        {gc.isLimited && <span style={{ fontSize: 7, background: '#B45309', color: '#FEF3C7', padding: '1px 6px', borderRadius: 10, letterSpacing: '0.1em', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>LIMITED</span>}
        <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)', fontFamily: "'Syne', sans-serif" }}>{cat.boxes.length} boxes</span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function GiftBoxPage() {
  const [activeTab, setActiveTab] = useState<'gift' | 'datebox'>('gift');
  const [activeGiftCat, setActiveGiftCat] = useState('birthday');
  const [activeDateCat, setActiveDateCat] = useState('classic');

  const accent = '#FF6B00';
  const isGift = activeTab === 'gift';

  const currentGiftCat = GIFT_CATEGORIES.find(c => c.id === activeGiftCat) ?? GIFT_CATEGORIES[0];
  const currentDateCat = DATE_CATEGORIES.find(c => c.id === activeDateCat) ?? DATE_CATEGORIES[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0b09; }

        .page { min-height: 100vh; background: #0c0b09; color: #fff; font-family: 'Syne', sans-serif; }

        /* ── HERO ── */
        .hero { padding: 48px 44px 28px; position: relative; overflow: hidden; border-bottom: 0.5px solid rgba(255,255,255,0.05); }
        .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 10% 70%, rgba(255,107,0,0.09) 0%, transparent 50%); pointer-events: none; }
        .eyebrow { font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase; color: #FF6B00; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .eyebrow::before { content: ''; width: 20px; height: 0.5px; background: #FF6B00; display: block; }
        .hero-title { font-size: clamp(30px, 3.8vw, 48px); font-weight: 700; letter-spacing: -0.02em; line-height: 0.95; margin-bottom: 10px; }
        .hero-sub { font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.8; max-width: 400px; }

        /* ── INFO STRIP ── */
        .info-strip { display: grid; grid-template-columns: repeat(4,1fr); border: 0.5px solid rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .info-item { padding: 15px 16px; border-right: 0.5px solid rgba(255,255,255,0.05); display: flex; align-items: flex-start; gap: 10px; }
        .info-item:last-child { border-right: none; }
        .info-icon { width: 28px; height: 28px; border-radius: 7px; background: rgba(255,107,0,0.1); border: 0.5px solid rgba(255,107,0,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #FF6B00; }
        .info-title { font-size: 10px; font-weight: 700; color: #fff; margin-bottom: 2px; }
        .info-sub { font-size: 9px; color: rgba(255,255,255,0.25); line-height: 1.4; }

        /* ── MAIN TABS ── */
        .main-tabs { display: flex; padding: 0 44px; border-bottom: 0.5px solid rgba(255,255,255,0.05); margin-top: 24px; }
        .mtab { display: flex; align-items: center; gap: 8px; padding: 14px 22px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; cursor: pointer; background: none; border: none; color: rgba(255,255,255,0.25); border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; font-family: 'Syne', sans-serif; position: relative; bottom: -0.5px; }
        .mtab.active { color: #FF6B00; border-bottom-color: #FF6B00; }
        .mtab:hover:not(.active) { color: rgba(255,255,255,0.55); }

        /* ── LAYOUT ── */
        .layout { display: flex; min-height: calc(100vh - 300px); }

        /* ── SIDEBAR ── */
        .sidebar { width: 230px; flex-shrink: 0; border-right: 0.5px solid rgba(255,255,255,0.05); padding: 20px 0; position: sticky; top: 0; max-height: calc(100vh - 80px); overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent; }
        .sidebar-section { margin-bottom: 4px; }
        .sidebar-label { font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.15); font-weight: 700; padding: 8px 14px 4px; }

        /* ── MAIN AREA ── */
        .main-area { flex: 1; min-width: 0; padding: 28px 32px 60px; }

        .section-eyebrow { font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; color: #FF6B00; font-weight: 700; margin-bottom: 5px; }
        .section-title { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: #fff; margin-bottom: 4px; }
        .section-sub { font-size: 11px; color: rgba(255,255,255,0.28); margin-bottom: 20px; }

        .grid { display: grid; gap: 18px; }
        .g2 { grid-template-columns: repeat(2, 1fr); }
        .g3 { grid-template-columns: repeat(3, 1fr); }
        .g4 { grid-template-columns: repeat(4, 1fr); }

        /* ── DATE PREVIEW STRIP (in gift tab) ── */
        .date-preview { background: rgba(255,255,255,0.015); border: 0.5px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 20px 22px; margin-top: 36px; }
        .dp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .dp-title { font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.7); letter-spacing: -0.01em; }
        .dp-sub { font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 2px; }
        .view-all-btn { display: flex; align-items: center; gap: 5px; background: none; border: 0.5px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.35); border-radius: 6px; padding: 6px 12px; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Syne', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.18s; }
        .view-all-btn:hover { border-color: #FF6B00; color: #FF6B00; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .hero { padding: 36px 24px 22px; }
          .main-tabs { padding: 0 24px; }
          .info-strip { grid-template-columns: repeat(2,1fr); }
          .info-item:nth-child(2) { border-right: none; }
          .info-item:nth-child(3), .info-item:nth-child(4) { border-top: 0.5px solid rgba(255,255,255,0.05); }
          .sidebar { width: 190px; }
          .main-area { padding: 22px 20px 50px; }
          .g4 { grid-template-columns: repeat(2, 1fr); }
          .g3 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 720px) {
          .hero { padding: 28px 16px 18px; }
          .main-tabs { padding: 0 16px; }
          .mtab { padding: 12px 14px; font-size: 9px; }
          .layout { flex-direction: column; }
          .sidebar { width: 100%; position: static; max-height: none; border-right: none; border-bottom: 0.5px solid rgba(255,255,255,0.05); padding: 12px 0; display: flex; flex-direction: row; overflow-x: auto; gap: 0; scrollbar-width: none; }
          .sidebar-section { flex-shrink: 0; }
          .sidebar-label { display: none; }
          .main-area { padding: 18px 16px 48px; }
          .g4, .g3, .g2 { grid-template-columns: 1fr; }
          .info-strip { grid-template-columns: 1fr; }
          .info-item { border-right: none !important; border-top: 0.5px solid rgba(255,255,255,0.05); }
          .info-item:first-child { border-top: none; }
        }
      `}</style>

      <div className="page">

        {/* HERO */}
        <div className="hero">
          <div className="eyebrow">Pune Delivery · Same Day Available</div>
          <h1 className="hero-title">
            <span style={{ color: '#fff' }}>Gift &</span>{' '}
            <span style={{ color: '#FF6B00' }}>Date Boxes</span>
          </h1>
          <p className="hero-sub">Handcrafted boxes for every relationship, every occasion — delivered with love across Pune.</p>
        </div>

        {/* INFO STRIP */}
        <div style={{ padding: '18px 44px 0' }}>
          <div className="info-strip">
            {[
              { icon: Ic.Sun(13), title: 'Same Day Delivery', sub: 'Order before 3 PM in Pune' },
              { icon: Ic.Star(13), title: 'Quality Guaranteed', sub: 'Curated & checked before dispatch' },
              { icon: Ic.Edit(13), title: 'Easy Ordering', sub: 'WhatsApp order in 2 minutes' },
              { icon: Ic.Sparkle(13), title: 'Surprise Inside', sub: 'Every box has a hidden gift' },
            ].map((item, i) => (
              <div key={i} className="info-item">
                <div className="info-icon">{item.icon}</div>
                <div>
                  <div className="info-title">{item.title}</div>
                  <div className="info-sub">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN TABS */}
        <div className="main-tabs" style={{ marginTop: 20 }}>
          <button className={`mtab${activeTab === 'gift' ? ' active' : ''}`} onClick={() => setActiveTab('gift')}>
            {Ic.Gift(14)} Gift Boxes
          </button>
          <button className={`mtab${activeTab === 'datebox' ? ' active' : ''}`} onClick={() => setActiveTab('datebox')}>
            {Ic.Heart(14)} Date Boxes
          </button>
        </div>

        {/* LAYOUT */}
        <div className="layout">

          {/* ── SIDEBAR ── */}
          <div className="sidebar">
            {isGift ? (
              <>
                <div className="sidebar-label">Categories</div>
                {GIFT_CATEGORIES.map(cat => (
                  <SideNavItem
                    key={cat.id}
                    cat={cat}
                    isActive={activeGiftCat === cat.id}
                    onClick={() => setActiveGiftCat(cat.id)}
                    accent={accent}
                  />
                ))}
              </>
            ) : (
              <>
                <div className="sidebar-label">Date Types</div>
                {DATE_CATEGORIES.map(cat => (
                  <SideNavItem
                    key={cat.id}
                    cat={cat as unknown as GiftCategory}
                    isActive={activeDateCat === cat.id}
                    onClick={() => setActiveDateCat(cat.id)}
                    accent={accent}
                  />
                ))}
              </>
            )}
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="main-area">
            {isGift ? (
              <>
                {/* Current gift category */}
                <div className="section-eyebrow">
                  {currentGiftCat.isLimited ? 'Limited Edition · Season Special' : 'Gift Collection'}
                </div>
                <div className="section-title">{currentGiftCat.label}</div>
                <div className="section-sub">{currentGiftCat.sublabel}</div>

                <div className={`grid ${currentGiftCat.boxes.length >= 4 ? 'g4' : 'g3'}`}>
                  {currentGiftCat.boxes.map(box => (
                    <BoxCard key={box.id} box={box} accent={accent} />
                  ))}
                </div>


                {/* More gifts within this category */}
                {RELATED_GIFTS[currentGiftCat.id] && (
                  <div style={{ marginTop: 36 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 3, fontFamily: "'Syne', sans-serif" }}>
                      More {currentGiftCat.label}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 14, fontFamily: "'Syne', sans-serif" }}>
                      More ways to gift for this occasion
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                      {RELATED_GIFTS[currentGiftCat.id].map(item => (
                        <RelatedGiftCard key={item.id} item={item} accent={accent} />
                      ))}
                    </div>
                  </div>
                )}


                {/* Date box preview */}
                <div className="date-preview">
                  <div className="dp-header">
                    <div>
                      <div className="dp-title">Planning a Date Night?</div>
                      <div className="dp-sub">Check out our Date Boxes — curated for couples</div>
                    </div>
                    <button className="view-all-btn" onClick={() => setActiveTab('datebox')}>
                      View Date Boxes {Ic.Arrow(10)}
                    </button>
                  </div>
                  <div className="grid g3">
                    {DATE_CATEGORIES[0].boxes.slice(0, 3).map(box => (
                      <MiniBoxTeaser key={box.id} box={box} accent={accent} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Current date category */}
                <div className="section-eyebrow">Date Box Collection</div>
                <div className="section-title">{currentDateCat.label}</div>
                <div className="section-sub">{currentDateCat.sublabel}</div>

                <div className={`grid ${currentDateCat.boxes.length >= 4 ? 'g3' : 'g3'}`}>
                  {currentDateCat.boxes.map(box => (
                    <BoxCard key={box.id} box={box} accent={accent} />
                  ))}
                </div>

                {/* Gift preview */}
                <div className="date-preview">
                  <div className="dp-header">
                    <div>
                      <div className="dp-title">Looking for a Gift?</div>
                      <div className="dp-sub">Birthday, Wedding, Premium & more — 12 categories</div>
                    </div>
                    <button className="view-all-btn" onClick={() => setActiveTab('gift')}>
                      View Gift Boxes {Ic.Arrow(10)}
                    </button>
                  </div>
                 <div className="grid g4">
                    {GIFT_CATEGORIES[0].boxes.slice(0, 4).map(box => (
                      <MiniBoxTeaser key={box.id} box={box} accent={accent} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}