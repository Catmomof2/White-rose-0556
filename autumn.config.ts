import { feature, plan, item } from "atmn";

export const subscription = feature({
  id: "subscription",
  name: "Subscription",
  type: "boolean",
});

export const chatMessages = feature({
  id: "chat_messages",
  name: "Chat Messages",
  type: "metered",
  consumable: true,
});

export const ppvUnlock = feature({
  id: "ppv_unlock",
  name: "PPV Content Unlock",
  type: "metered",
  consumable: true,
});

export const free = plan({
  id: "free",
  name: "Free",
  autoEnable: true,
  items: [
    item({
      featureId: chatMessages.id,
      included: 5,
      reset: { interval: "month" },
    }),
    item({
      featureId: ppvUnlock.id,
      included: 0,
      reset: { interval: "month" },
    }),
  ],
});

export const subscriber = plan({
  id: "subscriber",
  name: "Subscriber",
  price: { amount: 999, interval: "month" },
  items: [
    item({
      featureId: subscription.id,
      included: 1,
    }),
    item({
      featureId: chatMessages.id,
      included: 100,
      reset: { interval: "month" },
    }),
    item({
      featureId: ppvUnlock.id,
      included: 0,
      reset: { interval: "month" },
    }),
  ],
});

export const vip = plan({
  id: "vip",
  name: "VIP",
  price: { amount: 2499, interval: "month" },
  items: [
    item({
      featureId: subscription.id,
      included: 1,
    }),
    item({
      featureId: chatMessages.id,
      unlimited: true,
    }),
    item({
      featureId: ppvUnlock.id,
      included: 5,
      reset: { interval: "month" },
    }),
  ],
});

export default {
  features: [subscription, chatMessages, ppvUnlock],
  plans: [free, subscriber, vip],
};
