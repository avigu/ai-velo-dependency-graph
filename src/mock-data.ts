import { Extension } from './types';

export const MOCK_EXTENSIONS: Extension[] = [
  // ─── Components ────────────────────────────────────────────────────────────
  {
    id: 'cmp-product-card',
    name: 'ProductCard',
    type: 'component',
    category: 'site',
    status: 'active',
    description: 'Displays a single product with image, title, price, and an add-to-cart button.',
    author: 'alice@example.com',
    createdAt: '2024-01-10T09:00:00Z',
    modifiedAt: '2024-06-14T11:23:00Z',
    configFields: [
      {
        id: 'showRating',
        label: 'Show Rating Stars',
        type: 'toggle',
        value: true,
        description: 'Displays a 5-star rating below the product title.',
      },
      {
        id: 'imageAspectRatio',
        label: 'Image Aspect Ratio',
        type: 'select',
        value: '4:3',
        options: [
          { value: '1:1', label: 'Square (1:1)' },
          { value: '4:3', label: 'Landscape (4:3)' },
          { value: '16:9', label: 'Wide (16:9)' },
        ],
        description: 'Aspect ratio used when cropping product images.',
      },
      {
        id: 'buttonLabel',
        label: 'CTA Button Label',
        type: 'text',
        value: 'Add to Cart',
        placeholder: 'e.g. Buy Now',
      },
      {
        id: 'maxTitleLength',
        label: 'Max Title Characters',
        type: 'number',
        value: 60,
        description: 'Truncates product title after this many characters.',
      },
    ],
    codeFiles: [
      {
        name: 'ProductCard.tsx',
        language: 'typescript',
        content: `import React from 'react';
import { useProductContext } from '../contexts/ProductContext';

interface Props {
  productId: string;
  showRating?: boolean;
  buttonLabel?: string;
}

export const ProductCard: React.FC<Props> = ({
  productId,
  showRating = true,
  buttonLabel = 'Add to Cart',
}) => {
  const { getProduct, addToCart } = useProductContext();
  const product = getProduct(productId);

  if (!product) return null;

  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.title} />
      <h3>{product.title}</h3>
      {showRating && <StarRating value={product.rating} />}
      <span className="price">{product.formattedPrice}</span>
      <button onClick={() => addToCart(productId)}>{buttonLabel}</button>
    </div>
  );
};
`,
      },
      {
        name: 'ProductCard.css',
        language: 'css',
        content: `.product-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,.12);
}

.product-card img {
  width: 100%;
  object-fit: cover;
}

.product-card .price {
  font-weight: 700;
  color: #1a1a1a;
}

.product-card button {
  background: #116dff;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 0 0 8px 8px;
}
`,
      },
    ],
    history: [
      {
        id: 'h1',
        author: 'alice@example.com',
        timestamp: '2024-06-14T11:23:00Z',
        message: 'Add configurable CTA button label',
        diff: `@@ -12,7 +12,8 @@ interface Props {
   productId: string;
   showRating?: boolean;
+  buttonLabel?: string;
 }`,
      },
      {
        id: 'h2',
        author: 'bob@example.com',
        timestamp: '2024-03-20T14:10:00Z',
        message: 'Initial component scaffold',
        diff: `+ export const ProductCard: React.FC<Props> = ({ productId }) => {`,
      },
    ],
  },

  {
    id: 'cmp-hero-banner',
    name: 'HeroBanner',
    type: 'component',
    category: 'site',
    status: 'active',
    description: 'Full-width hero section with a background image, headline, subtitle, and CTA buttons.',
    author: 'bob@example.com',
    createdAt: '2024-02-05T08:30:00Z',
    modifiedAt: '2024-07-01T09:15:00Z',
    configFields: [
      {
        id: 'overlayOpacity',
        label: 'Overlay Opacity',
        type: 'number',
        value: 50,
        description: 'Dark overlay opacity (0–100) placed over the background image.',
      },
      {
        id: 'ctaVariant',
        label: 'CTA Button Variant',
        type: 'select',
        value: 'solid',
        options: [
          { value: 'solid', label: 'Solid' },
          { value: 'outline', label: 'Outline' },
          { value: 'ghost', label: 'Ghost' },
        ],
      },
      {
        id: 'showSubtitle',
        label: 'Show Subtitle',
        type: 'toggle',
        value: true,
      },
      {
        id: 'tags',
        label: 'Content Tags',
        type: 'tags',
        value: ['hero', 'landing', 'homepage'],
        description: 'Metadata tags for search and analytics.',
      },
    ],
    codeFiles: [
      {
        name: 'HeroBanner.tsx',
        language: 'typescript',
        content: `import React from 'react';

interface Props {
  headline: string;
  subtitle?: string;
  backgroundUrl: string;
  ctaLabel: string;
  ctaHref: string;
  overlayOpacity?: number;
}

export const HeroBanner: React.FC<Props> = ({
  headline,
  subtitle,
  backgroundUrl,
  ctaLabel,
  ctaHref,
  overlayOpacity = 50,
}) => (
  <section
    className="hero-banner"
    style={{ backgroundImage: \`url(\${backgroundUrl})\` }}
  >
    <div className="overlay" style={{ opacity: overlayOpacity / 100 }} />
    <div className="content">
      <h1>{headline}</h1>
      {subtitle && <p>{subtitle}</p>}
      <a href={ctaHref} className="cta-btn">{ctaLabel}</a>
    </div>
  </section>
);
`,
      },
    ],
    history: [
      {
        id: 'h3',
        author: 'bob@example.com',
        timestamp: '2024-07-01T09:15:00Z',
        message: 'Make overlay opacity configurable',
        diff: `+  overlayOpacity?: number;`,
      },
    ],
  },

  {
    id: 'cmp-review-widget',
    name: 'ReviewWidget',
    type: 'component',
    category: 'site',
    status: 'inactive',
    description: 'Renders customer reviews with star ratings, pagination, and optional media attachments.',
    author: 'carol@example.com',
    createdAt: '2024-03-12T10:00:00Z',
    modifiedAt: '2024-05-22T16:45:00Z',
    configFields: [
      {
        id: 'pageSize',
        label: 'Reviews Per Page',
        type: 'number',
        value: 5,
      },
      {
        id: 'showMedia',
        label: 'Show Media Attachments',
        type: 'toggle',
        value: false,
      },
      {
        id: 'sortOrder',
        label: 'Default Sort Order',
        type: 'select',
        value: 'newest',
        options: [
          { value: 'newest', label: 'Newest First' },
          { value: 'highest', label: 'Highest Rated' },
          { value: 'lowest', label: 'Lowest Rated' },
        ],
      },
    ],
    codeFiles: [
      {
        name: 'ReviewWidget.tsx',
        language: 'typescript',
        content: `import React, { useState } from 'react';
import { Review } from '../types';

interface Props {
  reviews: Review[];
  pageSize?: number;
}

export const ReviewWidget: React.FC<Props> = ({ reviews, pageSize = 5 }) => {
  const [page, setPage] = useState(0);
  const slice = reviews.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="review-widget">
      {slice.map(r => (
        <div key={r.id} className="review-item">
          <StarRating value={r.rating} />
          <p>{r.body}</p>
          <small>{r.author} — {new Date(r.date).toLocaleDateString()}</small>
        </div>
      ))}
      <Pagination
        current={page}
        total={Math.ceil(reviews.length / pageSize)}
        onChange={setPage}
      />
    </div>
  );
};
`,
      },
    ],
    history: [],
  },

  // ─── Contexts ──────────────────────────────────────────────────────────────
  {
    id: 'ctx-cart',
    name: 'CartContext',
    type: 'context',
    category: 'site',
    status: 'active',
    description: 'Provides shopping cart state (items, totals) and actions (add, remove, clear) to all child components.',
    author: 'alice@example.com',
    createdAt: '2024-01-15T10:00:00Z',
    modifiedAt: '2024-06-30T08:00:00Z',
    configFields: [
      {
        id: 'persistenceStrategy',
        label: 'Persistence Strategy',
        type: 'select',
        value: 'localStorage',
        options: [
          { value: 'localStorage', label: 'Local Storage' },
          { value: 'session', label: 'Session Storage' },
          { value: 'none', label: 'None (in-memory)' },
        ],
        description: 'How cart state is persisted between page reloads.',
      },
      {
        id: 'maxItems',
        label: 'Max Cart Items',
        type: 'number',
        value: 100,
      },
    ],
    codeFiles: [
      {
        name: 'CartContext.tsx',
        language: 'typescript',
        content: `import React, { createContext, useContext, useReducer } from 'react';

interface CartItem { productId: string; quantity: number; }
interface CartState { items: CartItem[]; }

type Action =
  | { type: 'ADD'; productId: string }
  | { type: 'REMOVE'; productId: string }
  | { type: 'CLEAR' };

const reducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case 'ADD':
      const existing = state.items.find(i => i.productId === action.productId);
      if (existing) {
        return { items: state.items.map(i =>
          i.productId === action.productId ? { ...i, quantity: i.quantity + 1 } : i
        )};
      }
      return { items: [...state.items, { productId: action.productId, quantity: 1 }] };
    case 'REMOVE':
      return { items: state.items.filter(i => i.productId !== action.productId) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
} | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  return (
    <CartContext.Provider value={{
      state,
      addToCart: (id) => dispatch({ type: 'ADD', productId: id }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE', productId: id }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
`,
      },
    ],
    history: [
      {
        id: 'h4',
        author: 'alice@example.com',
        timestamp: '2024-06-30T08:00:00Z',
        message: 'Add localStorage persistence',
        diff: `+ localStorage.setItem('cart', JSON.stringify(state));`,
      },
    ],
  },

  {
    id: 'ctx-user',
    name: 'UserContext',
    type: 'context',
    category: 'site',
    status: 'active',
    description: 'Exposes current member profile, login status, and permission checks to site components.',
    author: 'dave@example.com',
    createdAt: '2024-01-20T11:00:00Z',
    modifiedAt: '2024-04-18T13:30:00Z',
    configFields: [
      {
        id: 'guestLabel',
        label: 'Guest Display Name',
        type: 'text',
        value: 'Guest',
        placeholder: 'Name shown to unauthenticated visitors',
      },
    ],
    codeFiles: [
      {
        name: 'UserContext.tsx',
        language: 'typescript',
        content: `import React, { createContext, useContext, useEffect, useState } from 'react';
import { currentMember } from 'wix-members.v2';

interface User { id: string; name: string; email: string; roles: string[]; }

const UserContext = createContext<{ user: User | null; isLoggedIn: boolean } | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    currentMember().then(member => {
      if (member) {
        setUser({
          id: member.id,
          name: member.profile?.nickname ?? 'Guest',
          email: member.loginEmail ?? '',
          roles: member.roles?.map(r => r.roleId) ?? [],
        });
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
`,
      },
    ],
    history: [],
  },

  // ─── Functions ─────────────────────────────────────────────────────────────
  {
    id: 'fn-format-currency',
    name: 'formatCurrency',
    type: 'function',
    category: 'site',
    status: 'active',
    description: 'Formats a numeric amount into a locale-aware currency string using the Intl.NumberFormat API.',
    author: 'carol@example.com',
    createdAt: '2024-02-01T09:00:00Z',
    modifiedAt: '2024-02-01T09:00:00Z',
    configFields: [
      {
        id: 'defaultLocale',
        label: 'Default Locale',
        type: 'text',
        value: 'en-US',
        placeholder: 'e.g. de-DE, ja-JP',
      },
      {
        id: 'defaultCurrency',
        label: 'Default Currency',
        type: 'text',
        value: 'USD',
        placeholder: 'ISO 4217 code',
      },
    ],
    codeFiles: [
      {
        name: 'formatCurrency.ts',
        language: 'typescript',
        content: `/**
 * Formats a numeric amount into a locale-aware currency string.
 * @param amount   - The numeric value to format.
 * @param currency - ISO 4217 currency code (default: 'USD').
 * @param locale   - BCP 47 locale tag (default: 'en-US').
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
`,
      },
      {
        name: 'formatCurrency.test.ts',
        language: 'typescript',
        content: `import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formats USD', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });
  it('formats EUR with German locale', () => {
    expect(formatCurrency(9.99, 'EUR', 'de-DE')).toBe('9,99\u00a0€');
  });
  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});
`,
      },
    ],
    history: [],
  },

  {
    id: 'fn-slugify',
    name: 'slugify',
    type: 'function',
    category: 'site',
    status: 'active',
    description: 'Converts arbitrary text into a URL-friendly slug by lowercasing, trimming, and replacing whitespace with hyphens.',
    author: 'dave@example.com',
    createdAt: '2024-03-05T10:00:00Z',
    modifiedAt: '2024-03-05T10:00:00Z',
    configFields: [
      {
        id: 'separator',
        label: 'Word Separator',
        type: 'text',
        value: '-',
        placeholder: 'Character between words',
      },
    ],
    codeFiles: [
      {
        name: 'slugify.ts',
        language: 'typescript',
        content: `export function slugify(text: string, separator = '-'): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/[\\s_-]+/g, separator)
    .replace(/^-+|-+$/g, '');
}
`,
      },
    ],
    history: [],
  },

  // ─── Web Methods ───────────────────────────────────────────────────────────
  {
    id: 'wm-send-confirmation',
    name: 'sendOrderConfirmation',
    type: 'web-method',
    category: 'backend',
    status: 'active',
    description: 'Triggered after checkout; sends a transactional confirmation email via the Wix Triggered Emails API.',
    author: 'alice@example.com',
    createdAt: '2024-01-25T12:00:00Z',
    modifiedAt: '2024-06-10T15:30:00Z',
    configFields: [
      {
        id: 'templateId',
        label: 'Email Template ID',
        type: 'text',
        value: 'order-confirmation-v2',
        description: 'The Wix Triggered Emails template key.',
      },
      {
        id: 'replyTo',
        label: 'Reply-To Address',
        type: 'text',
        value: 'support@mystore.com',
      },
    ],
    codeFiles: [
      {
        name: 'sendOrderConfirmation.web.ts',
        language: 'typescript',
        content: `import { Permissions, webMethod } from 'wix-web-module';
import { triggeredEmails } from 'wix-crm-backend';

export const sendOrderConfirmation = webMethod(
  Permissions.Anyone,
  async (orderId: string, recipientEmail: string) => {
    await triggeredEmails.emailContact('order-confirmation-v2', recipientEmail, {
      variables: { orderId },
    });
    return { success: true };
  },
);
`,
      },
    ],
    history: [
      {
        id: 'h5',
        author: 'alice@example.com',
        timestamp: '2024-06-10T15:30:00Z',
        message: 'Switch to v2 template and add orderId variable',
        diff: `- 'order-confirmation'\n+ 'order-confirmation-v2', { variables: { orderId } }`,
      },
    ],
  },

  {
    id: 'wm-update-member',
    name: 'updateMemberProfile',
    type: 'web-method',
    category: 'backend',
    status: 'active',
    description: 'Allows authenticated members to update their display name and avatar URL from the client side.',
    author: 'bob@example.com',
    createdAt: '2024-04-01T09:00:00Z',
    modifiedAt: '2024-04-15T11:00:00Z',
    configFields: [
      {
        id: 'allowAvatarChange',
        label: 'Allow Avatar Change',
        type: 'toggle',
        value: true,
      },
    ],
    codeFiles: [
      {
        name: 'updateMemberProfile.web.ts',
        language: 'typescript',
        content: `import { Permissions, webMethod } from 'wix-web-module';
import { members } from 'wix-members-backend';

export const updateMemberProfile = webMethod(
  Permissions.Member,
  async (updates: { nickname?: string; avatarUrl?: string }) => {
    const current = await members.getCurrentMember();
    await members.updateMember(current.member!.id!, {
      member: {
        profile: {
          nickname: updates.nickname,
          photo: updates.avatarUrl ? { url: updates.avatarUrl } : undefined,
        },
      },
    });
    return { success: true };
  },
);
`,
      },
    ],
    history: [],
  },

  // ─── APIs ─────────────────────────────────────────────────────────────────
  {
    id: 'api-products',
    name: 'Products REST API',
    type: 'api',
    category: 'backend',
    status: 'active',
    description: 'Public HTTP endpoint returning paginated product catalogue data in JSON format.',
    author: 'carol@example.com',
    createdAt: '2024-01-30T14:00:00Z',
    modifiedAt: '2024-07-05T10:00:00Z',
    configFields: [
      {
        id: 'defaultPageSize',
        label: 'Default Page Size',
        type: 'number',
        value: 20,
      },
      {
        id: 'maxPageSize',
        label: 'Max Page Size',
        type: 'number',
        value: 100,
      },
      {
        id: 'enableCors',
        label: 'Enable CORS',
        type: 'toggle',
        value: true,
      },
    ],
    codeFiles: [
      {
        name: 'products.js',
        language: 'javascript',
        content: `import { ok, badRequest } from 'wix-http-functions';
import { products } from 'wix-stores-backend';

export async function get_products(request) {
  const { query } = request;
  const limit = Math.min(Number(query.limit) || 20, 100);
  const skip  = Number(query.skip) || 0;

  try {
    const result = await products.queryProducts()
      .limit(limit)
      .skip(skip)
      .find();
    return ok({
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: result.items, total: result.totalCount }),
    });
  } catch (err) {
    return badRequest({ body: JSON.stringify({ error: err.message }) });
  }
}
`,
      },
    ],
    history: [
      {
        id: 'h6',
        author: 'carol@example.com',
        timestamp: '2024-07-05T10:00:00Z',
        message: 'Cap page size at 100 to prevent abuse',
        diff: `+ const limit = Math.min(Number(query.limit) || 20, 100);`,
      },
    ],
  },

  {
    id: 'api-webhook',
    name: 'Stripe Webhook Handler',
    type: 'api',
    category: 'backend',
    status: 'active',
    description: 'Receives Stripe webhook events, verifies signatures, and triggers downstream order fulfillment.',
    author: 'dave@example.com',
    createdAt: '2024-03-20T16:00:00Z',
    modifiedAt: '2024-05-11T09:45:00Z',
    configFields: [
      {
        id: 'webhookSecret',
        label: 'Webhook Signing Secret',
        type: 'text',
        value: 'whsec_***',
        description: 'From your Stripe dashboard — keep this secret!',
      },
      {
        id: 'events',
        label: 'Handled Event Types',
        type: 'tags',
        value: ['payment_intent.succeeded', 'charge.refunded'],
      },
    ],
    codeFiles: [
      {
        name: 'stripeWebhook.js',
        language: 'javascript',
        content: `import { ok, badRequest } from 'wix-http-functions';
import { getSecret } from 'wix-secrets-backend';
import Stripe from 'stripe';

export async function post_stripe_webhook(request) {
  const body      = await request.body.text();
  const signature = request.headers['stripe-signature'];
  const secret    = await getSecret('STRIPE_WEBHOOK_SECRET');
  const stripe    = new Stripe(await getSecret('STRIPE_SECRET_KEY'));

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    return badRequest({ body: \`Webhook Error: \${err.message}\` });
  }

  if (event.type === 'payment_intent.succeeded') {
    await fulfillOrder(event.data.object.metadata.orderId);
  }

  return ok({ body: JSON.stringify({ received: true }) });
}
`,
      },
    ],
    history: [],
  },

  // ─── Event Handlers ────────────────────────────────────────────────────────
  {
    id: 'ev-order-paid',
    name: 'onOrderPaid',
    type: 'event-handler',
    category: 'backend',
    status: 'active',
    description: 'Fires when a Wix Stores order transitions to paid; assigns loyalty points and sends a thank-you notification.',
    author: 'alice@example.com',
    createdAt: '2024-02-10T10:00:00Z',
    modifiedAt: '2024-05-30T14:00:00Z',
    configFields: [
      {
        id: 'pointsPerDollar',
        label: 'Loyalty Points per Dollar',
        type: 'number',
        value: 10,
        description: 'How many points a customer earns per USD spent.',
      },
      {
        id: 'notificationTemplate',
        label: 'Notification Template ID',
        type: 'text',
        value: 'loyalty-points-earned',
      },
    ],
    codeFiles: [
      {
        name: 'events.js',
        language: 'javascript',
        content: `import { loyalty } from 'wix-loyalty-backend';
import { triggeredEmails } from 'wix-crm-backend';

export async function wixStores_onOrderPaid(event) {
  const { order } = event;
  const pointsEarned = Math.floor(order.totals.total * 10);

  await loyalty.adjustPoints(order.buyerInfo.contactId, pointsEarned);
  await triggeredEmails.emailContact(
    'loyalty-points-earned',
    order.buyerInfo.email,
    { variables: { points: String(pointsEarned) } },
  );
}
`,
      },
    ],
    history: [
      {
        id: 'h7',
        author: 'alice@example.com',
        timestamp: '2024-05-30T14:00:00Z',
        message: 'Send triggered email after points assignment',
        diff: `+ await triggeredEmails.emailContact(...)`,
      },
    ],
  },

  {
    id: 'ev-member-joined',
    name: 'onMemberRegistered',
    type: 'event-handler',
    category: 'backend',
    status: 'inactive',
    description: 'Triggered on new member registration; adds the member to a welcome email sequence and a default CRM label.',
    author: 'bob@example.com',
    createdAt: '2024-04-12T09:00:00Z',
    modifiedAt: '2024-04-12T09:00:00Z',
    configFields: [
      {
        id: 'defaultLabel',
        label: 'Default CRM Label',
        type: 'text',
        value: 'new-member',
      },
      {
        id: 'welcomeSequenceId',
        label: 'Automations Sequence ID',
        type: 'text',
        value: 'welcome-flow-2024',
      },
    ],
    codeFiles: [
      {
        name: 'memberEvents.js',
        language: 'javascript',
        content: `import { contacts } from 'wix-crm-backend';

export async function wixMembers_onMemberRegistered(event) {
  const { member } = event;
  await contacts.labelContact(member.contactId, ['new-member']);
}
`,
      },
    ],
    history: [],
  },

  // ─── Dashboard Pages ───────────────────────────────────────────────────────
  {
    id: 'dp-analytics',
    name: 'Sales Analytics',
    type: 'dashboard-page',
    category: 'dashboard',
    status: 'active',
    description: 'Custom dashboard page displaying real-time sales charts, top products, and revenue KPIs for site owners.',
    author: 'carol@example.com',
    createdAt: '2024-03-01T08:00:00Z',
    modifiedAt: '2024-07-10T12:00:00Z',
    configFields: [
      {
        id: 'defaultDateRange',
        label: 'Default Date Range',
        type: 'select',
        value: '30d',
        options: [
          { value: '7d', label: 'Last 7 Days' },
          { value: '30d', label: 'Last 30 Days' },
          { value: '90d', label: 'Last 90 Days' },
        ],
      },
      {
        id: 'showRevenueGoal',
        label: 'Show Revenue Goal Bar',
        type: 'toggle',
        value: true,
      },
      {
        id: 'currency',
        label: 'Display Currency',
        type: 'text',
        value: 'USD',
      },
    ],
    codeFiles: [
      {
        name: 'SalesAnalytics.tsx',
        language: 'typescript',
        content: `import React, { useEffect, useState } from 'react';
import { dashboard } from '@wix/dashboard';
import { LineChart, KpiCard } from '../components/charts';

export default function SalesAnalytics() {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);

  useEffect(() => {
    dashboard.fetchSalesMetrics({ range: '30d' }).then(setMetrics);
  }, []);

  if (!metrics) return <Spinner />;

  return (
    <div className="analytics-page">
      <h1>Sales Analytics</h1>
      <div className="kpi-row">
        <KpiCard label="Revenue" value={metrics.revenue} />
        <KpiCard label="Orders"  value={metrics.orders} />
        <KpiCard label="AOV"     value={metrics.aov} />
      </div>
      <LineChart data={metrics.dailySales} />
    </div>
  );
}
`,
      },
    ],
    history: [
      {
        id: 'h8',
        author: 'carol@example.com',
        timestamp: '2024-07-10T12:00:00Z',
        message: 'Add configurable date range selector',
        diff: `+ const [range, setRange] = useState('30d');`,
      },
    ],
  },

  {
    id: 'dp-inventory',
    name: 'Inventory Manager',
    type: 'dashboard-page',
    category: 'dashboard',
    status: 'active',
    description: 'Dashboard page for viewing and editing product inventory levels, with low-stock alerts and bulk update support.',
    author: 'dave@example.com',
    createdAt: '2024-04-20T11:00:00Z',
    modifiedAt: '2024-06-25T10:00:00Z',
    configFields: [
      {
        id: 'lowStockThreshold',
        label: 'Low Stock Threshold',
        type: 'number',
        value: 5,
        description: 'Products with quantity at or below this value are flagged.',
      },
      {
        id: 'enableBulkEdit',
        label: 'Enable Bulk Edit',
        type: 'toggle',
        value: true,
      },
    ],
    codeFiles: [
      {
        name: 'InventoryManager.tsx',
        language: 'typescript',
        content: `import React, { useEffect, useState } from 'react';
import { products } from 'wix-stores-backend';

export default function InventoryManager() {
  const [items, setItems] = useState([]);
  const LOW_STOCK = 5;

  useEffect(() => {
    products.queryProducts().find().then(r => setItems(r.items));
  }, []);

  return (
    <table>
      <thead>
        <tr><th>Product</th><th>Stock</th><th>Status</th></tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item._id} className={item.stock <= LOW_STOCK ? 'low-stock' : ''}>
            <td>{item.name}</td>
            <td>{item.stock}</td>
            <td>{item.stock <= LOW_STOCK ? '⚠ Low' : 'OK'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
      },
    ],
    history: [],
  },
];
